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
import { PresencasService } from './presencas.service';
import { CreatePresencaDto } from './dto/create-presenca.dto';
import { UpdatePresencaDto } from './dto/update-presenca.dto';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('presencas')
export class PresencasController {
  constructor(private readonly presencasService: PresencasService) {}

  @Post()
  create(@Body() createPresencaDto: CreatePresencaDto) {
    return this.presencasService.create(createPresencaDto);
  }

  @Get()
  findAll() {
    return this.presencasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.presencasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePresencaDto: UpdatePresencaDto,
  ) {
    return this.presencasService.update(id, updatePresencaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.presencasService.remove(id);
  }

  @Get('lista-presenca-aluno/:codigo_disciplina/:id_aluno')
  findPresencaAluno(
    @Param('id_aluno') id_aluno: string,
    @Param('codigo_disciplina') codigo_disciplina: string,
  ) {
    return this.presencasService.encontraListaPresencaAluno(
      id_aluno,
      codigo_disciplina,
    );
  }

  @Get('lista-presenca-disciplina/:codigo_disciplina')
  findPresencaDisciplina(
    @Param('codigo_disciplina') codigo_disciplina: string,
  ) {
    return this.presencasService.encontraListaPresencaDisciplina(
      codigo_disciplina,
    );
  }
}
