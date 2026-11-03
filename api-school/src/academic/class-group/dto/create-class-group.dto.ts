import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min } from 'class-validator';
import { ENROLLMENT_GRADES } from '../../enrollments/entities/enrollment.entity.js';

export class CreateClassGroupDto {
    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
    @IsString()
    @IsNotEmpty({ message: 'El nombre del grupo es obligatorio' })
    @MaxLength(50)
    name: string

    @Type(() => Number)
    @IsInt({ message: 'El año académico debe ser un número entero' })
    @Min(2000, { message: 'El año académico debe ser mayor o igual a 2000' })
    academicYear: number

    // Mismos grados que la matrícula
    @IsIn(ENROLLMENT_GRADES, { message: `El grado debe ser uno de: ${ENROLLMENT_GRADES.join(', ')}` })
    grade: string

    // Director de curso; null (o '') lo quita
    @Transform(({ value }) => (value === '' ? null : value))
    @IsOptional()
    @IsUUID('all', { message: 'El director_id debe ser un UUID válido' })
    director_id?: string | null
}
