import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Parent } from "../../parents/entities/parent.entity.js";

@Entity("students")
export class Student {

    @PrimaryGeneratedColumn('uuid') // 👈 Genera automáticamente el UUID
    id: string;

    @Column()
    code: string;

    @Column()
    name: string;

    @Column()
    note: string;

    @Column({ type: "date" })
    birthdate: Date;

    @Column({ type: "enum", enum: ["CC", "TI", "RC", "PP"], nullable: false })
    typeIdentityDocument: string

    @Column({ nullable: false })
    identityNumber: string

    @ManyToOne(() => Parent, (parent) => parent.students)
    parent: Parent


}
