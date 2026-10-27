import { IsDateString, IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    code:string

    @IsString()
    @IsNotEmpty()
    name:string

    @IsOptional()
    @IsString()
    note:string

    @IsDateString()
    birthdate:string

    @IsIn(["CC", "TI", "RC", "PP"])
    typeIdentityDocument:string

    @IsString()
    @IsNotEmpty()
    identityNumber:string
}
