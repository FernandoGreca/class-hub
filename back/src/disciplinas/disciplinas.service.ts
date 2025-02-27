import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { Disciplina } from './entities/disciplina.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class DisciplinasService {
  constructor(
    @InjectModel(Disciplina.name) private disciplinaModel: Model<Disciplina>,
  ) {}

  create(createDisciplinaDto: CreateDisciplinaDto) {
    const nova_disciplina = new this.disciplinaModel(createDisciplinaDto);
    return nova_disciplina.save();
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
    return await this.disciplinaModel.updateOne(
      { codigo_disciplina },
      updateDisciplinaDto,
    );
  }

  async remove(codigo_disciplina: string) {
    return await this.disciplinaModel.deleteOne({ codigo_disciplina });
  }
}
