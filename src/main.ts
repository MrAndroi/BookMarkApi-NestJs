import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { S3Service } from './aws/s3/s3.service';
import { ExcludeNullInterceptor } from './interceptors';
import { ErrorsInterceptor } from './interceptors/errors.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe(
    {
      //This will remove all attributes that is not defined in our dto
      whitelist: true
    }
  ))
  //This will remove all null values from request and make it empty string
  app.useGlobalInterceptors(new ExcludeNullInterceptor())
  //app.useGlobalInterceptors(new ErrorsInterceptor())

  //Set up s3 with app
  const s3Service = app.get(S3Service);
  const listBuckets = await s3Service.listBuckets();
  console.log({listBuckets})
  
  await app.listen(3000);
}
bootstrap();

