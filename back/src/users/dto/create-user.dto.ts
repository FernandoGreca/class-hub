import { ApiProperty } from '@nestjs/swagger';
import { Disciplina } from 'src/disciplinas/entities/disciplina.entity';
import { Presenca } from 'src/presencas/entities/presenca.entity';

export class CreateUserDto {
  @ApiProperty({ required: true })
  nome: string;

  @ApiProperty({ required: true })
  email: string;

  @ApiProperty({ required: true })
  senha: string;

  matricula: string;

  @ApiProperty()
  ano: number;

  @ApiProperty()
  e_professor: boolean;

  @ApiProperty()
  disciplinas: Array<Disciplina>;

  @ApiProperty()
  presencas: Array<Presenca>;
}
