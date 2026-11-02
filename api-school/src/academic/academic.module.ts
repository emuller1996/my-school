import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module.js';
import { ParentsModule } from './parents/parents.module.js';
import { ClassGroupModule } from './class-group/class-group.module.js';

@Module({
  imports: [StudentsModule, ParentsModule, ClassGroupModule]
})
export class AcademicModule {}
