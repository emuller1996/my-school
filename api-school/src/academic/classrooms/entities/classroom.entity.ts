import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

export const CLASSROOM_STATUSES = ["ocupado", "disponible"] as const;
export type ClassroomStatus = typeof CLASSROOM_STATUSES[number];

@Entity("classrooms")
@Unique("UQ_classroom_name_year", ["name", "academicYear"])
export class Classroom {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50 })
    name: string;

    @Column({ length: 10 })
    section: string;

    @Column({ type: "int", unsigned: true })
    capacity: number;

    @Column({ type: "int", unsigned: true })
    academicYear: number;

    @Column({ length: 100, nullable: true })
    location: string;

    @Column({ type: "enum", enum: CLASSROOM_STATUSES, default: "disponible" })
    status: ClassroomStatus;

    @Column({ default: true })
    isActive: boolean;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
