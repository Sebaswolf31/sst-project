import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
  JoinColumn,
} from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Inspection } from '../../inspections/entities/inspection.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  OPERATOR = 'operator',
  INSPECTOR = 'inspector',
}

@Entity()
@Unique(['email']) // Asegura que el email sea único
@Unique(['identification']) // Identificación única por usuario
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  identification: string; // Ej: Cédula, DNI, Pasaporte

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.OPERATOR,
  })
  role: UserRole;

  @Column({ type: 'uuid', nullable: true }) // ← expone companyId
  companyId?: string;

  // Relación con Company
  @ManyToOne(() => Company, (company) => company.users, {
    nullable: true, // Permite companyId = NULL
    onDelete: 'CASCADE', // Si se elimina la empresa, se eliminan sus usuarios
  })
  @JoinColumn({ name: 'companyId' }) // ← declara la columna FK
  company: Company;

  @OneToMany(() => Inspection, (inspection) => inspection.inspector)
  inspections: Inspection[];
}
