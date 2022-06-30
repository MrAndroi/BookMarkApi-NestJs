import { IsEmail, IsNotEmpty, IsNumber, IsString, ValidateIf } from "class-validator"

export class UserDto {
    @ValidateIf((object, value) => value)
    @IsString()
    firstName:string
    @ValidateIf((object, value) => value)
    @IsString()
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