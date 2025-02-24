import { Injectable } from '@nestjs/common';
import { CreateAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';

@Injectable()
export class AtividadesService {
  create(createAtividadeDto: CreateAtividadeDto) {
    return 'This action adds a new atividade';
  }

  findAll() {
    return `This action returns all atividades`;
  }

  findOne(id: number) {
    return `This action returns a #${id} atividade`;
  }

  update(id: number, updateAtividadeDto: UpdateAtividadeDto) {
    return `This action updates a #${id} atividade`;
  }

  remove(id: number) {
    return `This action removes a #${id} atividade`;
  }
}
