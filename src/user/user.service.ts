import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon from 'argon2';
import { S3Service } from 'src/aws/s3/s3.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserId } from './decorators';
import { UserDto } from './dto';

@Injectable()
export class UserService {

    constructor(private prisma: PrismaService, private s3: S3Service, private config: ConfigService) { }

    async getUserData(userId: number) {
        let user = await this.prisma.user.findUnique({
            where: {
                id: userId,
            }
        })
        delete user.hash
        return user
    }

    async updateUserData(user: UserDto, userId: number) {
        let updated = false
        try {
            updated = await this.prisma.user.update({
                where: {
                    id: userId
                },
                data: user
            }) != null
            return { data: updated }
        } catch (error) {
            return { data: updated, error: error }
        }
    }

    async updatePassword(oldPass: string, newPass: string, userId: number) {
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
            throw new ForbiddenException("Old password is incorrect")
        }
    }

    async updateAvatar(avatar: Express.Multer.File, userId: number) {
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
    }

    async updateUserImages(files: { user_images?: Express.Multer.File[] }) {
        let imgs = [];
        await Promise.all(files.user_images.map(async (file) => {
            let x = await this.s3.uploadFile(this.config.get("USERS_BUCKET"), file)
            imgs.push(x);
        }))
        return imgs
    }

}
