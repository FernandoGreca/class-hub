import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Model } from 'mongoose';
import { User } from './entities/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  create(createUserDto: CreateUserDto) {
    createUserDto.matricula = this.criarMatricula();

    const novoUsuario = new this.userModel(createUserDto);

    return novoUsuario.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findOne(email: string) {
    try {
      let procurar_usuario = await this.userModel
        .findOne({ email: email })
        .exec();

      if (!procurar_usuario) {
        return 'Usuário não encontrado.';
      }

      return procurar_usuario;
    } catch (error) {
      console.error('Erro ao buscar usuário:', error);
      return 'Erro ao buscar usuário.';
    }
  }

  update(email: string, updateUserDto: UpdateUserDto) {
    return this.userModel.updateOne({ email: email }, updateUserDto);
  }

  remove(email: string) {
    return this.userModel.deleteOne({ email: email });
  }

  // Métodos
  criarMatricula(): string {
    let matricula = 'UNIFIL-';

    const segundo = new Date().getSeconds().toString();
    const numero_aleatorio = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    matricula += `${segundo}${numero_aleatorio}`;

    return matricula;
  }
}
