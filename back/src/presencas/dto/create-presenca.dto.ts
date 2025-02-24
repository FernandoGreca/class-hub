import { Disciplina } from "src/disciplinas/entities/disciplina.entity";

export class CreatePresencaDto {
    
    data: Date;
    
    presenca: boolean;
    
    disciplina: Disciplina;
}
