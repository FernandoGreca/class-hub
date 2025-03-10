import { ApiProperty } from "@nestjs/swagger";

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
