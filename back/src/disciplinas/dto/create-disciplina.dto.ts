import { ApiProperty } from '@nestjs/swagger';
import { Atividade } from 'src/atividades/entities/atividade.entity';
import { User } from 'src/users/entities/user.entity';

export class CreateDisciplinaDto {
  @ApiProperty()
  codigo_disciplina: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  carga_horaria: number;

  @ApiProperty()
  professores: Array<User>;

  @ApiProperty()
  alunos: Array<User>;
  
  @ApiProperty()
  atividades: Array<Atividade>;
}
