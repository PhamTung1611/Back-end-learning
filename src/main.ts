import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import {
  DocumentBuilder,
  SwaggerModule,
} from '@nestjs/swagger';

async function bootstrap() {
  const app =
    await NestFactory.create(
      AppModule,
    );

  const config =
    new DocumentBuilder()
      .setTitle(
        'Learning API',
      )
      .setDescription(
        'API documentation cho hệ thống học ngoại ngữ',
      )
      .setVersion('1.0')
      // Cho phép nhập Bearer Access Token
      .addBearerAuth()

      .build();

  const document =
    SwaggerModule.createDocument(
      app,
      config,
    );

  SwaggerModule.setup(
    'api-docs',
    app,
    document,
  );

  await app.listen(3000);
}

bootstrap();