import { Module } from '@nestjs/common';
import { StudentsModule } from './students/students.module.js';
import { ParentsModule } from './parents/parents.module.js';

@Module({
  imports: [StudentsModule, ParentsModule]
})
export class AcademicModule {}
