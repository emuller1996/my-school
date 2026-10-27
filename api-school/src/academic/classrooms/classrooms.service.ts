import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { CreateClassroomDto } from './dto/create-classroom.dto.js';
import { UpdateClassroomDto } from './dto/update-classroom.dto.js';
import { Classroom } from './entities/classroom.entity.js';

@Injectable()
export class ClassroomsService {
  constructor(
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
  ) { }

  async create(createClassroomDto: CreateClassroomDto) {
    await this.ensureUnique(createClassroomDto.name, createClassroomDto.academicYear);

    const classroom = this.classroomRepository.create(createClassroomDto);
    const result = await this.classroomRepository.save(classroom);

    return { message: 'Se creo el salón con exito.', data: result };
  }

  async findAll(name?: string) {
    const whereCondition =
      name && name.trim() !== ''
        ? { name: Like(`%${name.trim()}%`) }
        : {};

    return this.classroomRepository.find({
      where: whereCondition,
      order: { academicYear: 'DESC', name: 'ASC' },
    });
  }

  async findOne(id: string) {
    const classroom = await this.classroomRepository.findOne({ where: { id } });

    if (!classroom) {
      throw new NotFoundException(`Salón con id ${id} no encontrado`);
    }

    return classroom;
  }

  async update(id: string, updateClassroomDto: UpdateClassroomDto) {
    const classroom = await this.findOne(id);

    // Valida la combinación resultante (el cambio puede venir solo en name o solo en academicYear)
    if (updateClassroomDto.name !== undefined || updateClassroomDto.academicYear !== undefined) {
      await this.ensureUnique(
        updateClassroomDto.name ?? classroom.name,
        updateClassroomDto.academicYear ?? classroom.academicYear,
        id,
      );
    }

    const updated = this.classroomRepository.merge(classroom, updateClassroomDto);
    const result = await this.classroomRepository.save(updated);

    return { message: 'Salón actualizado con éxito.', data: result };
  }

  async remove(id: string) {
    const classroom = await this.findOne(id);

    await this.classroomRepository.remove(classroom);

    return { message: 'Salón eliminado con éxito.', data: Object.assign(classroom, { id }) };
  }

  // Lanza 409 si ya existe otro salón con el mismo nombre en el mismo año académico
  private async ensureUnique(name: string, academicYear: number, excludeId?: string) {
    const exists = await this.classroomRepository.exists({
      where: { name, academicYear, ...(excludeId ? { id: Not(excludeId) } : {}) },
    });

    if (exists) {
      throw new ConflictException(`Ya existe un salón ${name} para el año académico ${academicYear}`);
    }
  }
}
