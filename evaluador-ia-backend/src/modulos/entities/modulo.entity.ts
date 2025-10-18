import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Index } from 'typeorm';
import { Asignatura } from '../../asignaturas/entities/asignatura.entity';

@Entity('modulos')
export class Modulo {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 150 })
  titulo!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  // Relación con Asignatura
  @Column({ type: 'uuid' })
  asignaturaId!: string;

  @ManyToOne(() => Asignatura, (a) => a.modulos, { onDelete: 'CASCADE' })
  asignatura!: Asignatura;
}
