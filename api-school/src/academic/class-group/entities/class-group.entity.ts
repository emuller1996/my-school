import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
  UpdateDateColumn,
} from 'typeorm';
import { Enrollment } from '../../enrollments/entities/enrollment.entity.js';
import { ClassroomAssignment } from '../../classrooms/entities/classroom-assignment.entity.js';
import { Teacher } from '../../teachers/entities/teacher.entity.js';

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

  // 👇 Director de curso (opcional). Si se elimina el profesor, el grupo queda sin director
  @ManyToOne(() => Teacher, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'director_id' })
  director: Relation<Teacher> | null;

  @Column({ nullable: true })
  director_id: string | null;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.classgroup)
  enrollments: Relation<Enrollment>[];

  // 👇 Un grupo puede tener asignaciones (normalmente una por año)
  @OneToMany(() => ClassroomAssignment, (a) => a.classgroup)
  assignments: Relation<ClassroomAssignment>[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
