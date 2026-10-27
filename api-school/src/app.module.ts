import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AcademicModule } from './academic/academic.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './academic/students/entities/student.entity.js';
import { Parent } from './academic/parents/entities/parent.entity.js';
import { Teacher } from './academic/teachers/entities/teacher.entity.js';
import { TeachersModule } from './academic/teachers/teachers.module.js';
import { Classroom } from './academic/classrooms/entities/classroom.entity.js';
import { ClassroomsModule } from './academic/classrooms/classrooms.module.js';

@Module({
  imports: [AcademicModule,
    TeachersModule,
    ClassroomsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'nestuser',
      password: 'nestpassword',
      database: 'nestdb',
      entities: [Student, Parent, Teacher, Classroom],
      // Registra también las entidades declaradas con TypeOrmModule.forFeature()
      autoLoadEntities: true,
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
