import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
import { PagingParamsDto } from 'src/shared/dto/dto.paging';
import { UserId } from 'src/user/decorators';
import { BookmarkService } from './bookmark.service';
import { BookmarkDto } from './dto';

@UseGuards(JwtGuard)
@Controller('bookmark')
export class BookmarkController {

    constructor(private bookmarkService: BookmarkService) { }

    @Post("addNewBookMark")
    addNewBookMark(@Body() body: BookmarkDto, @UserId() id: number) {
        return this.bookmarkService.addNewBookMark(body, id)
    }

    @Get("all")
    getUserBookmarks(@UserId() id: number, @Query() pagingDto: PagingParamsDto) {
        return this.bookmarkService.getUserBookMarks(id, pagingDto)
    }
}
