import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { User, UserId } from './decorators';
import { NewPasswordDto, UserDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {

    constructor(private userService:UserService){}

    @Get('me')
    getUserData(@User() user:UserDto){
        return this.userService.getUserData(user)
    }

    @Patch('update')
    updateUserData(@Body() user:UserDto, @UserId() id:number){
        return this.userService.updateUserData(user,id)
    }

    @Patch('update/password')
    updateUserPassword(@Body() body:NewPasswordDto, @UserId() id:number){
        return this.userService.updatePassword(body.oldPassword,body.newPassword,id)
    }

}
