import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async findOne(id: string) {
    let procurar_usuario = await this.userModel.findOne({ _id: id }).exec();

    if (!procurar_usuario) {
      return new NotFoundException('Usuário não encontrado.');
    }

    return procurar_usuario;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ _id: id }, updateUserDto);
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }

  async adicionarDisciplina(id: string, codigo_disciplina: string) {
    let usuario = await this.findOne(id);

    if (usuario instanceof NotFoundException) return usuario;

    let disciplina = await this.disciplinaModel.findOne({
      codigo_disciplina: codigo_disciplina,
    });

    if (disciplina instanceof NotFoundException || disciplina == null)
      return disciplina;
    if (usuario.e_professor == true)
      throw new ConflictException(
        'Um professor não pode cursar uma disciplina.',
      );

    const { professores, alunos, atividades, ...filtro_disciplina } =
      disciplina.toJSON();
    const { disciplinas, presencas, e_professor, senha, ...filtro_aluno } =
      usuario.toJSON();

    for (const aluno of disciplina.alunos) {
      if (aluno._id.match(id)) {
        throw new ConflictException('Aluno já cursa essa disciplina.');
      }
    }

    usuario.disciplinas.push(filtro_disciplina as any);
    disciplina.alunos.push(filtro_aluno as any);

    await Promise.all([disciplina.save(), usuario.save()]);

    const {
      email: retirar_email,
      senha: retirar_senha,
      ano: retirar_ano,
      e_professor: retirar_e_professor,
      presencas: retirar_presencas,
      ...retornar_usuario
    } = usuario.toJSON();

    return retornar_usuario;
  }

  // Métodos
  criarMatricula(): string {
    let matricula = 'UNIFIL-';

    const segundo = new Date().getSeconds().toString();
    const numero_aleatorio = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0');

    matricula += `${segundo}${numero_aleatorio}`;

    return matricula;
  }
}
