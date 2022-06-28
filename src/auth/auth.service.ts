import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService{

    constructor(private prisma: PrismaService,private jwt: JwtService,private config: ConfigService){}

    async signUp(body:AuthDto){
        //Generate hash for password
        const hash = await argon.hash(body.password)

        //Save user To Postgres db
        try{
            const user = await this.prisma.user.create({
                data:{
                    email: body.email,
                    hash: hash,
                    firstName: body.firstName,
                    lastName: body.lastName
                }
            })
    
            //Return saved user data
            delete user.hash
            let accessToken = await this.signAccessToken(user.email,user.id)
            return {user:user,accessToken:accessToken}
        }
        catch(error){
            if(error instanceof PrismaClientKnownRequestError){
                if(error.code == 'P2002'){
                    throw new ForbiddenException("Already Taken Email")
                }
                return error
            }
        }
    }

    async signIn(body:AuthDto){
        //Find the user 
        const user = await this.prisma.user.findUnique({
            where:{
                email: body.email
            }
        })

        //Check if the user exists
        if(!user) throw new ForbiddenException("Incorrect Credentials")

        //Compare passwords
        const isPasswordMatches = await argon.verify(user.hash,body.password)

        //Check if user enter correct password
        if(isPasswordMatches) { 
            delete user.hash
            let accessToken = await this.signAccessToken(user.email,user.id)
            return {user:user,accessToken:accessToken}
         }
        else throw new ForbiddenException("Incorrect Credentials")

    }

    async signAccessToken(
        userEmail: string,
        userId: number,
    ) : Promise<string> {
        let payload = {
            sub:userId,
            userEmail
        }
        let accessToken = await this.jwt.signAsync(payload,{
            expiresIn: '1d',
            secret: this.config.get('JWT_SECRET')
        })
        return accessToken
    }

}