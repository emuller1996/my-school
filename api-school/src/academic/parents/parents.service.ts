import { Injectable } from '@nestjs/common';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';

@Injectable()
export class ParentsService {
  create(createParentDto: CreateParentDto) {
    return 'This action adds a new parent';
  }

  findAll() {
    return `This action returns all parents`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parent`;
  }

  update(id: number, updateParentDto: UpdateParentDto) {
    return `This action updates a #${id} parent`;
  }

  remove(id: number) {
    return `This action removes a #${id} parent`;
  }
}
