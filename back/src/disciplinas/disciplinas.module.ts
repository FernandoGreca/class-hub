import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisciplinasService } from './disciplinas.service';
import { DisciplinasController } from './disciplinas.controller';
import { Disciplina, DisciplinaSchema } from './entities/disciplina.entity';
import { PresencasModule } from 'src/presencas/presencas.module';
import { UsersModule } from 'src/users/users.module';
import { AtividadesModule } from 'src/atividades/atividades.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Disciplina.name, schema: DisciplinaSchema },
    ]),
    forwardRef(() => PresencasModule),
    forwardRef(() => UsersModule),
    forwardRef(() => AtividadesModule),
  ],
  providers: [DisciplinasService],
  controllers: [DisciplinasController],
  exports: [MongooseModule, DisciplinasService],
})
export class DisciplinasModule {}
