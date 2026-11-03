import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, type SelectQueryBuilder } from 'typeorm';
import { CreateClassGroupDto } from './dto/create-class-group.dto.js';
import { UpdateClassGroupDto } from './dto/update-class-group.dto.js';
import { ClassGroup } from './entities/class-group.entity.js';
import { Enrollment } from '../enrollments/entities/enrollment.entity.js';
import { Teacher } from '../teachers/entities/teacher.entity.js';

@Injectable()
export class ClassGroupService {
  constructor(
    @InjectRepository(ClassGroup)
    private classGroupRepository: Repository<ClassGroup>,
    @InjectRepository(Teacher)
    private teacherRepository: Repository<Teacher>,
  ) { }

  async create(createClassGroupDto: CreateClassGroupDto) {
    await this.ensureUnique(createClassGroupDto.name, createClassGroupDto.academicYear);
    if (createClassGroupDto.director_id) await this.ensureDirectorValid(createClassGroupDto.director_id);

    const classGroup = this.classGroupRepository.create(createClassGroupDto);
    const saved = await this.classGroupRepository.save(classGroup);

    return { message: 'Se creo el grupo con exito.', data: await this.findOne(saved.id) };
  }

  async findAll(search?: string, academicYear?: number, grade?: string, director_id?: string) {
    const query = this.baseQuery()
      .orderBy('classGroup.academicYear', 'DESC')
      .addOrderBy('classGroup.name', 'ASC');

    const term = search?.trim();
    if (term) {
      // Escapa los comodines de LIKE para que '%' y '_' se busquen literalmente
      query.andWhere('classGroup.name LIKE :like', { like: `%${term.replace(/[\\%_]/g, '\\$&')}%` });
    }
    if (academicYear !== undefined) query.andWhere('classGroup.academicYear = :academicYear', { academicYear });
    if (grade) query.andWhere('classGroup.grade = :grade', { grade });
    if (director_id) query.andWhere('classGroup.director_id = :director_id', { director_id });

    return this.withEnrollmentsCount(query);
  }

  async findOne(id: string) {
    const [classGroup] = await this.withEnrollmentsCount(
      this.baseQuery().where('classGroup.id = :id', { id }),
    );

    if (!classGroup) {
      throw new NotFoundException(`Grupo con id ${id} no encontrado`);
    }

    return classGroup;
  }

  async update(id: string, updateClassGroupDto: UpdateClassGroupDto) {
    const classGroup = await this.findOne(id);

    // Valida la combinación resultante (el cambio puede venir solo en name o solo en academicYear)
    if (updateClassGroupDto.name !== undefined || updateClassGroupDto.academicYear !== undefined) {
      await this.ensureUnique(
        updateClassGroupDto.name ?? classGroup.name,
        updateClassGroupDto.academicYear ?? classGroup.academicYear,
        id,
      );
    }

    if (updateClassGroupDto.director_id && updateClassGroupDto.director_id !== classGroup.director_id) {
      await this.ensureDirectorValid(updateClassGroupDto.director_id);
    }

    // Se quitan la relación cargada y el conteo para que no pisen el nuevo director_id al guardar
    const { director: _director, enrollmentsCount: _count, ...current } = classGroup;
    const updated = this.classGroupRepository.merge(
      this.classGroupRepository.create(current),
      updateClassGroupDto,
    );
    await this.classGroupRepository.save(updated);

    return { message: 'Grupo actualizado con éxito.', data: await this.findOne(id) };
  }

  async remove(id: string) {
    const classGroup = await this.findOne(id);

    // La FK de Enrollment tiene onDelete CASCADE: borrar el grupo borraría sus matrículas
    if (classGroup.enrollmentsCount > 0) {
      throw new ConflictException(
        `No se puede eliminar el grupo ${classGroup.name}: tiene ${classGroup.enrollmentsCount} matrícula(s) asociada(s)`,
      );
    }

    await this.classGroupRepository.remove(classGroup);

    return { message: 'Grupo eliminado con éxito.', data: Object.assign(classGroup, { id }) };
  }

  // Consulta base: incluye el director de curso (puede ser null)
  private baseQuery() {
    return this.classGroupRepository
      .createQueryBuilder('classGroup')
      .leftJoinAndSelect('classGroup.director', 'director');
  }

  // El director debe existir y estar activo
  private async ensureDirectorValid(teacherId: string) {
    const teacher = await this.teacherRepository.findOne({ where: { id: teacherId } });

    if (!teacher) {
      throw new NotFoundException(`Profesor con id ${teacherId} no encontrado`);
    }
    if (!teacher.isActive) {
      throw new ConflictException(
        `El profesor ${teacher.firstName} ${teacher.lastName} está inactivo y no puede ser director de curso`,
      );
    }
  }

  // Agrega `enrollmentsCount` (número de matrículas del grupo) con una subconsulta, sin cargar la relación
  private async withEnrollmentsCount(query: SelectQueryBuilder<ClassGroup>) {
    const { entities, raw } = await query
      .addSelect(
        (sub) => sub.select('COUNT(e.id)').from(Enrollment, 'e').where('e.classgroup_id = classGroup.id'),
        'enrollmentsCount',
      )
      .getRawAndEntities<{ classGroup_id: string; enrollmentsCount: string }>();

    const counts = new Map(raw.map((r) => [r.classGroup_id, Number(r.enrollmentsCount)]));
    return entities.map((g) => Object.assign(g, { enrollmentsCount: counts.get(g.id) ?? 0 }));
  }

  // Lanza 409 si ya existe otro grupo con el mismo nombre en el mismo año académico
  private async ensureUnique(name: string, academicYear: number, excludeId?: string) {
    const exists = await this.classGroupRepository.exists({
      where: { name, academicYear, ...(excludeId ? { id: Not(excludeId) } : {}) },
    });

    if (exists) {
      throw new ConflictException(`Ya existe un grupo ${name} para el año académico ${academicYear}`);
    }
  }
}
