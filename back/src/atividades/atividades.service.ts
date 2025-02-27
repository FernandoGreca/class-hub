import { Injectable } from '@nestjs/common';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { Atividade } from './entities/atividade.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AtividadesService {

  constructor(
      @InjectModel(Atividade.name) private atividadeModel: Model<Atividade>,
    ) {}

  create(createAtividadeDto: CreateAtividadeDto) {
    const nova_atividade = new this.atividadeModel(createAtividadeDto);

    return nova_atividade.save();
  }

  async findAll() {
    return await this.atividadeModel.find().exec();
  }

  async findOne(id: number) {
    return await this.atividadeModel.findOne({ _id: id}).exec();
  }

  async update(id: number, updateAtividadeDto: UpdateAtividadeDto) {
    return await this.atividadeModel.updateOne({ _id: id}, updateAtividadeDto);
  }

  async remove(id: number) {
    return await this.atividadeModel.deleteOne({ _id: id});
  }
}
