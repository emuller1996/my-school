import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateParentDto } from './dto/create-parent.dto.js';
import { UpdateParentDto } from './dto/update-parent.dto.js';
import { Parent } from './entities/parent.entity.js';
import { Student } from '../students/entities/student.entity.js';

@Injectable()
export class ParentsService {
  constructor(
    @InjectRepository(Parent)
    private parentRepository: Repository<Parent>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) { }

  async create(createParentDto: CreateParentDto) {
    const { student_id, ...parentData } = createParentDto;

    const student = await this.studentRepository.findOne({ where: { id: student_id } });
    if (!student) {
      throw new NotFoundException(`Estudiante con id ${student_id} no encontrado`);
    }

    const parent = await this.parentRepository.save(this.parentRepository.create(parentData));

    // Asocia el acudiente al estudiante (la FK parent_id vive en students)
    student.parent_id = parent.id;
    await this.studentRepository.save(student);

    return { message: 'Se creo el acudiente con exito.', data: parent };
  }

  findAll() {
    return this.parentRepository.find();
  }

  async findOne(id: string) {
    const parent = await this.parentRepository.findOne({ where: { id } });

    if (!parent) {
      throw new NotFoundException(`Acudiente con id ${id} no encontrado`);
    }

    return parent;
  }

  async update(id: string, updateParentDto: UpdateParentDto) {
    const parent = await this.findOne(id);

    // student_id no se actualiza por esta vía
    const { student_id, ...changes } = updateParentDto;
    const updated = this.parentRepository.merge(parent, changes);

    const result = await this.parentRepository.save(updated);

    return { message: 'Acudiente actualizado con éxito.', data: result };
  }

  remove(id: number) {
    return `This action removes a #${id} parent`;
  }
}
