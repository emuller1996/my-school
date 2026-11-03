import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  type Relation,
} from 'typeorm';
import { Classroom } from '../../classrooms/entities/classroom.entity.js';
import { ClassGroup } from '../../class-group/entities/class-group.entity.js';

export const JORNADAS = ['mañana', 'tarde', 'noche'] as const;
export type Jornada = (typeof JORNADAS)[number];

@Entity('classroom_assignments')
@Unique('UQ_classroom_jornada_year', ['classroom_id', 'jornada', 'academicYear'])
@Unique('UQ_classgroup_year', ['classgroup_id', 'academicYear'])
export class ClassroomAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: JORNADAS })
  jornada: Jornada;

  @Column({ type: 'int', unsigned: true })
  academicYear: number;

  // 👇 Relación al salón
  @ManyToOne(() => Classroom, (classroom) => classroom.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'classroom_id' })
  classroom: Relation<Classroom>;

  @Column()
  classroom_id: string;

  // 👇 Relación al grupo
  @ManyToOne(() => ClassGroup, (classGroup) => classGroup.assignments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'classgroup_id' })
  classgroup: Relation<ClassGroup>;

  @Column()
  classgroup_id: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}