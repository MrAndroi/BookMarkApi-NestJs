import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { HttpErrorByCode } from '@nestjs/common/utils/http-error-by-code.util';
import { strings } from 'src/local';
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

    async deleteBookmark(bookmarkId: number, userNumber: number, language: string) {
        let bookmark = await this.prisma.bookmark.findUnique({
            include: {
                user: true
            },
            where: {
                id: bookmarkId
            }
        })

        let deleted = false
        if (bookmark == null) {
            throw new NotFoundException(strings.getString('bookmarkNotFound',language))
        }
        else if (userNumber != bookmark.user.id) {
            throw new ForbiddenException(strings.getString('youDonNotOwnThisBookmark',language))
        }

        deleted = await this.prisma.bookmark.delete({
            where: {
                id: bookmarkId
            }
        }) != null
        return { data: deleted }
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
            take: Number(pagingDto.limit),
            select: {
                title: true
            },
        })
        let nextKey: number = Number(pagingDto.page) + 1
        let prevKey: number = Number(pagingDto.page) == 0 ? 0 : Number(pagingDto.page) - 1
        let isNext: boolean = Number(nextBookmarks.length) > 1
        return new PagingResponse(
            bookmarks,
            nextKey,
            prevKey,
            isNext
        )
    }


}
