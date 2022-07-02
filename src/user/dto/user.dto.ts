import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator"

export class UserDto {
    @IsOptional()
    @IsString({ message: 'validations.wrong_first_name' })
    @MinLength(3,{ message: 'validations.wrong_first_name' })
    firstName: string
    @IsOptional()
    @IsString({ message: 'validations.wrong_last_name' })
    @MinLength(3,{ message: 'validations.wrong_last_name' })
    lastName: string
}

export class NewPasswordDto {
    @IsString({ message: 'validations.wrong_password' })
    @MinLength(8, { message: 'validations.wrong__old_password' })
    oldPassword: string
    @IsString({ message: 'validations.wrong_password' })
    @MinLength(8, { message: 'validations.wrong_new_password' })
    newPassword: string
}