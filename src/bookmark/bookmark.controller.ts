import { Body, Controller, Delete, Get, Headers, Param, Post, Query, UseGuards } from '@nestjs/common';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtGuard } from 'src/auth/guard';
import { PagingParamsDto } from 'src/shared/dto/dto.paging';
import { UserId } from 'src/user/decorators';
import { BookmarkService } from './bookmark.service';
import { BookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) { }

    @Post("addNewBookmark")
    addNewBookMark(
        @Body() body: BookmarkDto,
        @UserId() id: number,
        @I18n() i18n: I18nContext
    ) {
        return this.bookmarkService.addNewBookMark(body, id, i18n)
    }

    @Delete("deleteBookmark/:id")
    deleteBookmark(
        @Param('id') bookmarkId: string,
        @UserId() userId: number,
        @I18n() i18n: I18nContext
    ) {
        return this.bookmarkService.deleteBookmark(Number(bookmarkId), userId, i18n)
    }

    @Get("all")
    getUserBookmarks(
        @UserId() id: number,
        @Query() pagingDto: PagingParamsDto,
        @I18n() i18n: I18nContext
    ) {
        return this.bookmarkService.getUserBookMarks(id, pagingDto, i18n)
    }
}
