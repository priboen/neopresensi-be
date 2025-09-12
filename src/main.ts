import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    // origin: process.env.CORS_ORIGIN,
    origin: [
      process.env.CORS_FE,
      process.env.CORS_FE_LOCALHOST,
      process.env.CORS_MOBILE,
      process.env.CORS_FLASK,
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true,
  });
  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: '/',
        method: RequestMethod.GET,
      },
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('NeoPresensi API')
    .setDescription('API for NeoPresensi')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(
    '/api/docs',
    apiReference({
      spec: {
        content: document,
      },
    }),
  );
  // app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  // const port = Number(process.env.APP_PORT);
  // await app.listen(port);
  const port = Number(process.env.APP_PORT) || 4000;
  const host = String(process.env.APP_HOST);
  await app.listen(port, host);
  Logger.log(`Server running on http://${host}:${port}`);
}
bootstrap();
