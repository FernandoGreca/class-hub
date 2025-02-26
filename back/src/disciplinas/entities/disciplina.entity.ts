import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Atividade } from 'src/atividades/entities/atividade.entity';
import { User } from 'src/users/entities/user.entity';

@Schema()
export class Disciplina {
  @Prop({ required: true, unique: true })
  codigo_disciplina: string;

  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  descricao: string;

  @Prop({ required: true })
  carga_horaria: number;

  @Prop()
  professores: Array<User>;

  @Prop()
  alunos: Array<User>;

  @Prop()
  atividades: Array<Atividade>;

  constructor(init: Partial<Disciplina>) {
    Object.assign(this, init);
  }
}

export const DisciplinaSchema = SchemaFactory.createForClass(Disciplina);