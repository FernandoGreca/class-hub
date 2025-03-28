import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

//@ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('encontrar-por-email/:email')
  findByEmail(@Param('email') email: string) {
    return this.usersService.findByEmailFiltrado(email);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Post('adicionar-usuario-disciplina')
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

  @Post('remover-usuario-disciplina')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        id_user: { type: 'string', format: 'ObjectId' },
        codigo_disciplina: { type: 'string' },
      },
      required: ['id_user', 'codigo_disciplina'],
    },
  })
  removerDisciplina(
    @Body() body: { id_user: string; codigo_disciplina: string },
  ) {
    const { id_user, codigo_disciplina } = body;
    return this.usersService.removerDisciplina(id_user, codigo_disciplina);
  }
}
