import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { i18nValidationErrorFactory, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { ExcludeNullInterceptor } from './interceptors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
    }),
  )
  app.useGlobalFilters(new I18nValidationExceptionFilter({
    detailedErrors:false,
  }))

  //This will remove all null values from request and make it empty string
  app.useGlobalInterceptors(new ExcludeNullInterceptor())
  //app.useGlobalInterceptors(new ErrorsInterceptor())

  await app.listen(3000);
}
bootstrap();

