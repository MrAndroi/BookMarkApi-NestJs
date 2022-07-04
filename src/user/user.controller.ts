import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, Patch, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtGuard } from 'src/auth/guard';
import { UserId } from './decorators';
import { NewPasswordDto, UserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

    constructor(private userService: UserService) { }

    @Get('me')
    getUserData(
        @UserId() id: number,
        @I18n() i18n: I18nContext
    ) {
        return this.userService.getUserData(id, i18n)
    }

    @Patch('update')
    updateUserData(
        @Body() user: UserDto,
        @UserId() id: number,
        @I18n() i18n: I18nContext
    ) {
        return this.userService.updateUserData(user, id, i18n)
    }

    @Patch('update/password')
    updateUserPassword(
        @Body() body: NewPasswordDto,
        @UserId() id: number,
        @I18n() i18n: I18nContext
    ) {
        return this.userService.updatePassword(body.oldPassword, body.newPassword, id, i18n)
    }

    @Post('update/avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    updateAvatar(
        @UploadedFile() avatar: Express.Multer.File,
        @UserId() id: number,
        @I18n() i18n: I18nContext
    ) {
        return this.userService.updateAvatar(avatar, id, i18n)
    }

    @Post('add/media')
    @UseInterceptors(FileFieldsInterceptor([
        {
            name: "user_media",
            maxCount: 10,
        }
    ]))
    addUserMedia(
        @UploadedFiles() files: { user_media?: Express.Multer.File[] },
        @UserId() id: number,
        @I18n() i18n: I18nContext
    ) {
        return this.userService.addUserMedia(files.user_media, id, i18n)
    }

    @Get('media')
    getUserMedia(
        @UserId() id: number,
        @I18n() i18n: I18nContext
    ) {
        return this.userService.getUserMedia(id, i18n)
    }

    @Delete('delete/media/:id')
    deleteUserMedia(
        @UserId() id: number,
        @Param('id') mediaId: string,
        @I18n() i18n: I18nContext
    ) {
        return this.userService.deleteUserMedia(id, Number(mediaId), i18n)
    }

}
