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

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.usersService.findOne(email);
  }

  @Patch(':email')
  update(@Param('email') email: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(email, updateUserDto);
  }

  @Delete(':email')
  remove(@Param('email') email: string) {
    return this.usersService.remove(email);
  }

  @Post('adicionar-disciplina')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        codigo_disciplina: { type: 'string' },
      },
      required: ['email', 'codigo_disciplina'],
    },
  })
  adicionarDisciplina(
    @Body() body: { email: string; codigo_disciplina: string },
  ) {
    const { email, codigo_disciplina } = body;
    return this.usersService.adicionarDisciplina(email, codigo_disciplina);
  }
}

// POST - criação
// PUT - edição ou criação
// PATCH - edição
// GET - pegar
// DELETE - apaga
