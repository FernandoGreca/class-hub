import { PartialType } from '@nestjs/mapped-types';
import { CreatePresencaDto } from './create-presenca.dto';

export class UpdatePresencaDto extends PartialType(CreatePresencaDto) {}
