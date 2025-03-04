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

  @Post('login')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        senha: { type: 'string' },
      },
      required: ['email', 'senha'],
    },
  })
  login (@Body() body: { email: string; senha: string }) {
    return this.usersService.login(body.email, body.senha);
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
        id_user: { type: 'string', format: 'ObjectId' },
        codigo_disciplina: { type: 'string' },
      },
      required: ['id', 'codigo_disciplina'],
    },
  })
  adicionarDisciplina(
    @Body() body: { id_user: string; codigo_disciplina: string },
  ) {
    const { id_user, codigo_disciplina } = body;
    return this.usersService.adicionarDisciplina(id_user, codigo_disciplina);
  }
}

// POST - criação
// PUT - edição ou criação
// PATCH - edição
// GET - pegar
// DELETE - apaga
