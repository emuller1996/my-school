import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Student } from "../../students/entities/student.entity.js";

@Entity("parents")

export class Parent {

    @PrimaryGeneratedColumn('uuid') // 👈 Genera automáticamente el UUID
    id: string;

    @Column()
    name: string;

    @Column()
    relationship: string;

    @Column({ type: "enum", enum: ["CC", "TI", "RC", "PP"], nullable: false })
    type_identity_document: string

    @Column({ nullable: false })
    identity_number: string

    @OneToMany(() => Student, (student) => student.parent)
    students: Student[]
}
