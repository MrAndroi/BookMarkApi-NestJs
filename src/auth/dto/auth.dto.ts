import { IsEmail, IsInt, IsNotEmpty, IsString } from "class-validator"

export class AuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    firstName: string
    lastName: string
}