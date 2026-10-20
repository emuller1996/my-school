import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AcademicModule } from './academic/academic.module.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from './academic/students/entities/student.entity.js';
import { Parent } from './academic/parents/entities/parent.entity.js';

@Module({
  imports: [AcademicModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'nestuser',
      password: 'nestpassword',
      database: 'nestdb',
      entities: [Student,Parent],
      synchronize: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
