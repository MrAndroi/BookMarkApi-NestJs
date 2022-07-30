import { BadGatewayException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, RoleAction } from '@prisma/client';
import * as argon from 'argon2';
import { I18nContext } from 'nestjs-i18n';
import { S3Service } from 'src/aws/s3/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagingParamsDto, PagingResponse } from 'src/shared/dto/paging.dto';
import { BasicResponse } from 'src/shared/entities';
import { transform, transformMany } from 'src/shared/extintions';
import { UserDto } from './dto';
import { UserEntity } from './entities';
import { RoleHistoryEntity } from './entities/role.history.entity';
import { UserMediaEntity } from './entities/user.media.entity';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService, private s3: S3Service, private config: ConfigService) { }

    async switchUserToAdmin(adminId: number, userId: number, i18n: I18nContext) {
        try {
            //Get Admin data
            let applierAdmin = await this.prisma.user.findUnique({
                where: {
                    id: adminId
                }
            })
            // Get User data
            let appliedOnUser = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    role: Role.ADMIN
                }
            })
            //Check if user exist
            if (appliedOnUser != null) {
                //Add new role history
                let roleHistory = await this.prisma.roleHistory.create({
                    data: {
                        applier: applierAdmin.email,
                        appliedOn: appliedOnUser.email,
                        action: RoleAction.FROM_USER_TO_ADMIN
                    }
                })

                //Return watcher history created or not
                return { data: roleHistory != null }
            }
            //Return false means that the operation was not succeed
            else {
                return { data: false }
            }
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }
    }

    async switchAdminToUser(superAdminId: number, adminId: number, i18n: I18nContext) {
        try {
            //Get Admin data
            let applierAdmin = await this.prisma.user.findUnique({
                where: {
                    id: superAdminId
                }
            })
            // Get User data
            let appliedOnAdmin = await this.prisma.user.update({
                where: {
                    id: adminId
                },
                data: {
                    role: Role.USER
                }
            })
            //Check if admin exist
            if (appliedOnAdmin != null) {
                //Add new role history
                let roleHistory = await this.prisma.roleHistory.create({
                    data: {
                        applier: applierAdmin.email,
                        appliedOn: appliedOnAdmin.email,
                        action: RoleAction.FROM_ADMIN_TO_USER
                    }
                })

                //Return watcher history created or not
                return { data: roleHistory != null }
            }
            //Return false means that the operation was not succeed
            else {
                return { data: false }
            }
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }
    }

    async getRolesHistory(pagingDto: PagingParamsDto, i18n: I18nContext) {
        try {
            let currentKey = Number(pagingDto.page)
            let limit = Number(pagingDto.limit)

            let nextKey: number = Number(pagingDto.page) + 1
            let prevKey: number = Number(pagingDto.page) == 0 ? 0 : Number(pagingDto.page) - 1

            let [history, isNext] = await this.prisma.$transaction([
                this.prisma.roleHistory.findMany({
                    skip: currentKey * limit,
                    take: limit
                }),
                this.prisma.roleHistory.count({
                    skip: nextKey * limit,
                    take: limit,
                })
            ])
            let transformedHistory = transformMany(history, {}, RoleHistoryEntity)
            return new PagingResponse(
                transformedHistory,
                nextKey,
                prevKey,
                isNext > 1
            )

        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }
    }

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
            if (user == null) {
                throw new NotFoundException(await i18n.t('user_not_found'));
            }

            let response: UserEntity = transform(user, { lang: i18n.lang }, UserEntity)
            return response

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
            let response: BasicResponse = transform({ data: updated }, {}, BasicResponse)
            return response
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
                let updated = await this.prisma.user.update({
                    where: {
                        id: userId
                    },
                    data: {
                        hash: newPasswordHash
                    }
                }) != null
                let response: BasicResponse = transform({ data: updated }, {}, BasicResponse)
                return response
            }
            else {
                throw new ForbiddenException(await i18n.t('validations.wrong_old_password'))
            }
        } catch (err) {
            throw new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
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
            let response: BasicResponse = transform({ data: updated }, {}, BasicResponse)
            return response
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
            let response: BasicResponse = transform({ data: added }, {}, BasicResponse)
            return response
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
            let response: UserMediaEntity[] = transformMany(media, {}, UserMediaEntity)
            return response
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
            let response: BasicResponse = transform({ data: deleted }, {}, BasicResponse)
            return response
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }
    }

}
