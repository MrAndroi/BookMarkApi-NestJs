import {
    Body, ClassSerializerInterceptor, Controller,
    Delete, Get, Param, Patch, Post, Query,
    UploadedFile, UploadedFiles, UseGuards,
    UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiHeader, ApiSecurity } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Role } from '@prisma/client';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtGuard } from 'src/auth/guard';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { Roles } from 'src/shared/decorators';
import { ApiFile, ApiMultiFile } from 'src/shared/decorators/swagger.decorator';
import { PagingParamsDto } from 'src/shared/dto/paging.dto';
import { UserId } from './decorators';
import { NewPasswordDto, UserDto } from './dto';
import { UserEntity } from './entities';
import { UserService } from './user.service';

@ApiBearerAuth()
@ApiHeader({
    name: 'localization',
    description: 'Add localization (ar-en) default en',
    required: false,
})
@UseGuards(JwtGuard, RolesGuard)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {

    constructor(private userService: UserService) { }

    @Throttle(10,60)
    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Patch("make/admin/:userId")
    switchUserToAdmin(@UserId() adminId: number, @Param('userId') userId: number, @I18n() i18n: I18nContext) {
        return this.userService.switchUserToAdmin(adminId, Number(userId), i18n)
    }

    @Roles(Role.SUPER_ADMIN)
    @Patch("make/user/:adminId")
    switchAdminToUser(@UserId() superAdminId: number, @Param('adminId') adminId: number, @I18n() i18n: I18nContext) {
        return this.userService.switchAdminToUser(superAdminId, Number(adminId), i18n)
    }

    @Roles(Role.ADMIN, Role.SUPER_ADMIN)
    @Get("roles/history")
    getRoleHistory(@Query() pagingDto: PagingParamsDto, @I18n() i18n: I18nContext) {
        return this.userService.getRolesHistory(pagingDto, i18n)
    }


    @Get('me')
    async getUserData(
        @UserId() id: number,
        @I18n() i18n: I18nContext
    )  : Promise<UserEntity> {
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

    @ApiConsumes('multipart/form-data')
    @ApiFile('avatar')
    @Post('update/avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    updateAvatar(
        @UploadedFile() avatar: Express.Multer.File,
        @UserId() id: number,
        @I18n() i18n: I18nContext
    ) {
        return this.userService.updateAvatar(avatar, id, i18n)
    }

    @ApiConsumes('multipart/form-data')
    @ApiMultiFile('user_media')
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
