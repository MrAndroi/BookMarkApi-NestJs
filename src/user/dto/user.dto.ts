import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class UserDto {
    id:number
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsNotEmpty()
    firstName:string
    @IsNotEmpty()
    lastName: string
}

export class NewPasswordDto{
    @IsNotEmpty()
    @IsString()
    oldPassword: string
    @IsNotEmpty()
    @IsString()
    newPassword: string
}