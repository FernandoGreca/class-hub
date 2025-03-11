import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class Presenca {
  @Prop({ default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ required: true })
  data: Date;

  @Prop({ required: true })
  presenca: boolean;

  @Prop({ required: true, unique: false })
  codigo_disciplina: string;

  @Prop({ required: true })
  id_aluno: string;

  constructor(init: Partial<Presenca>) {
    Object.assign(this, init);
  }
}
export const PresencaSchema = SchemaFactory.createForClass(Presenca);
