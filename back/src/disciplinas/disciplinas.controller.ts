import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { DisciplinasService } from './disciplinas.service';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('disciplinas')
export class DisciplinasController {
  constructor(private readonly disciplinasService: DisciplinasService) {}

  @Post()
  create(@Body() createDisciplinaDto: CreateDisciplinaDto) {
    return this.disciplinasService.create(createDisciplinaDto);
  }

  @Get()
  findAll() {
    return this.disciplinasService.findAll();
  }

  @Get(':codigo_disciplina')
  findOne(@Param('codigo_disciplina') codigo_disciplina: string) {
    return this.disciplinasService.findOne(codigo_disciplina);
  }

  @Patch(':codigo_disciplina')
  update(@Param('codigo_disciplina') codigo_disciplina: string, @Body() updateDisciplinaDto: UpdateDisciplinaDto) {
    return this.disciplinasService.update(codigo_disciplina, updateDisciplinaDto);
  }

  @Delete(':codigo_disciplina')
  remove(@Param('codigo_disciplina') codigo_disciplina: string) {
    return this.disciplinasService.remove(codigo_disciplina);
  }
}
