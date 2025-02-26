import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Disciplina } from 'src/disciplinas/entities/disciplina.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Disciplina.name) private disciplinaModel: Model<Disciplina>,
  ) {}

  create(createUserDto: CreateUserDto) {
    createUserDto.matricula = this.criarMatricula();

    const novoUsuario = new this.userModel(createUserDto);

    return novoUsuario.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(email: string) {
    try {
      let procurar_usuario = await this.userModel
        .findOne({ email: email })
        .exec();

      if (!procurar_usuario) {
        return 'Usuário não encontrado.';
      }

      return procurar_usuario;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return 'Erro ao buscar usuário.';
    }
  }

  update(email: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ email: email }, updateUserDto);
  }

  remove(email: string) {
    return this.userModel.deleteOne({ email: email });
  }

  async adicionarDisciplina(email: string, codigo_disciplina: string) {
    let usuario = await this.findOne(email);
    let disciplina = await this.disciplinaModel.findOne({
      codigo_disciplina: codigo_disciplina,
    });

    if (typeof usuario === "string") return usuario;
    if (typeof disciplina === "string" || disciplina === null) return disciplina;

    const { professores, alunos, atividades, ...mostrar_disciplina } =
      disciplina.toJSON();
    const { disciplinas, presencas, e_professor, senha, ...mostrar_aluno } =
      usuario.toJSON();

    usuario.disciplinas.push(mostrar_disciplina as any);
    disciplina.alunos.push(mostrar_aluno as any);

    await disciplina.save();

    return await usuario.save();
  }

  // Métodos
  criarMatricula(): string {
    let matricula = "UNIFIL-";

    const segundo = new Date().getSeconds().toString();
    const numero_aleatorio = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    matricula += `${segundo}${numero_aleatorio}`;

    return matricula;
  }
}
