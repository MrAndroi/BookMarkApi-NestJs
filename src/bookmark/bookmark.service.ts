import { BadGatewayException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagingParamsDto, PagingResponse } from 'src/shared/dto/dto.paging';
import { BookmarkDto } from './dto';

@Injectable()
export class BookmarkService {

    constructor(private prisma: PrismaService) { }


    //Add New Bookmark to specific user
    async addNewBookMark(
        body: BookmarkDto,
        userNumber: number,
        i18n: I18nContext
    ) {
        try {
            let bookmark = await this.prisma.bookmark.create({
                data: {
                    link: body.link,
                    title: body.title,
                    description: body.description,
                    userId: userNumber,
                }
            })
            return { data: bookmark != null }
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }

    }


    //Delete specific Bookmark from specific user
    async deleteBookmark(
        bookmarkId: number,
        userNumber: number,
        i18n: I18nContext
    ) {
        try{
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
                throw new NotFoundException(await i18n.t('errors.bookmark_not_found'))
            }
            else if (userNumber != bookmark.userId) {
                throw new ForbiddenException(await i18n.t('errors.you_don_not_own_this_bookmark'))
            }
    
            deleted = await this.prisma.bookmark.delete({
                where: {
                    id: bookmarkId
                }
            }) != null
            return { data: deleted }
        } catch(err){
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }
        
    }

    //Get all user bookmarks with pagination
    async getUserBookMarks(
        userId: number,
        pagingDto: PagingParamsDto,
        i18n: I18nContext
    ) {
        try {
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
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }

    }


}
