import { Module } from '@nestjs/common';
import { ClassGroupService } from './class-group.service.js';
import { ClassGroupController } from './class-group.controller.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassGroup } from './entities/class-group.entity.js';
import { Student } from '../students/entities/student.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([ClassGroup,Student])],
  controllers: [ClassGroupController],
  providers: [ClassGroupService],
})
export class ClassGroupModule {}
