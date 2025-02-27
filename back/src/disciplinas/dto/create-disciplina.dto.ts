import { ApiProperty } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { Atividade } from 'src/atividades/entities/atividade.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateDisciplinaDto {
  
  _id: string;

  @ApiProperty({ required: true })
  codigo_disciplina: string;

  @ApiProperty({ required: true })
  nome: string;

  @ApiProperty({ required: true })
  descricao: string;

  @ApiProperty({ required: true })
  carga_horaria: number;

  @ApiProperty({ required: false })
  professores: Array<User>;

  @ApiProperty({ required: false })
  alunos: Array<User>;

  @ApiProperty({ required: false })
  atividades: Array<Atividade>;
}
