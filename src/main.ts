import { NestFactory } from '@nestjs/core';
import { json } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '25mb' }));
  app.enableCors();
  const port = process.env.PORT || 3002;

  await app.listen(port, '0.0.0.0', () =>
    console.log(`server up and running on ${port}`),
  );
}
bootstrap();
