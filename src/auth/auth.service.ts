import { BadGatewayException, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { I18nContext } from "nestjs-i18n";
import { AuthDto } from "./dto";

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwt: JwtService, private config: ConfigService) { }

    async signUp(
        body: AuthDto,
        i18n: I18nContext
    ) {
        //Generate hash for password
        const hash = await argon.hash(body.password)

        //Save user To Postgres db
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: body.email,
                    hash: hash,
                    firstName: body.firstName,
                    lastName: body.lastName
                }
            })

            //Return saved user data
            delete user.hash
            let accessToken = await this.signAccessToken(user.email, user.id)
            return { user: user, accessToken: accessToken }
        }
        catch (err) {
            if (err instanceof PrismaClientKnownRequestError) {
                if (err.code == 'P2002') {
                    throw new ForbiddenException(await i18n.t('errors.email_already_taken'))
                }
                throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
            }
        }
    }

    async signIn(
        body: AuthDto,
        i18n: I18nContext
    ) {
        try {
            //Find the user 
            const user = await this.prisma.user.findUnique({
                where: {
                    email: body.email
                }
            })

            //Check if the user exists
            if (!user) throw new ForbiddenException(await i18n.t('errors.user_not_found'))

            //Compare passwords
            const isPasswordMatches = await argon.verify(user.hash, body.password)

            //Check if user enter correct password
            if (isPasswordMatches) {
                delete user.hash
                let accessToken = await this.signAccessToken(user.email, user.id)
                return { user: user, accessToken: accessToken }
            }
            else throw new ForbiddenException(await i18n.t('errors.wrong_credentials'))

        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }

    }

    async signAccessToken(
        userEmail: string,
        userId: number,
    ): Promise<string> {
        let payload = {
            sub: userId,
            userEmail
        }
        let accessToken = await this.jwt.signAsync(payload, {
            expiresIn: '1d',
            secret: this.config.get('JWT_SECRET')
        })
        return accessToken
    }

}