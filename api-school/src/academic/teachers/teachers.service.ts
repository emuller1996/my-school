import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { CreateTeacherDto } from './dto/create-teacher.dto.js';
import { UpdateTeacherDto } from './dto/update-teacher.dto.js';
import { Teacher } from './entities/teacher.entity.js';

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) { }

  async create(createTeacherDto: CreateTeacherDto) {
    await this.ensureUnique(createTeacherDto.email, createTeacherDto.identityNumber);

    const teacher = this.teacherRepository.create(createTeacherDto);
    const result = await this.teacherRepository.save(teacher);

    return { message: 'Se creo el profesor con exito.', data: result };
  }

  async findAll(name?: string) {
    // Busca coincidencias en nombre o apellido (MySQL ya compara sin distinguir mayúsculas)
    const whereCondition =
      name && name.trim() !== ''
        ? [
          { firstName: Like(`%${name.trim()}%`) },
          { lastName: Like(`%${name.trim()}%`) },
        ]
        : {};

    return this.teacherRepository.find({
      where: whereCondition,
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findOne(id: string) {
    const teacher = await this.teacherRepository.findOne({ where: { id } });

    if (!teacher) {
      throw new NotFoundException(`Profesor con id ${id} no encontrado`);
    }

    return teacher;
  }

  async update(id: string, updateTeacherDto: UpdateTeacherDto) {
    const teacher = await this.findOne(id);

    await this.ensureUnique(updateTeacherDto.email, updateTeacherDto.identityNumber, id);

    const updated = this.teacherRepository.merge(teacher, updateTeacherDto);
    const result = await this.teacherRepository.save(updated);

    return { message: 'Profesor actualizado con éxito.', data: result };
  }

  async remove(id: string) {
    const teacher = await this.findOne(id);

    await this.teacherRepository.remove(teacher);

    return { message: 'Profesor eliminado con éxito.', data: Object.assign(teacher, { id }) };
  }

  // Lanza 409 si el email o el documento ya pertenecen a otro profesor
  private async ensureUnique(email?: string, identityNumber?: string, excludeId?: string) {
    const notSelf = excludeId ? { id: Not(excludeId) } : {};

    if (email) {
      const exists = await this.teacherRepository.exists({ where: { email, ...notSelf } });
      if (exists) {
        throw new ConflictException(`Ya existe un profesor con el correo ${email}`);
      }
    }

    if (identityNumber) {
      const exists = await this.teacherRepository.exists({ where: { identityNumber, ...notSelf } });
      if (exists) {
        throw new ConflictException(`Ya existe un profesor con el número de identidad ${identityNumber}`);
      }
    }
  }
}
