import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import {
    ENROLLMENT_GRADES,
    ENROLLMENT_STATUSES,
    type EnrollmentGrade,
    type EnrollmentStatus,
} from '../entities/enrollment.entity.js';

export class CreateEnrollmentDto {
    @IsDateString({}, { message: 'La fecha de matrícula debe tener formato YYYY-MM-DD' })
    enrollmentDate: string

    @Type(() => Number)
    @IsInt({ message: 'El año académico debe ser un número entero' })
    @Min(2000, { message: 'El año académico debe ser mayor o igual a 2000' })
    academicYear: number

    @IsIn(ENROLLMENT_GRADES, { message: `El grado debe ser uno de: ${ENROLLMENT_GRADES.join(', ')}` })
    grade: EnrollmentGrade

    @IsUUID('all', { message: 'El student_id debe ser un UUID válido' })
    student_id: string

    @IsOptional()
    @IsIn(ENROLLMENT_STATUSES, { message: `El estado debe ser uno de: ${ENROLLMENT_STATUSES.join(', ')}` })
    status?: EnrollmentStatus

    @IsOptional()
    @IsString()
    observations?: string
}
