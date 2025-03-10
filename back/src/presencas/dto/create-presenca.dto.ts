import { ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongoose";

export class CreatePresencaDto {
  _id: ObjectId;

  @ApiProperty()
  data: Date;

  @ApiProperty()
  presenca: boolean;
  
  @ApiProperty()
  codigo_disciplina: string;

  @ApiProperty()
  id_aluno: string;
}
