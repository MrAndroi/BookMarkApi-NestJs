import { BadGatewayException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { PrismaService } from 'src/prisma/prisma.service';
import { PagingParamsDto, PagingResponse } from 'src/shared/dto/paging.dto';
import { BookmarkDto } from './dto/bookmark.dto';
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
        try {
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
        } catch (err) {
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
            let currentKey = Number(pagingDto.page)
            let limit = Number(pagingDto.limit)

            let nextKey: number = Number(pagingDto.page) + 1
            let prevKey: number = Number(pagingDto.page) == 0 ? 0 : Number(pagingDto.page) - 1

            let [bookmarks, isNext] = await this.prisma.$transaction([
                this.prisma.bookmark.findMany({
                    where: {
                        userId: userId
                    },
                    skip: currentKey * limit,
                    take: limit
                }),
                this.prisma.bookmark.count({
                    where: {
                        userId: userId
                    },
                    skip: nextKey * limit,
                    take: limit,
                })
            ])
            return new PagingResponse(
                bookmarks,
                nextKey,
                prevKey,
                isNext > 1
            )
        } catch (err) {
            throw await new BadGatewayException(await i18n.t('errors.general_error', { args: { error: err.message } }))
        }

    }


}
