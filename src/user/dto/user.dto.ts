import { IsEmail, IsNotEmpty, IsNumber } from "class-validator"

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