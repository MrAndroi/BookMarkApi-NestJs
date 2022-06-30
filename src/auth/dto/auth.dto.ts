import { IsEmail, IsInt, IsNotEmpty, IsString, ValidateIf } from "class-validator"


export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @ValidateIf((object, value) => value)
    @IsString()
    firstName: string

    @ValidateIf((object, value) => value)
    @IsString()
    lastName: string
}