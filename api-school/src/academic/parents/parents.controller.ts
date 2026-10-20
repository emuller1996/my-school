import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParentsService } from './parents.service.js';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';

@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @Post()
  create(@Body() createParentDto: CreateParentDto) {
    return this.parentsService.create(createParentDto);
  }

  @Get()
  findAll() {
    return this.parentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parentsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParentDto: UpdateParentDto) {
    return this.parentsService.update(+id, updateParentDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parentsService.remove(+id);
  }
}
