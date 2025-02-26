import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisciplinasService } from './disciplinas.service';
import { DisciplinasController } from './disciplinas.controller';
import { Disciplina, DisciplinaSchema } from './entities/disciplina.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Disciplina.name, schema: DisciplinaSchema },
    ]),
  ],
  providers: [DisciplinasService],
  controllers: [DisciplinasController],
  exports: [MongooseModule],
})
export class DisciplinasModule {}
