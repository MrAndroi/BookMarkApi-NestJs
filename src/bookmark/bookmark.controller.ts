import { Body, Controller, Delete, Get, Headers, Param, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { I18n, I18nContext } from 'nestjs-i18n';
import { JwtGuard } from 'src/auth/guard';
import { PagingParamsDto } from 'src/shared/dto/paging.dto';
import { UserId } from 'src/user/decorators';
import { BookmarkService } from './bookmark.service';
import { BookmarkDto } from './dto';

@ApiBearerAuth()
@ApiHeader({
    name: 'localization',
    description: 'Add localization (ar-en) default en',
    required: false,
})
@ApiTags('Bookmarks')
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

    @SkipThrottle()
    @Get("all")
    getUserBookmarks(
        @UserId() id: number,
        @Query() pagingDto: PagingParamsDto,
        @I18n() i18n: I18nContext
    ) {
        return this.bookmarkService.getUserBookMarks(id, pagingDto, i18n)
    }
}
