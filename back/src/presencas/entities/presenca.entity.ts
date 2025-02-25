import { Prop, Schema } from '@nestjs/mongoose';
import { Disciplina } from 'src/disciplinas/entities/disciplina.entity';

@Schema()
export class Presenca {
  @Prop({ required: true })
  data: Date;

  @Prop({ required: true })
  presenca: boolean;

  @Prop({ required: true })
  disciplina: Disciplina;

  constructor(init: Partial<Presenca>) {
    Object.assign(this, init);
  }
}
