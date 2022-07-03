import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator"

export class BookmarkDto {

    @IsString({ message: 'validations.wrong_bookmark_title' })
    @IsNotEmpty()
    title: string

    @IsUrl({},{ message: 'validations.wrong_bookmark_title' })
    @IsNotEmpty()
    link: string

    @IsOptional()
    @IsString()
    description: string
}