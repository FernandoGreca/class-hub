import { ApiProperty } from "@nestjs/swagger";
import { Disciplina } from "src/disciplinas/entities/disciplina.entity";

export class CreatePresencaDto {
  @ApiProperty()
  data: Date;
  @ApiProperty()
  presenca: boolean;
  @ApiProperty()
  disciplina: Disciplina;
}
