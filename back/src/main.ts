import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Faculdade Projeto')
    .setDescription(
      'Esta documentação vem com o objetivo de facilitar o teste das APIs que estão sendo feitos no projeto backend',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);

  console.log(`🚀 Servidor rodando na porta ${process.env.PORT}`);
}
bootstrap();
