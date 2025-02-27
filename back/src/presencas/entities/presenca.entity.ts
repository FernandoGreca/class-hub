import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Disciplina } from 'src/disciplinas/entities/disciplina.entity';

@Schema()
export class Presenca {

  @Prop({ default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ required: true })
  data: Date;

  @Prop({ required: true })
  presenca: boolean;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'Disciplina' })
  disciplina: Disciplina;

  // Verificar se será necessário colocar um campo que referencie um usuário...

  constructor(init: Partial<Presenca>) {
    Object.assign(this, init);
  }
}

export const PresencaSchema = SchemaFactory.createForClass(Presenca);