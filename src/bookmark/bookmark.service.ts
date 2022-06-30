import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagingParamsDto, PagingResponse } from 'src/shared/dto/dto.paging';
import { BookmarkDto } from './dto';

@Injectable()
export class BookmarkService {

    constructor(private prisma: PrismaService) { }


    async addNewBookMark(body: BookmarkDto, userNumber: number) {
        let bookmark = await this.prisma.bookmark.create({
            data: {
                link: body.link,
                title: body.title,
                description: body.description,
                userId: userNumber,
            }
        })
        return { data: bookmark != null }
    }

    async getUserBookMarks(userId: number, pagingDto: PagingParamsDto) {
        let bookmarks = await this.prisma.bookmark.findMany({
            where: {
                userId: userId
            },
            skip: Number(pagingDto.page) * Number(pagingDto.limit),
            take: Number(pagingDto.limit)
        })
        let nextBookmarks = await this.prisma.bookmark.findMany({
            where: {
                userId: userId
            },
            skip: Number(pagingDto.page) * Number(pagingDto.limit),
            take: Number(pagingDto.limit)
        })
        return new PagingResponse(
            bookmarks,
            Number(pagingDto.page) + 1,
            Number(pagingDto.page) - 1,
            Number(nextBookmarks.length) > 1
        )
    }
}
