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

    if (!(await this.existeDisciplina(createAtividadeDto.disciplina))) {
      return {
        mensagem: 'Disciplina não encontrada',
      };
    }

    if (dataEntrega.getDay() < new Date().getDay()) {
      return {
        mensagem: 'Data de entrega não pode ser menor que a data atual',
      };
    }

    if (createAtividadeDto.nota != 100) {
      return {
        mensagem: 'Nota da atividade deve ser igual a 100',
        explicacao:
          'É essencial que a nota da atividade seja 100, pois o cálculo da média considera a soma de todas as notas do aluno em uma atividade, dividida pela quantidade total de atividades da disciplina.',
      };
    }

    const nova_atividade = new this.atividadeModel(createAtividadeDto);

    await nova_atividade.save();

    const disciplina = await this.disciplinaService.findOne(
      createAtividadeDto.disciplina,
    );

    disciplina.atividades.push(nova_atividade);

    await this.disciplinaService.update(
      disciplina.codigo_disciplina,
      disciplina,
    );

    return {
      mensagem: 'Atividade criada com sucesso!',
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
    const atividade = (await this.findOne(id)) as Atividade;

    if (!atividade) {
      return {
        message: 'Atividade não encontrada',
      };
    }

    const disciplina = await this.disciplinaService.findOne(
      atividade.disciplina,
    );

    if (!disciplina) {
      return {
        message: 'Disciplina não encontrada',
      };
    }

    // Remove o ID da atividade do array de atividades da disciplina
    disciplina.atividades = disciplina.atividades.filter(
      (atividadeId) => atividadeId.toString() !== id,
    );

    // Atualiza a disciplina no banco
    await this.disciplinaService.update(
      disciplina.codigo_disciplina,
      disciplina,
    );

    // Agora remove a atividade do banco
    await this.atividadeModel.deleteOne({ _id: id }).exec();

    return {
      message: 'Atividade removida com sucesso',
    };
  }

  async notaAlunoAtividade(notaAlunoAtividade: CreateNotaAlunoAtividadeDto) {
    let atividade = await this.findOne(notaAlunoAtividade.id_atividade);

    if (!atividade) {
      return {
        mensagem: 'Atividade não encontrada',
      };
    }

    if (notaAlunoAtividade.nota > atividade.nota) {
      return {
        mensagem: 'Nota não pode ser maior que a nota da atividade',
      };
    }

    let alunoJaTemNota = false;

    atividade.nota_alunos.forEach((nota) => {
      if (nota.id_aluno == notaAlunoAtividade.id_aluno) {
        nota.nota = notaAlunoAtividade.nota;
        alunoJaTemNota = true;
      }
    });

    const cod_disciplina = atividade.disciplina;

    const disciplina: Disciplina =
      await this.disciplinaService.findOne(cod_disciplina);

    if (!alunoJaTemNota) {
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

    // Atualiza a atividade no banco
    await this.atividadeModel.updateOne(
      { _id: notaAlunoAtividade.id_atividade },
      { $set: { nota_alunos: atividade.nota_alunos } },
    );

    // Atualiza a atividade existente na lista da disciplina, sem duplicar
    const indexAtividade = disciplina.atividades.findIndex(
      (a) => a._id.toString() === atividade._id.toString(),
    );

    if (indexAtividade !== -1) {
      disciplina.atividades[indexAtividade] = atividade;
      await this.disciplinaService.update(
        disciplina.codigo_disciplina,
        disciplina,
      );
    }

    return {
      mensagem: alunoJaTemNota
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
