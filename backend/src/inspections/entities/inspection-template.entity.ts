// inspections/entities/inspection-template.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FormType } from '../enums/form-type.enum'; // Asegúrate de que este enum esté definido en tu entidad de inspección

import { User } from '../../users/entities/user.entity';
import { Company } from '../../company/entities/company.entity';

@Entity()
export class InspectionTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @CreateDateColumn({ name: 'created_at' }) // Nombre de columna en DB
  createdAt: Date; // Nombre en la entidad

  @Column({ type: 'jsonb' })
  fields: DynamicFieldDefinition[];

  // Añadir constructor para tipado seguro
  constructor(data?: Partial<InspectionTemplate>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  @Column({
    type: 'enum',
    enum: FormType,
    default: FormType.WORK_AREAS,
  })
  formType: FormType;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => Company)
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid' })
  companyId: string;
}



export interface DynamicFieldDefinition {
  fieldName: string;
  displayName: string;
  type: 'text' | 'number' | 'checkbox' | 'date' | 'dropdown';
  required: boolean;
  options?: string[];
}
