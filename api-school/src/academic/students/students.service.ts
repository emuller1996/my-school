import { Injectable } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity.js';
import { ILike, Like, Repository } from 'typeorm';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) { }

  async create(createStudentDto: CreateStudentDto) {
    const student = createStudentDto;
    const studentNew = await this.studentRepository.create(student)
    const studentResult = await this.studentRepository.save(studentNew)
    return { message: "Se creo el estudiante con exito.", data: studentResult };
  }

  async findAll(name?: string) {
    console.log(name);
    
    const students = await this.studentRepository.find({where: { name: Like(`%${name}%`) }})
    console.log(students);
    return students;
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findBy({id:id})
    console.log(student);
    return student;
  }

  update(id: number, updateStudentDto: UpdateStudentDto) {
    return `This action updates a #${id} student`;
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
