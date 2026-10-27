import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ParentsService } from './parents.service.js';
import { Parent } from './entities/parent.entity.js';
import { Student } from '../students/entities/student.entity.js';

describe('ParentsService', () => {
  let service: ParentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParentsService,
        { provide: getRepositoryToken(Parent), useValue: {} },
        { provide: getRepositoryToken(Student), useValue: {} },
      ],
    }).compile();

    service = module.get<ParentsService>(ParentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
