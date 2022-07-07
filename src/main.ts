import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { i18nValidationErrorFactory, I18nValidationExceptionFilter } from 'nestjs-i18n';
import { AppModule } from './app.module';
import { ExcludeNullInterceptor } from './interceptors';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //Validations for DTO's with localization using i81n
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: i18nValidationErrorFactory,
    }),
  )
  app.useGlobalFilters(new I18nValidationExceptionFilter({
    detailedErrors: false,
  }))

  //This will remove all null values from request and make it empty string
  app.useGlobalInterceptors(new ExcludeNullInterceptor())

  //Set up swagger documentation
  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Bookmark-API')
    .setDescription('This is test project for bookmark-api')
    .setVersion('1.0')
    .addTag('bookmarks')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();

