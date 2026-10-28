import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, type Relation } from "typeorm";
import { Student } from "../../students/entities/student.entity.js";

export const ENROLLMENT_GRADES = [
    "primero", "segundo", "tercero", "cuarto", "quinto", "sexto",
    "séptimo", "octavo", "noveno", "décimo", "once",
] as const;
export type EnrollmentGrade = typeof ENROLLMENT_GRADES[number];

export const ENROLLMENT_STATUSES = ["activa", "retirada", "finalizada"] as const;
export type EnrollmentStatus = typeof ENROLLMENT_STATUSES[number];

@Entity("enrollments")
export class Enrollment {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: "date" })
    enrollmentDate: Date;

    @Column({ type: "int", unsigned: true })
    academicYear: number;

    @Column({ type: "enum", enum: ENROLLMENT_GRADES })
    grade: EnrollmentGrade;

    @Column({ type: "enum", enum: ENROLLMENT_STATUSES, default: "activa" })
    status: EnrollmentStatus;

    @Column({ type: "text", nullable: true })
    observations: string;

    @ManyToOne(() => Student, { nullable: false })
    @JoinColumn({ name: 'student_id' })
    student: Relation<Student>;

    @Column()
    student_id: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
