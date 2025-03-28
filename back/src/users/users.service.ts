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

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(Disciplina.name) private disciplinaModel: Model<Disciplina>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    createUserDto.matricula = this.criarMatricula();
    createUserDto.senha = await this.hashSenha(createUserDto.senha);

    const novoUsuario = new this.userModel(createUserDto);
    const resultado = await novoUsuario.save();

    return new User(resultado.toJSON());
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findByEmail(email: string) {
    let procurar_usuario = await this.userModel.findOne({ email }).exec();

    if (!procurar_usuario) {
      return new NotFoundException('Usuário não encontrado.');
    }

    return procurar_usuario;
  }

  async findByEmailFiltrado(email: string) {
    let procurar_usuario = await this.userModel.findOne({ email }).exec();

    if (!procurar_usuario) {
      return new NotFoundException('Usuário não encontrado.');
    }

    const { senha, ...usuarioFiltrado } = procurar_usuario.toJSON();

    return usuarioFiltrado;
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

  async remove(id: string) {
    let usuario = await this.findOne(id);
    if (usuario instanceof NotFoundException || usuario == null) return usuario;
    if (usuario.disciplinas.length > 0) {
      usuario.disciplinas.forEach(async (disciplina) => {
        await this.removerDisciplina(id, disciplina.codigo_disciplina);
      });
    }

    await this.userModel.deleteOne({ _id: id }).exec();

    return { message: 'Usuário removido com sucesso!' };
  }

  async adicionarDisciplina(id_user: string, codigo_disciplina: string) {
    let usuario = await this.findOne(id_user);

    if (usuario instanceof NotFoundException || usuario == null) return usuario;

    let disciplina = await this.disciplinaModel.findOne({
      codigo_disciplina: codigo_disciplina,
    });

    if (disciplina instanceof NotFoundException || disciplina == null)
      return disciplina;

    const { professores, alunos, atividades, ...filtro_disciplina } =
      disciplina.toJSON();

    if (usuario.e_professor == true) {
      const { disciplinas, senha, matricula, ano, ...filtro_professor } =
        usuario.toJSON();

      for (const professor of disciplina.alunos) {
        if (professor._id.match(id_user)) {
          throw new ConflictException('Professor já leciona essa disciplina.');
        }
      }

      usuario.disciplinas.push(filtro_disciplina as any);
      disciplina.professores.push(filtro_professor as any);
    } else {
      const { disciplinas, e_professor, senha, ...filtro_aluno } =
        usuario.toJSON();

      for (const aluno of disciplina.alunos) {
        if (aluno._id.match(id_user)) {
          throw new ConflictException('Aluno já cursa essa disciplina.');
        }
      }

      usuario.disciplinas.push(filtro_disciplina as any);
      disciplina.alunos.push(filtro_aluno as any);
    }

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

    const { professores, alunos, atividades, ...filtro_disciplina } =
      disciplina.toJSON();
    const { disciplinas, e_professor, senha, ...filtro_aluno } =
      usuario.toJSON();

    if (usuario.e_professor == true) {
      const professor = disciplina.alunos.findIndex((aluno) =>
        aluno._id.match(id_user),
      );

      if (professor === -1) {
        throw new ConflictException('Professor não leciona esta disciplina.');
      }

      disciplina.professores.splice(professor, 1);

      const disciplinaIndex = usuario.disciplinas.findIndex(
        (disc) => disc.codigo_disciplina === codigo_disciplina,
      );

      if (disciplinaIndex === -1) {
        throw new ConflictException(
          'Disciplina não está associada ao professor.',
        );
      }

      usuario.disciplinas.splice(disciplinaIndex, 1);
    } else {
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
    }

    await Promise.all([disciplina.save(), usuario.save()]);

    return {
      message: 'Usuário removido da disciplina com sucesso!',
    };
  }

  async alterarSenha(email: string, senha_nova: string) {
    let usuario_alterar = await this.findByEmail(email);

    if (!usuario_alterar || usuario_alterar instanceof NotFoundException)
      throw new NotFoundException();

    usuario_alterar.senha = await this.hashSenha(senha_nova);

    if (usuario_alterar?._id) {
      await this.userModel
        .updateOne(
          { _id: usuario_alterar?._id },
          { senha: usuario_alterar.senha },
        )
        .exec();
      return { message: 'Senha alterada com sucesso!' };
    } else {
      return { message: 'Erro ao alterar senha!' };
    }
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
