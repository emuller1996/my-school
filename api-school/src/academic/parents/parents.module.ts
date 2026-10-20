import { Module } from '@nestjs/common';
import { ParentsService } from './parents.service.js';
import { ParentsController } from './parents.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../students/entities/student.entity.js';
import { Parent } from './entities/parent.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Student,Parent])],
  controllers: [ParentsController],
  providers: [ParentsService],
})
export class ParentsModule { }
