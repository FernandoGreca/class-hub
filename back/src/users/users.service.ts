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
    const novoUsuario = new this.userModel(createUserDto);
    
    return novoUsuario.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  findOne(email: string) {
    return `This action returns a #${email} user`;
  }

  update(email: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${email} user`;
  }

  remove(email: string) {
    return `This action removes a #${email} user`;
  }
}
