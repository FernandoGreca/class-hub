import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // http://localhost:3000/users/criar-usuario
  @Post('criar-usuario')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // http://localhost:3000/users
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('adicionar-disciplina')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        _id_user: { type: 'string', format: 'ObjectId' },
        codigo_disciplina: { type: 'string' },
      },
      required: ['id', 'codigo_disciplina'],
    },
  })
  adicionarDisciplina(
    @Body() body: { _id_user: string; codigo_disciplina: string },
  ) {
    const { _id_user, codigo_disciplina } = body;
    return this.usersService.adicionarDisciplina(_id_user, codigo_disciplina);
  }
}

// POST - criação
// PUT - edição ou criação
// PATCH - edição
// GET - pegar
// DELETE - apaga
