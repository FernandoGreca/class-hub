import { forwardRef, Module } from '@nestjs/common';
import { AtividadesService } from './atividades.service';
import { AtividadesController } from './atividades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Atividade, AtividadeSchema } from './entities/atividade.entity';
import { DisciplinasService } from 'src/disciplinas/disciplinas.service';
import { DisciplinasModule } from 'src/disciplinas/disciplinas.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Atividade.name, schema: AtividadeSchema },
    ]),
    forwardRef(() => DisciplinasModule)
  ],
  controllers: [AtividadesController],
  providers: [AtividadesService],
})
export class AtividadesModule {}
