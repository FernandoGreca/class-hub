import { Disciplina } from "src/disciplinas/entities/disciplina.entity";
import { Presenca } from "src/presencas/entities/presenca.entity";

export class CreateUserDto {
    
    nome: string;
    
    email: string;
    
    senha: string;
    
    matricula: string;
    
    ano: number;
    
    e_professor: boolean;
    
    disciplinas: Array<Disciplina>;

    presencas: Array<Presenca>;
}
