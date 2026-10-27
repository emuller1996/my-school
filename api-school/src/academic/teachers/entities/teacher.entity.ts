import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

export const TEACHER_DOCUMENT_TYPES = ["CC", "TI", "RC", "PP"] as const;

@Entity("teachers")
export class Teacher {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 100 })
    firstName: string;

    @Column({ length: 100 })
    lastName: string;

    @Column({ length: 150, unique: true })
    email: string;

    @Column({ length: 20, nullable: true })
    phone: string;

    @Column({ type: "enum", enum: TEACHER_DOCUMENT_TYPES, nullable: false })
    typeIdentityDocument: string;

    @Column({ unique: true, nullable: false })
    identityNumber: string;

    @Column()
    specialty: string;

    @Column({ type: "date" })
    hireDate: Date;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
