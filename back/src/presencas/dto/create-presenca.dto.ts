import { ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongoose";
import { Disciplina } from "src/disciplinas/entities/disciplina.entity";

export class CreatePresencaDto {
  @ApiProperty()
  _id: ObjectId;

  @ApiProperty()
  data: Date;

  @ApiProperty()
  presenca: boolean;
  
  @ApiProperty()
  disciplina: Disciplina;
}
