import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Disciplina } from 'src/disciplinas/entities/disciplina.entity';

@Schema()
export class Atividade {
  @Prop({ default: () => new Types.ObjectId() })
    _id: string;

  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  descricao: string;

  @Prop({ required: true })
  nota: number;

  @Prop()
  data_entrega: Date;

  @Prop()
  disciplina: Disciplina;

  constructor(init: Partial<Atividade>) {
    Object.assign(this, init);
  }
}

export const AtividadeSchema = SchemaFactory.createForClass(Atividade);