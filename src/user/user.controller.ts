import { Body, Controller, Get, Patch, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { JwtGuard } from 'src/auth/guard';
import { multerOptions } from 'src/interceptors';
import { User, UserId } from './decorators';
import { NewPasswordDto, UserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService: UserService) { }

    @Get('me')
    getUserData(@User() user: UserDto) {
        return this.userService.getUserData(user)
    }

    @Patch('update')
    updateUserData(@Body() user: UserDto, @UserId() id: number) {
        return this.userService.updateUserData(user, id)
    }

    @Patch('update/password')
    updateUserPassword(@Body() body: NewPasswordDto, @UserId() id: number) {
        return this.userService.updatePassword(body.oldPassword, body.newPassword, id)
    }

    @Post('update/avatar')
    @UseInterceptors(FileInterceptor('avatar'))
    updateAvatar(@UploadedFile() avatar: Express.Multer.File, @UserId() id: number) {
        return this.userService.updateAvatar(avatar,id)
    }

    @Post('update/images')
    @UseInterceptors(FileFieldsInterceptor([
        {
            name: "user_images",
            maxCount: 10,
        }
    ]))
    uploadUserImages(@UploadedFiles() files: { user_images?: Express.Multer.File[] }) {
        return this.userService.updateUserImages(files)
    }

}
