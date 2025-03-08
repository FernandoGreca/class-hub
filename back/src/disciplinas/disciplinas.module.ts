import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DisciplinasService } from './disciplinas.service';
import { DisciplinasController } from './disciplinas.controller';
import { Disciplina, DisciplinaSchema } from './entities/disciplina.entity';
import { PresencasModule } from 'src/presencas/presencas.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Disciplina.name, schema: DisciplinaSchema },
    ]),
    forwardRef(() => PresencasModule)
  ],
  providers: [DisciplinasService],
  controllers: [DisciplinasController],
  exports: [MongooseModule, DisciplinasService],
})
export class DisciplinasModule {}
