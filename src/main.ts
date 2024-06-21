import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Driver Salary API')
    .setDescription('API description for driver salaries')
    .setVersion('1.0')
    .build();
  app.setGlobalPrefix('v1');
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document);
  await app.listen(3000);
}
bootstrap();
