import { forwardRef, Module } from '@nestjs/common';
import { PresencasService } from './presencas.service';
import { PresencasController } from './presencas.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Presenca, PresencaSchema } from './entities/presenca.entity';
import { UsersModule } from 'src/users/users.module';
import { DisciplinasModule } from 'src/disciplinas/disciplinas.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Presenca.name, schema: PresencaSchema },
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => DisciplinasModule)
  ],
  controllers: [PresencasController],
  providers: [PresencasService],
})
export class PresencasModule {}
