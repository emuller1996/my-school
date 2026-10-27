import { Test, TestingModule } from '@nestjs/testing';
import { ParentsController } from './parents.controller.js';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ParentsService } from './parents.service.js';
import { Parent } from './entities/parent.entity.js';
import { Student } from '../students/entities/student.entity.js';

describe('ParentsController', () => {
  let controller: ParentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParentsController],
      providers: [
        ParentsService,
        { provide: getRepositoryToken(Parent), useValue: {} },
        { provide: getRepositoryToken(Student), useValue: {} },
      ],
    }).compile();

    controller = module.get<ParentsController>(ParentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
