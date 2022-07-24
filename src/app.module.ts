import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { AcceptLanguageResolver, HeaderResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { S3Service } from './aws/s3/s3.service';
import { BookmarkModule } from './bookmark/bookmark.module';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    AuthModule,
    UserModule,
    BookmarkModule,
    PrismaModule,
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 20
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: HeaderResolver, options: ['localization'] },
        AcceptLanguageResolver,
      ],
    })
  ],
  providers: [S3Service],
  controllers: [AppController],
})
export class AppModule { }
