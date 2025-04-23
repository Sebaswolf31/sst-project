import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Unique,
} from 'typeorm';
//import { Company } from '../../company/entities/company.entity';
//import { Risk } from '../../risks/entities/risk.entity';
//import { Inspection } from '../../inspections/entities/inspection.entity';
//import { Document } from '../../documents/entities/document.entity';

export enum UserRole {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  OPERATOR = 'operator',
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
  password: string;

  @Column()
  phone: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.OPERATOR,
  })
  role: UserRole;

  // Relación con Company
  //@ManyToOne(() => Company, (company) => company.users, {
  //nullable: true,  // Permite companyId = NULL
  //  onDelete: 'CASCADE', // Si se elimina la empresa, se eliminan sus usuarios
  //})
  //company: Company;
  //
  //// Relaciones con otras entidades (creaciones)
  //@OneToMany(() => Risk, (risk) => risk.createdBy)
  //risks: Risk[];
  //
  //@OneToMany(() => Inspection, (inspection) => inspection.createdBy)
  //inspections: Inspection[];
  //
  //@OneToMany(() => Document, (document) => document.uploadedBy)
  //documents: Document[];
}
