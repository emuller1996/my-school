import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository, type FindOptionsWhere } from 'typeorm';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto.js';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto.js';
import { Enrollment, type EnrollmentGrade, type EnrollmentStatus } from './entities/enrollment.entity.js';
import { Student } from '../students/entities/student.entity.js';

@Injectable()
export class EnrollmentsService {
  constructor(
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) { }

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    await this.ensureStudentExists(createEnrollmentDto.student_id);

    // Una matrícula nueva queda 'activa' si no se envía otro estado
    if ((createEnrollmentDto.status ?? 'activa') === 'activa') {
      await this.ensureNoActiveEnrollment(createEnrollmentDto.student_id, createEnrollmentDto.academicYear);
    }

    const enrollment = this.enrollmentRepository.create(createEnrollmentDto);
    const saved = await this.enrollmentRepository.save(enrollment);

    return { message: 'Matrícula creada con éxito.', data: await this.findOne(saved.id) };
  }

  async findAll(academicYear?: number, grade?: string, status?: string) {
    const where: FindOptionsWhere<Enrollment> = {};
    if (academicYear !== undefined) where.academicYear = academicYear;
    if (grade) where.grade = grade as EnrollmentGrade;
    if (status) where.status = status as EnrollmentStatus;

    return this.enrollmentRepository.find({
      where,
      relations: { student: true },
      order: { academicYear: 'DESC', enrollmentDate: 'DESC' },
    });
  }

  async findOne(id: string) {
    const enrollment = await this.enrollmentRepository.findOne({
      where: { id },
      relations: { student: true },
    });

    if (!enrollment) {
      throw new NotFoundException(`Matrícula con id ${id} no encontrada`);
    }

    return enrollment;
  }

  async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    const enrollment = await this.findOne(id);

    if (updateEnrollmentDto.student_id && updateEnrollmentDto.student_id !== enrollment.student_id) {
      await this.ensureStudentExists(updateEnrollmentDto.student_id);
    }

    // Revalida la regla si el resultado queda 'activa' y cambió estudiante, año o estado
    const studentId = updateEnrollmentDto.student_id ?? enrollment.student_id;
    const academicYear = updateEnrollmentDto.academicYear ?? enrollment.academicYear;
    const status = updateEnrollmentDto.status ?? enrollment.status;
    const touchesRule =
      updateEnrollmentDto.student_id !== undefined ||
      updateEnrollmentDto.academicYear !== undefined ||
      updateEnrollmentDto.status !== undefined;

    if (status === 'activa' && touchesRule) {
      await this.ensureNoActiveEnrollment(studentId, academicYear, id);
    }

    // Se quita la relación cargada para que no pise el nuevo student_id al guardar
    const { student: _student, ...current } = enrollment;
    const updated = this.enrollmentRepository.merge(
      this.enrollmentRepository.create(current),
      updateEnrollmentDto,
    );
    await this.enrollmentRepository.save(updated);

    return { message: 'Matrícula actualizada con éxito.', data: await this.findOne(id) };
  }

  async remove(id: string) {
    const enrollment = await this.findOne(id);

    await this.enrollmentRepository.remove(enrollment);

    return { message: 'Matrícula eliminada con éxito.', data: Object.assign(enrollment, { id }) };
  }

  private async ensureStudentExists(studentId: string) {
    const exists = await this.studentRepository.exists({ where: { id: studentId } });

    if (!exists) {
      throw new NotFoundException(`Estudiante con id ${studentId} no encontrado`);
    }
  }

  // Lanza 409 si el estudiante ya tiene otra matrícula activa en ese año lectivo
  private async ensureNoActiveEnrollment(studentId: string, academicYear: number, excludeId?: string) {
    const active = await this.enrollmentRepository.findOne({
      where: {
        student_id: studentId,
        academicYear,
        status: 'activa',
        ...(excludeId ? { id: Not(excludeId) } : {}),
      },
    });

    if (active) {
      throw new ConflictException(
        `El estudiante ya tiene una matrícula activa en el año ${academicYear} (grado ${active.grade})`,
      );
    }
  }
}
