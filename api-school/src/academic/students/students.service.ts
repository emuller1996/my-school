import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto.js';
import { UpdateStudentDto } from './dto/update-student.dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity.js';
import { ILike, Like, Repository } from 'typeorm';
import { log } from 'console';

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
    const whereCondition =
      name && name.trim() !== ''
        ? { name: Like(`%${name.trim()}%`) }
        : {};

    const students = await this.studentRepository.find({
      where: whereCondition,
    });

    return students;
  }

  async findOne(id: string) {
    const student = await this.studentRepository.findOne({ where: { id } });

    if (!student) {
      throw new NotFoundException(`Estudiante con id ${id} no encontrado`);
    }

    return student;
  }

  async update(id: string, updateStudentDto: UpdateStudentDto) {
    // Busca el estudiante (lanza 404 si no existe)
    const student = await this.findOne(id);

    // Mezcla los cambios del DTO con la entidad existente
    const updated = this.studentRepository.merge(student, updateStudentDto);

    const result = await this.studentRepository.save(updated);

    return { message: 'Estudiante actualizado con éxito.', data: result };
  }

  remove(id: number) {
    return `This action removes a #${id} student`;
  }
}
