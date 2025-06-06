// inspections/entities/inspection-template.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { FormType } from '../enums/form-type.enum'; // Asegúrate de que este enum esté definido en tu entidad de inspección

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
}

export interface DynamicFieldDefinition {
  fieldName: string;
  displayName: string;
  type: 'text' | 'number' | 'checkbox' | 'date' | 'dropdown';
  required: boolean;
  options?: string[];
}
