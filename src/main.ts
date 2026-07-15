import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { RESPONSE_MESSAGES } from './common/constants/response.constants';
import { ApiResponseHelper } from './common/helpers/api-response.helper';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) =>
        new BadRequestException(
          ApiResponseHelper.error(RESPONSE_MESSAGES.VALIDATION_FAILED, errors),
        ),
    }),
  );

  const port = Number(process.env.PORT) || 8000;

  await app.listen(port, '0.0.0.0');
}
bootstrap();
