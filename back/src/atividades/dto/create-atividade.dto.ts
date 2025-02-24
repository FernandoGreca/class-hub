import { Disciplina } from "src/disciplinas/entities/disciplina.entity";

export class CreateAtividadeDto {

    nome: string;

    descricao: string;

    nota: number;

    data_entrega: Date;

    disciplina: Disciplina;
}
