import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DisciplinasModule } from './disciplinas/disciplinas.module';
import { PresencasModule } from './presencas/presencas.module';
import { AtividadesModule } from './atividades/atividades.module';
import { UsersModule } from './users/users.module';
import { PresencasModule } from './presencas/presencas.module';
import { DisciplinasModule } from './disciplinas/disciplinas.module';
import { AtividadesModule } from './atividades/atividades.module';

@Module({
  imports: [MongooseModule.forRoot('mongodb+srv://admim:admim@cluster0.6rcxx.mongodb.net/projeto-faculdade'), UsersModule, DisciplinasModule, PresencasModule, AtividadesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
