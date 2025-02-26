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

  @ApiProperty({ required: true })
  ano: number;

  @ApiProperty({ required: false })
  e_professor: boolean;

  @ApiProperty({ required: false })
  disciplinas: Array<Disciplina>;

  @ApiProperty({ required: false })
  presencas: Array<Presenca>;
}
