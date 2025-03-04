import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.entity';
import { DisciplinasModule } from 'src/disciplinas/disciplinas.module';
import { PresencasModule } from 'src/presencas/presencas.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SEGREDO || 'projeto-faculdade-classroom', 
      signOptions: { expiresIn: '1h' },
    }),
    DisciplinasModule,
    PresencasModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
