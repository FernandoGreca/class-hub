import { ApiProperty } from "@nestjs/swagger";
import { ObjectId } from "mongoose";
import { Disciplina } from "src/disciplinas/entities/disciplina.entity";
import { User } from "src/users/entities/user.entity";

export class CreatePresencaDto {
  _id: ObjectId;

  @ApiProperty()
  data: Date;

  @ApiProperty()
  presenca: boolean;
  
  @ApiProperty()
  disciplina: Disciplina;

  @ApiProperty()
  aluno: User;
}
