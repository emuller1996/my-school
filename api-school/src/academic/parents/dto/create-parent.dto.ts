import { IsEmail, IsIn, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateIf } from 'class-validator';

export class CreateParentDto {
    @IsUUID()
    student_id: string

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    relationship: string

    @IsIn(["CC", "TI", "RC", "PP"])
    type_identity_document: string

    @IsString()
    @IsNotEmpty()
    identity_number: string

    @IsOptional()
    @IsString()
    phone?: string

    // El formulario envía '' cuando el campo queda vacío
    @ValidateIf((o) => o.email !== '' && o.email != null)
    @IsEmail()
    email?: string

    @IsOptional()
    @IsString()
    address?: string

    @IsOptional()
    @IsString()
    occupation?: string
}
