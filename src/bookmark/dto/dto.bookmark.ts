import { IsNotEmpty, IsString, ValidateIf } from "class-validator"

export class BookmarkDto {
    @IsString()
    @IsNotEmpty()
    title: string

    @IsString()
    @IsNotEmpty()
    link: string

    @ValidateIf((object, value) => value)
    @IsString()
    description: string
}