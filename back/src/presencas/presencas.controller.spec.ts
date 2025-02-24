import { Test, TestingModule } from '@nestjs/testing';
import { PresencasController } from './presencas.controller';
import { PresencasService } from './presencas.service';

describe('PresencasController', () => {
  let controller: PresencasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PresencasController],
      providers: [PresencasService],
    }).compile();

    controller = module.get<PresencasController>(PresencasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
