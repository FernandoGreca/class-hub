import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { Disciplina } from 'src/disciplinas/entities/disciplina.entity';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class Presenca {

  @Prop({ default: () => new Types.ObjectId() })
  _id: string;

  @Prop({ required: true })
  data: Date;

  @Prop({ required: true })
  presenca: boolean;

  @Prop()
  disciplina: Disciplina;

  @Prop()
  aluno: User;

  constructor(init: Partial<Presenca>) {
    Object.assign(this, init);
  }
}

export const PresencaSchema = SchemaFactory.createForClass(Presenca);