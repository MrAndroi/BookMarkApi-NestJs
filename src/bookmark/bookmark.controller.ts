import { Body, Controller, Delete, Get, Headers, Param, Post, Query, UseGuards } from '@nestjs/common';
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
    addNewBookMark(@Body() body: BookmarkDto, @UserId() id: number) {
        return this.bookmarkService.addNewBookMark(body, id)
    }

    @Delete("deleteBookmark/:id")
    deleteBookmark(
        @Param('id') bookmarkId: string,
        @UserId() userId: number,
        @Headers('localization') language: string = 'en'
    ) {
        return this.bookmarkService.deleteBookmark(Number(bookmarkId), userId, language)
    }

    @Get("all")
    getUserBookmarks(@UserId() id: number, @Query() pagingDto: PagingParamsDto) {
        return this.bookmarkService.getUserBookMarks(id, pagingDto)
    }
}
