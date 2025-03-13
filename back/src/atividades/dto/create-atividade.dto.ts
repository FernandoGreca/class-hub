import { ApiProperty } from "@nestjs/swagger";

export class CreateNotaAlunoAtividadeDto {
  @ApiProperty()
  id_atividade: string;
  @ApiProperty()
  id_aluno: string;
  @ApiProperty()
  nome_aluno: string;
  @ApiProperty()
  nota: number;
}

export class CreateAtividadeDto {

  _id: string;

  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  nota: number;

  @ApiProperty()
  data_entrega: Date;

  @ApiProperty()
  disciplina: string;


}
