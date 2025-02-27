import { Module } from '@nestjs/common';
import { PresencasService } from './presencas.service';
import { PresencasController } from './presencas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Presenca, PresencaSchema } from './entities/presenca.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Presenca.name, schema: PresencaSchema },
    ]),
  ],
  controllers: [PresencasController],
  providers: [PresencasService],
})
export class PresencasModule {}
