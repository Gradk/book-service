import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';
import { AuthGuard } from '@nestjs/passport';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  await app.listen(PORT, () =>
    console.log(`[server started on port ${PORT} ...]`),
  );
}
start();
