import { Prop, Schema } from "@nestjs/mongoose";
import { Disciplina } from "src/disciplinas/entities/disciplina.entity";

@Schema()
export class Atividade {

    @Prop()
    nome: string;

    @Prop()
    descricao: string;

    @Prop()
    nota: number;

    @Prop()
    data_entrega: Date;

    @Prop()
    disciplina: Disciplina;

    constructor(init: Partial<Atividade>) {
        Object.assign(this, init);
    }
}
