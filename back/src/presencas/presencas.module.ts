import { Module } from '@nestjs/common';
import { PresencasService } from './presencas.service';
import { PresencasController } from './presencas.controller';

@Module({
  controllers: [PresencasController],
  providers: [PresencasService],
})
export class PresencasModule {}
