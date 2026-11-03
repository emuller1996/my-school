import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
import { ClassGroupService } from './class-group.service.js';
import { CreateClassGroupDto } from './dto/create-class-group.dto.js';
import { UpdateClassGroupDto } from './dto/update-class-group.dto.js';

@Controller('class-group')
export class ClassGroupController {
  constructor(private readonly classGroupService: ClassGroupService) {}

  @Post()
  create(@Body() createClassGroupDto: CreateClassGroupDto) {
    return this.classGroupService.create(createClassGroupDto);
  }

  @Get()
  findAll(
    @Query('search') search?: string,
    @Query('academicYear', new ParseIntPipe({ optional: true })) academicYear?: number,
    @Query('grade') grade?: string,
    @Query('director_id') director_id?: string,
  ) {
    return this.classGroupService.findAll(search, academicYear, grade,director_id);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.classGroupService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateClassGroupDto: UpdateClassGroupDto) {
    return this.classGroupService.update(id, updateClassGroupDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.classGroupService.remove(id);
  }
}
