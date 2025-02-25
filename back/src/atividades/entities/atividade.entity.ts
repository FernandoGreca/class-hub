import { Prop, Schema } from "@nestjs/mongoose";
import { Disciplina } from "src/disciplinas/entities/disciplina.entity";

@Schema()
export class Atividade {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  descricao: string;

  @Prop({ required: true })
  nota: number;

  @Prop()
  data_entrega: Date;

  @Prop({ required: true })
  disciplina: Disciplina;

  constructor(init: Partial<Atividade>) {
    Object.assign(this, init);
  }
}
