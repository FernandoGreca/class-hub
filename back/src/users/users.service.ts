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
import { hash, genSalt, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Disciplina.name) private disciplinaModel: Model<Disciplina>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.matricula = this.criarMatricula();
    createUserDto.senha = await this.hashSenha(createUserDto.senha);

    const novoUsuario = new this.userModel(createUserDto);
    const resultado = await novoUsuario.save();

    return new User(resultado.toJSON());
  }

  async login(email: string, senha: string) {
    const usuario = await this.userModel.findOne({ email }).exec();

    if (!usuario || !usuario.senha)
      return { message: 'Usuário não encontrado, tente novamente...' };

    const senha_correta = await compare(senha, usuario.senha);
    if (!senha_correta)
      return { message: 'Senha incorreta, tente novamente...' };

    const token = this.jwtService.sign({
      id: usuario._id,
      email: usuario.email,
    });

    return token;
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
    return this.userModel.updateOne({ _id: id }, updateUserDto).exec();
  }

  remove(id: string) {
    return this.userModel.deleteOne({ _id: id }).exec();
  }

  async adicionarDisciplina(id_user: string, codigo_disciplina: string) {
    let usuario = await this.findOne(id_user);

    if (usuario instanceof NotFoundException || usuario == null) return usuario;

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
    const { disciplinas, e_professor, senha, ...filtro_aluno } =
      usuario.toJSON();

    for (const aluno of disciplina.alunos) {
      if (aluno._id.match(id_user)) {
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
      ...retornar_usuario
    } = usuario.toJSON();

    return retornar_usuario;
  }

  async removerDisciplina(id_user: string, codigo_disciplina: string) {
    let usuario = await this.findOne(id_user);

    if (usuario instanceof NotFoundException || usuario == null) return usuario;

    let disciplina = await this.disciplinaModel.findOne({
      codigo_disciplina: codigo_disciplina,
    });

    if (disciplina instanceof NotFoundException || disciplina == null)
      return disciplina;
   
    if (usuario.e_professor == true)
      throw new ConflictException('Um professor não pode remover disciplinas.');

    const { professores, alunos, atividades, ...filtro_disciplina } =
      disciplina.toJSON();
    const { disciplinas, e_professor, senha, ...filtro_aluno } =
      usuario.toJSON();

    const alunoIndex = disciplina.alunos.findIndex((aluno) =>
      aluno._id.match(id_user),
    );

    if (alunoIndex === -1) {
      throw new ConflictException(
        'Aluno não está matriculado nessa disciplina.',
      );
    }

    disciplina.alunos.splice(alunoIndex, 1);

    const disciplinaIndex = usuario.disciplinas.findIndex(
      (disc) => disc.codigo_disciplina === codigo_disciplina,
    );

    if (disciplinaIndex === -1) {
      throw new ConflictException('Disciplina não está associada ao aluno.');
    }

    usuario.disciplinas.splice(disciplinaIndex, 1);

    await Promise.all([disciplina.save(), usuario.save()]);

    const {
      email: retirar_email,
      senha: retirar_senha,
      ano: retirar_ano,
      e_professor: retirar_e_professor,
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

  private async hashSenha(password: string) {
    const salt = await genSalt(10);
    return hash(password, salt);
  }
}
