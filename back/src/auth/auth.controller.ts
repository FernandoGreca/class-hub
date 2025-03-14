import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
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
  signIn(@Body() body: { email: string; senha: string }) {
    return this.authService.signIn(body.email, body.senha);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nome: { type: 'string' },
        email: { type: 'string', format: 'email' },
        senha: { type: 'string' },
        ano: { type: 'number' },
        e_professor: { type: 'boolean' },
      },
      required: ['nome', 'email', 'senha', 'ano', 'e_professor'],
    },
  })
  @Post('cadastro-usuario')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('alterar-senha')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        senha_nova: { type: 'string' },
      },
      required: ['email', 'senha_nova'],
    },
  })
  alterarSenha(@Body() body: { email: string; senha_nova: string }) {
    return this.authService.alterarSenha(body.email, body.senha_nova);
  }
}
