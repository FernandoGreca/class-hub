import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePresencaDto } from './dto/create-presenca.dto';
import { UpdatePresencaDto } from './dto/update-presenca.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Presenca } from './entities/presenca.entity';
import { Model } from 'mongoose';
import { Disciplina } from 'src/disciplinas/entities/disciplina.entity';
import { User } from 'src/users/entities/user.entity';
import { DisciplinasService } from 'src/disciplinas/disciplinas.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PresencasService {
  constructor(
    @InjectModel(Presenca.name) private presencaModel: Model<Presenca>,
    @Inject(forwardRef(() => DisciplinasService)) private disciplinaService,
    @Inject(forwardRef(() => UsersService)) private userService,
  ) {}

  async create(createPresencaDto: CreatePresencaDto) {
    if (createPresencaDto.data == undefined) {
      createPresencaDto.data = new Date();
    }
  
    const disciplina = await this.disciplinaService.findOne(createPresencaDto.disciplina.codigo_disciplina);
    if (disciplina instanceof NotFoundException || !disciplina) {
      return new NotFoundException('Disciplina não encontrada.');
    }
    const { professores, alunos, atividades, descricao, carga_horaria, ...filtro_disciplina } = disciplina.toJSON();
    createPresencaDto.disciplina = filtro_disciplina;
  
    const aluno = await this.userService.findOne(createPresencaDto.aluno._id);
    if (aluno instanceof NotFoundException || !aluno) {
      return new NotFoundException('Aluno não encontrado.');
    }
    const { disciplinas, e_professor, senha, ...filtro_aluno } = aluno.toJSON();
    createPresencaDto.aluno = filtro_aluno;
  
    const nova_presenca = new this.presencaModel(createPresencaDto);
    const resultado = await nova_presenca.save();
  
    return new Presenca(resultado.toJSON());
  }

  async findAll() {
    return await this.presencaModel.find().exec();
  }

  async findOne(id: string) {
    let procurar_presenca = await this.presencaModel
      .findOne({ _id: id })
      .exec();

    if (!procurar_presenca) {
      return new NotFoundException('Presença não encontrada.');
    }

    return procurar_presenca;
  }

  async update(id: string, updatePresencaDto: UpdatePresencaDto) {
    return await this.presencaModel
      .updateOne({ _id: id }, updatePresencaDto)
      .exec();
  }

  async remove(id: string) {
    return await this.presencaModel.deleteOne({ _id: id }).exec();
  }

  async encontraListaPresenca(id_aluno: string) {
    const presencas = await this.presencaModel
      .find({
        'aluno._id': id_aluno,
      })
      .exec();

    if (!presencas || presencas.length === 0) {
      throw new NotFoundException(
        'Nenhuma presença encontrada para este aluno.',
      );
    }

    return presencas;
  }
}
