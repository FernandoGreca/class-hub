import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

export class NotaAluno {
  @Prop({ required: true })
  id_aluno: string;
  @Prop({ required: true })
  nome_aluno: string;
  @Prop({ required: true })
  nota: number;
}

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

  @Prop({ required: true })
  disciplina: string;

  @Prop()
  nota_alunos: Array<NotaAluno>;

  constructor(init: Partial<Atividade>) {
    Object.assign(this, init);
  }
}

export const AtividadeSchema = SchemaFactory.createForClass(Atividade);
