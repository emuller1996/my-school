import { Transform, Type } from 'class-transformer';
import {
    IsBoolean,
    IsIn,
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    Min,
} from 'class-validator';
import { CLASSROOM_STATUSES, type ClassroomStatus } from '../entities/classroom.entity.js';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateClassroomDto {
    @Transform(trim)
    @IsString()
    @IsNotEmpty({ message: 'El nombre del salón es obligatorio' })
    @MaxLength(50)
    name: string

    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
    @IsString()
    @IsNotEmpty({ message: 'La sección es obligatoria' })
    @MaxLength(10)
    section: string

    @Type(() => Number)
    @IsInt({ message: 'La capacidad debe ser un número entero' })
    @Min(1, { message: 'La capacidad debe ser mayor a 0' })
    capacity: number

    @Type(() => Number)
    @IsInt({ message: 'El año académico debe ser un número entero' })
    @Min(1, { message: 'El año académico debe ser mayor a 0' })
    academicYear: number

    @IsOptional()
    @Transform(trim)
    @IsString()
    @MaxLength(100)
    location?: string

    @IsOptional()
    @IsIn(CLASSROOM_STATUSES, { message: `El estado debe ser uno de: ${CLASSROOM_STATUSES.join(', ')}` })
    status?: ClassroomStatus

    @IsOptional()
    @IsBoolean()
    isActive?: boolean
}
