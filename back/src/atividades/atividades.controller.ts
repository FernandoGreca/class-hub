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
import { AtividadesService } from './atividades.service';
import { CreateAtividadeDto, CreateNotaAlunoAtividadeDto } from './dto/create-atividade.dto';
import { UpdateAtividadeDto } from './dto/update-atividade.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('atividades')
export class AtividadesController {
  constructor(private readonly atividadesService: AtividadesService) {}

  @Post()
  create(@Body() createAtividadeDto: CreateAtividadeDto) {
    return this.atividadesService.create(createAtividadeDto);
  }

  @Get()
  findAll() {
    return this.atividadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.atividadesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAtividadeDto: UpdateAtividadeDto,
  ) {
    return this.atividadesService.update(id, updateAtividadeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.atividadesService.remove(id);
  }

  @Post('inserir-nota-aluno-atividade')
  notaAlunoAtividade(@Body() notaAlunoAtividade: CreateNotaAlunoAtividadeDto) {
    return this.atividadesService.notaAlunoAtividade(notaAlunoAtividade);
  }
}
