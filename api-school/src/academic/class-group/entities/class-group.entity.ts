import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../../students/entities/student.entity.js';
import { Enrollment } from '../../enrollments/entities/enrollment.entity.js';

@Entity('class_groups')
export class ClassGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50 })
  name: string;

  @Column({ type: 'int', unsigned: true })
  academicYear: number;

  @Column({
    type: 'enum',
    enum: [
      'primero',
      'segundo',
      'tercero',
      'cuarto',
      'quinto',
      'sexto',
      'séptimo',
      'octavo',
      'noveno',
      'décimo',
      'once',
    ],
  })
  grade: string;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.classgroup)
  enrollments: Relation<Enrollment>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
