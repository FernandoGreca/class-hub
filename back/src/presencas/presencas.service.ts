import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePresencaDto } from './dto/create-presenca.dto';
import { UpdatePresencaDto } from './dto/update-presenca.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Presenca } from './entities/presenca.entity';
import { Model } from 'mongoose';

@Injectable()
export class PresencasService {
  constructor(
    @InjectModel(Presenca.name) private presencaModel: Model<Presenca>,
  ) {}

  async create(createPresencaDto: CreatePresencaDto) {
    const nova_presenca = new this.presencaModel(createPresencaDto);
    const resultado = await nova_presenca.save();

    return new Presenca(resultado.toJSON());
  }

  async findAll() {
    return await this.presencaModel.find().exec();
  }

  async findOne(id: number) {
    let procurar_presenca = await this.presencaModel
      .findOne({ _id: id })
      .exec();

    if (!procurar_presenca) {
      return new NotFoundException('Presença não encontrada.');
    }

    return procurar_presenca;
  }

  async update(id: number, updatePresencaDto: UpdatePresencaDto) {
    return await this.presencaModel.updateOne({ _id: id }, updatePresencaDto).exec();
  }

  async remove(id: number) {
    return await this.presencaModel.deleteOne({ _id: id }).exec();
  }
}
