import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { Disciplina } from './entities/disciplina.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { exit } from 'process';

@Injectable()
export class DisciplinasService {
  constructor(
    @InjectModel(Disciplina.name) private disciplinaModel: Model<Disciplina>,
  ) {}

  async create(createDisciplinaDto: CreateDisciplinaDto) {
    if (
      !createDisciplinaDto.codigo_disciplina ||
      createDisciplinaDto.codigo_disciplina.length === 0
    ) {
      createDisciplinaDto.codigo_disciplina = this.gerarCodigoDisciplina();
    } else if (createDisciplinaDto.codigo_disciplina.length < 6) {
      throw new Error(
        'Código de disciplina inválido. Deve no mínimo 6 caracteres.',
      );
    }

    const nova_disciplina = new this.disciplinaModel(createDisciplinaDto);
    const resultado = await nova_disciplina.save();

    return new Disciplina(resultado.toJSON());
  }

  findAll() {
    return this.disciplinaModel.find().exec();
  }

  async findOne(codigo_disciplina: string) {
    let procurar_disciplina = await this.disciplinaModel
      .findOne({ codigo_disciplina: codigo_disciplina })
      .exec();

    if (!procurar_disciplina) {
      return new NotFoundException('Disciplina não encontrada.');
    }

    return procurar_disciplina;
  }

  async update(
    codigo_disciplina: string,
    updateDisciplinaDto: UpdateDisciplinaDto,
  ) {
    return await this.disciplinaModel
      .updateOne({ codigo_disciplina }, updateDisciplinaDto)
      .exec();
  }

  async remove(codigo_disciplina: string) {
    return await this.disciplinaModel.deleteOne({ codigo_disciplina }).exec();
  }

  async mediaAluno(id_aluno: string, codigo_disciplina: string) {
    const result = await this.findOne(codigo_disciplina);

    // Verifica se o resultado é uma exceção
    if (result instanceof NotFoundException) {
      return { mensagem: 'Disciplina não encontrada' };
    }

    // Agora, TypeScript sabe que `result` é do tipo `Disciplina`
    const disciplina: Disciplina = result;

    // Verifica se o aluno está matriculado na disciplina
    const estaMatriculado = disciplina.alunos.some(
      (aluno) => aluno._id === id_aluno,
    );
    const aluno = disciplina.alunos.find((aluno) => aluno._id === id_aluno);
    if (!estaMatriculado || !aluno) {
      return { mensagem: 'Aluno não matriculado na disciplina' };
    }

    // Calcula a média do aluno na disciplina
    let nota_soma = 0;
    let atividade_qtd = disciplina.atividades.length;

    disciplina.atividades.forEach((atividade) => {
      atividade.nota_alunos.forEach((nota_aluno) => {
        if (nota_aluno.id_aluno === id_aluno) {
          nota_soma += nota_aluno.nota;
        }
      });
    });

    // Evita divisão por zero
    if (atividade_qtd === 0) {
      return { mensagem: 'Nenhuma atividade encontrada para o aluno' };
    }

    const media = nota_soma / atividade_qtd;
    return {
      id_aluno: id_aluno,
      nome_aluno: aluno.nome,
      media: media.toFixed(2), 
      quantidade_atividades: atividade_qtd,
      codigo_disciplina: codigo_disciplina,
      nome_disciplina: disciplina.nome,
    };
  }

  // Métodos
  gerarCodigoDisciplina() {
    const caracteres =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 6; i++) {
      const indice = Math.floor(Math.random() * caracteres.length);
      codigo += caracteres.charAt(indice);
    }
    return codigo;
  }
}
