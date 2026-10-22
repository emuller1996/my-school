import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, type Relation  } from "typeorm";
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

    @OneToOne(() => Parent, (parent) => parent.student, { onDelete: 'SET NULL' })
    @JoinColumn({ name: 'parent_id' })
    parent: Relation<Parent>;

    @Column({ nullable: true })
    parent_id: string;

}
