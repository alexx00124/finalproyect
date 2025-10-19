import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Modulo } from '../../modulos/entities/modulo.entity';

@Entity('asignaturas')
export class Asignatura {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 150 })
  nombre!: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  // Relación con Modulo (una asignatura puede tener varios módulos)
  @OneToMany(() => Modulo, (modulo) => modulo.asignatura, {
    cascade: true,
  })
  modulos!: Modulo[];
}
