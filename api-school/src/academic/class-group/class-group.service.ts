import { Injectable } from '@nestjs/common';
import { CreateClassGroupDto } from './dto/create-class-group.dto.js';
import { UpdateClassGroupDto } from './dto/update-class-group.dto.js';

@Injectable()
export class ClassGroupService {
  create(createClassGroupDto: CreateClassGroupDto) {
    return 'This action adds a new classGroup';
  }

  findAll() {
    return `This action returns all classGroup`;
  }

  findOne(id: number) {
    return `This action returns a #${id} classGroup`;
  }

  update(id: number, updateClassGroupDto: UpdateClassGroupDto) {
    return `This action updates a #${id} classGroup`;
  }

  remove(id: number) {
    return `This action removes a #${id} classGroup`;
  }
}
