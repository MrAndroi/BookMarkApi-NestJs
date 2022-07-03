import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"


export class AuthDto {
    @IsEmail({},{ message: 'validations.wrong_email' })
    @MinLength(8, { message: 'validations.wrong_email' })
    email: string

    @IsString({ message: 'validations.wrong_new_password' })
    @MinLength(8, { message: 'validations.wrong_new_password' })
    password: string

    @IsOptional()
    @IsString({ message: 'validations.wrong_first_name' })
    @MinLength(3, { message: 'validations.wrong_first_name' })
    firstName: string

    @IsOptional()
    @IsString({ message: 'validations.wrong_last_name' })
    @MinLength(3, { message: 'validations.wrong_last_name' })
    lastName: string
}