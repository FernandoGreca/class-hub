import { Prop, Schema } from "@nestjs/mongoose";
import { Atividade } from "src/atividades/entities/atividade.entity";
import { User } from "src/users/entities/user.entity";

@Schema()
export class Disciplina {

    @Prop()
    nome: string;

    @Prop()
    descricao: string;

    @Prop()
    carga_horaria: number;

    @Prop()
    professores: Array<User>;

    @Prop()
    alunos: Array<User>;

    @Prop()
    atividades: Array<Atividade>;

    constructor(init: Partial<Disciplina>) {
        Object.assign(this, init);
    }
}
