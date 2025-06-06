import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { InspectionTemplate } from './inspection-template.entity';

// Definir ENUMs para los nuevos campos
export enum FormType {
  WORK_AREAS = 'areas y puestos de trabajo',
  MACHINERY = 'maquinaria y equipos',
  PROTECTIVE_EQUIPMENT = 'elementos de protección personal',
  MEDICAL = 'botiquines y camillas',
}

export enum InspectionType {
  SPONTANEOUS = 'espontanea',
  PLANNED = 'planeada',
}

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  date: Date;

  // Nuevo campo: Tipo de formulario (ENUM)
  @Column({
    type: 'enum',
    enum: FormType,
    default: FormType.WORK_AREAS,
  })
  formType: FormType;

  // Nuevo campo: Tipo de inspección (ENUM)
  @Column({
    type: 'enum',
    enum: InspectionType,
    default: InspectionType.PLANNED,
  })
  inspectionType: InspectionType;

  // Nuevo campo: Archivo adjunto (almacenará la ruta/nombre del archivo)
  @Column({ nullable: true })
  attachment?: string;

  @Column({ type: 'jsonb' })
  dynamicFields: Record<string, any>;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inspectorId' })
  inspector: User;

  @Column({ type: 'uuid' })
  inspectorId: string;

  @ManyToOne(() => InspectionTemplate)
  @JoinColumn({ name: 'templateId' })
  template: InspectionTemplate;

  @Column({ type: 'uuid' })
  templateId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
