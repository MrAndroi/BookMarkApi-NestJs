import { Module } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { BookmarkController } from './bookmark.controller';
import { CurrentUserInterceptor } from 'src/shared/interceptors/user.interceptor';

@Module({
  providers: [BookmarkService, CurrentUserInterceptor],
  controllers: [BookmarkController]
})
export class BookmarkModule {}
