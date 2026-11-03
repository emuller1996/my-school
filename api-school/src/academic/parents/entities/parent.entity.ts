import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity.js';

@Entity('parents')
export class Parent {
  @PrimaryGeneratedColumn('uuid') // 👈 Genera automáticamente el UUID
  id: string;

  @Column()
  name: string;

  @Column()
  relationship: string;

  @Column({ type: 'enum', enum: ['CC', 'TI', 'RC', 'PP'], nullable: false })
  type_identity_document: string;

  @Column({ nullable: false })
  identity_number: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  occupation: string;

  @OneToOne(() => Student, (student) => student.parent)
  student: Relation<Student>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
