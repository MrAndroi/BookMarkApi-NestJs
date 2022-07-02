import { BadGatewayException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { I18nContext } from 'nestjs-i18n';
import { S3Service } from 'src/aws/s3/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService, private s3: S3Service, private config: ConfigService) { }

    async getUserData(
        userId: number,
        i18n: I18nContext
    ) {
        try {
            let user = await this.prisma.user.findUnique({
                where: {
                    id: userId,
                }
            })
            delete user.hash
            if (user == null) {
                throw new NotFoundException(await i18n.t('user_not_found'));
            }
            return user

        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }

    }

    async updateUserData(
        user: UserDto,
        userId: number,
        i18n: I18nContext
    ) {
        let updated = false
        try {
            updated = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: user
            }) != null
            return { data: updated }
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }
    }

    async updatePassword(
        oldPass: string,
        newPass: string,
        userId: number,
        i18n: I18nContext
    ) {
        try {
            //get user 
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })
            //check if old password is match current hash
            let isOldPasswordMatch = await argon.verify(user.hash, oldPass)

            if (isOldPasswordMatch) {
                //Generate new password hash
                const newPasswordHash = await argon.hash(newPass)
                //Set new hash to user
                user.hash = newPasswordHash
                //Update user in the data base
                let updated = false
                try {
                    updated = await this.prisma.user.update({
                        where: {
                            id: userId
                        },
                        data: {
                            hash: newPasswordHash
                        }
                    }) != null
                    return { updated: updated }
                }
                catch {
                    return { updated: updated }
                }

            }
            else {
                throw new ForbiddenException(await i18n.t('validations.wrong_old_password'))
            }
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }

    }

    async updateAvatar(
        avatar: Express.Multer.File,
        userId: number,
        i18n: I18nContext
    ) {
        try {
            let newAvatar = await this.s3.uploadFile(this.config.get("USERS_BUCKET"), avatar)
            let updated = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    avatar: newAvatar
                }
            }) != null
            return { data: updated }
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }

    }

    async addUserMedia(
        media: Express.Multer.File[],
        userId: number,
        i18n: I18nContext
    ) {
        try {
            let added = await Promise.all(media.map(async (file) => {
                let uploadedFile = await this.s3.uploadFile(this.config.get("USERS_BUCKET"), file)
                await this.prisma.userMedia.create({
                    data: {
                        url: uploadedFile,
                        userId: userId
                    }
                })
            })) != null
            return { data: added }
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }
    }

    async getUserMedia(
        userId: number,
        i18n: I18nContext
    ) {
        try {
            let media = await this.prisma.userMedia.findMany({
                where: {
                    userId: userId
                }
            })
            return { data: media }
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }
    }

    async deleteUserMedia(
        userId: number,
        mediaId: number,
        i18n: I18nContext
    ) {
        try {
            let media = await this.prisma.userMedia.findUnique({
                where: {
                    id: mediaId
                }
            })
            let deleted = false
            if (media == null) {
                throw new NotFoundException(await i18n.t('errors.media_not_found'))
            }
            else if (userId != media.userId) {
                throw new ForbiddenException(await i18n.t('errors.you_do_not_own_this_media'))
            }
            deleted = await this.prisma.userMedia.delete({
                where: {
                    id: mediaId
                }
            }) != null
            return { data: deleted }
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }
    }

}
