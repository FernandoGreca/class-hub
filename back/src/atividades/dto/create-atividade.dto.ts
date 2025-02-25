import { ApiProperty } from "@nestjs/swagger";
import { Disciplina } from "src/disciplinas/entities/disciplina.entity";

export class CreateAtividadeDto {
  @ApiProperty()
  nome: string;

  @ApiProperty()
  descricao: string;

  @ApiProperty()
  nota: number;

  @ApiProperty()
  data_entrega: Date;

  @ApiProperty()
  disciplina: Disciplina;
}
