import { Module } from '@nestjs/common';
import { StudentsService } from './students.service.js';
import { StudentsController } from './students.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './entities/student.entity.js';
import { Parent } from '../parents/entities/parent.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Student,Parent])],
  controllers: [StudentsController],
  providers: [StudentsService],
})
export class StudentsModule {}
