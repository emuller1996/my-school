import { Transform } from 'class-transformer';
import {
    IsBoolean,
    IsDateString,
    IsEmail,
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    Matches,
    MaxLength,
} from 'class-validator';
import { TEACHER_DOCUMENT_TYPES } from '../entities/teacher.entity.js';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

export class CreateTeacherDto {
    @Transform(trim)
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MaxLength(100)
    firstName: string

    @Transform(trim)
    @IsString()
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @MaxLength(100)
    lastName: string

    @Transform(({ value }) => (typeof value === 'string' ? value.trim().toLowerCase() : value))
    @IsEmail({}, { message: 'El correo electrónico no es válido' })
    @MaxLength(150)
    email: string

    @IsOptional()
    @Transform(trim)
    @IsString()
    @MaxLength(20)
    @Matches(/^[0-9+\s-]*$/, { message: 'El teléfono solo puede contener números, espacios, + y -' })
    phone?: string

    @IsIn(TEACHER_DOCUMENT_TYPES, { message: `El tipo de documento debe ser uno de: ${TEACHER_DOCUMENT_TYPES.join(', ')}` })
    typeIdentityDocument: string

    @Transform(trim)
    @IsString()
    @IsNotEmpty({ message: 'El número de identidad es obligatorio' })
    @Matches(/^[0-9A-Za-z-]+$/, { message: 'El número de identidad solo puede contener números, letras y guiones' })
    identityNumber: string

    @Transform(trim)
    @IsString()
    @IsNotEmpty({ message: 'La especialidad es obligatoria' })
    specialty: string

    @IsDateString({}, { message: 'La fecha de contratación debe tener formato YYYY-MM-DD' })
    hireDate: string

    @IsOptional()
    @IsBoolean()
    isActive?: boolean
}
