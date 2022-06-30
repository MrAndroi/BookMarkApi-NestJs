import { Module } from '@nestjs/common';
import { S3Module } from 'src/aws/s3/s3.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports:[S3Module]
})
export class UserModule {}
