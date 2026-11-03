import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassroomsService } from './classrooms.service.js';
import { ClassroomsController } from './classrooms.controller.js';
import { Classroom } from './entities/classroom.entity.js';
import { ClassroomAssignment } from './entities/classroom-assignment.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Classroom, ClassroomAssignment])],
  controllers: [ClassroomsController],
  providers: [ClassroomsService],
  exports: [ClassroomsService],
})
export class ClassroomsModule {}
