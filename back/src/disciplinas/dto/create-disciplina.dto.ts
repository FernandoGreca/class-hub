import { Atividade } from "src/atividades/entities/atividade.entity";
import { User } from "src/users/entities/user.entity";

export class CreateDisciplinaDto {
    
    nome: string;
        
    descricao: string;
        
    carga_horaria: number;
        
    professores: Array<User>;
        
    alunos: Array<User>;
        
    atividades: Array<Atividade>;
}
