import { Prop, Schema } from "@nestjs/mongoose";
import { Disciplina } from "src/disciplinas/entities/disciplina.entity";

@Schema()
export class Presenca {

    @Prop()
    data: Date;

    @Prop()
    presenca: boolean;

    @Prop()
    disciplina: Disciplina;

    constructor(init: Partial<Presenca>) {
        Object.assign(this, init);
    }
}
