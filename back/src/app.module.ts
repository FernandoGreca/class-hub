import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { DisciplinasModule } from './disciplinas/disciplinas.module';
import { PresencasModule } from './presencas/presencas.module';
import { AtividadesModule } from './atividades/atividades.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

// mongodb+srv://admim:admim@cluster0.6rcxx.mongodb.net/projeto-faculdade - Banco liberado apenas para ip Fernando
// mongodb+srv://admim:admim@cluster0.qe1fc.mongodb.net/faculdade - Banco liberado para todos ip's

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://admim:admim@cluster0.qe1fc.mongodb.net/faculdade',
    ),
    ConfigModule.forRoot(),
    UsersModule,
    DisciplinasModule,
    PresencasModule,
    AtividadesModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
