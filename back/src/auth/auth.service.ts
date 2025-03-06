import { forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService)) private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signIn(
    email: string,
    senha: string,
  ): Promise<{ access_token: string }> {
    const usuario = await this.usersService.findByEmail(email);

    if (!usuario || usuario instanceof NotFoundException || !usuario.senha)
      throw new NotFoundException();

    if (!compare(senha, usuario.senha)) {
      throw new UnauthorizedException();
    }
    const payload = { sub: usuario._id, email: usuario.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
// const usuario = await this.userModel.findOne({ email }).exec();

// if (!usuario || !usuario.senha)
//   return { message: 'Usuário não encontrado, tente novamente...' };

// const senha_correta = await compare(senha, usuario.senha);
// if (!senha_correta) return { message: 'Senha incorreta, tente novamente...' };

// const token = await this.authService.signIn(email, senha);

// return token;
