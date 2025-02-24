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

  findOne(email: string) {
    return this.userModel.findOne({ email: email });
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

    const data = new Date().toISOString().replace(/[-:.]/g, '').slice(16, 18);
    const numeroAleatorio = Math.floor(Math.random() * 10000);

    matricula += `${data}${numeroAleatorio.toString().padStart(4, '0')}`;

    return matricula;
  }
}
