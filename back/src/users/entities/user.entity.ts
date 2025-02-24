import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Disciplina } from "src/disciplinas/entities/disciplina.entity";
import { Presenca } from "src/presencas/entities/presenca.entity";

@Schema()
export class User {

    @Prop({ required: true })
    nome: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    senha: string;

    @Prop()
    matricula: string;

    @Prop()
    ano: number;

    @Prop()
    e_professor: boolean;

    @Prop()
    disciplinas: Array<Disciplina>;

    @Prop()
    presencas: Array<Presenca>;

    constructor(init: Partial<User>) {
        Object.assign(this, init);
    }
}

export const UserSchema = SchemaFactory.createForClass(User);