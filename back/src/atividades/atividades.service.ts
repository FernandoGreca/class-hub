import { forwardRef, Inject, Injectable } from '@nestjs/common';
import {
  CreateAtividadeDto,
  CreateNotaAlunoAtividadeDto,
} from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { Atividade } from './entities/atividade.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DisciplinasService } from 'src/disciplinas/disciplinas.service';
import { Disciplina } from 'src/disciplinas/entities/disciplina.entity';

@Injectable()
export class AtividadesService {
  constructor(
    @InjectModel(Atividade.name) private atividadeModel: Model<Atividade>,
    @Inject(forwardRef(() => DisciplinasService)) private disciplinaService,
  ) {}

  async create(createAtividadeDto: CreateAtividadeDto) {
    // Convertendo data_entrega para um objeto Date
    const dataEntrega = new Date(createAtividadeDto.data_entrega);

    if (await !this.existeDisciplina(createAtividadeDto.disciplina)) {
      return {
        message: 'Disciplina não encontrada',
      };
    }

    if (dataEntrega.getDay() < new Date().getDay()) {
      return {
        message: 'Data de entrega não pode ser menor que a data atual',
      };
    }

    const nova_atividade = new this.atividadeModel(createAtividadeDto);

    await nova_atividade.save();

    return {
      message: 'Atividade criada com sucesso!',
    };
  }

  async findAll() {
    return await this.atividadeModel.find().exec();
  }

  async findOne(id: string) {
    return await this.atividadeModel.findOne({ _id: id }).exec();
  }

  async update(id: string, updateAtividadeDto: UpdateAtividadeDto) {
    return await this.atividadeModel
      .updateOne({ _id: id }, updateAtividadeDto)
      .exec();
  }

  async remove(id: string) {
    return await this.atividadeModel.deleteOne({ _id: id }).exec();
  }

  async notaAlunoAtividade(notaAlunoAtividade: CreateNotaAlunoAtividadeDto) {
    let atividade = await this.findOne(notaAlunoAtividade.id_atividade);

    if (!atividade) {
      return {
        message: 'Atividade não encontrada',
      };
    }

    if (notaAlunoAtividade.nota > atividade.nota) {
      return {
        message: 'Nota não pode ser maior que a nota da atividade',
      };
    }

    let alunoJaTemNota = false;

    atividade.nota_alunos.forEach((nota) => {
      if (nota.id_aluno == notaAlunoAtividade.id_aluno) {
        nota.nota = notaAlunoAtividade.nota;
        alunoJaTemNota = true;
      }
    });

    if (!alunoJaTemNota) {
      const cod_disciplina = atividade.disciplina;

      const disciplina: Disciplina =
        await this.disciplinaService.findOne(cod_disciplina);

      disciplina.alunos.forEach((aluno) => {
        if (aluno._id == notaAlunoAtividade.id_aluno) {
          atividade.nota_alunos.push({
            id_aluno: notaAlunoAtividade.id_aluno,
            nome_aluno: aluno.nome,
            nota: notaAlunoAtividade.nota,
          });
        }
      });
    }

    await this.atividadeModel.updateOne(
      { _id: notaAlunoAtividade.id_atividade },
      { $set: { nota_alunos: atividade.nota_alunos } },
    );

    return {
      message: alunoJaTemNota
        ? 'Nota do aluno atualizada com sucesso!'
        : 'Nota do aluno inserida com sucesso!',
    };
  }

  // Métodos
  async existeDisciplina(codigo_disciplina: string): Promise<boolean> {
    const disciplina = await this.disciplinaService.findOne(codigo_disciplina);

    if (disciplina) {
      return true;
    } else {
      return false;
    }
  }
}
