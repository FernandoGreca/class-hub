import { Module } from '@nestjs/common';
import { AtividadesService } from './atividades.service';
import { AtividadesController } from './atividades.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Atividade, AtividadeSchema } from './entities/atividade.entity';

@Module({
  imports: [MongooseModule.forFeature([
        { name: Atividade.name, schema: AtividadeSchema },
      ]),],
  controllers: [AtividadesController],
  providers: [AtividadesService],
})
export class AtividadesModule {}
