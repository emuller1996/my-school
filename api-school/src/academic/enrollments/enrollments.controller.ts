import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe, ParseIntPipe } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service.js';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto.js';

@Controller('enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post()
  create(@Body() createEnrollmentDto: CreateEnrollmentDto) {
    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  findAll(
    @Query('academicYear', new ParseIntPipe({ optional: true })) academicYear?: number,
    @Query('grade') grade?: string,
    @Query('status') status?: string,
    @Query('student_id', new ParseUUIDPipe({ optional: true })) studentId?: string,
  ) {
    return this.enrollmentsService.findAll(academicYear, grade, status, studentId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEnrollmentDto: UpdateEnrollmentDto) {
    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.enrollmentsService.remove(id);
  }
}
