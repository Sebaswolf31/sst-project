import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Risk } from '../../risk/entities/risk.entity';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../company/entities/company.entity';
import { Document } from '../../document/entities/document.entity';

export enum InspectionType {
  A = 'A',
  B = 'B',
  C = 'C',
}

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: InspectionType,
    default: InspectionType.A,
  })
  type: InspectionType;

  @Column('text')
  description: string;

  // Campo attachments
  @Column({
    type: 'simple-array',
    nullable: true,
  })
  attachments: string[] | null; // Adjuntos generales

  @Column({
    type: 'text', // Tipo explícito para PostgreSQL
    nullable: true,
  })
  signature: string | null; // URL de la firma en Cloudinary

  @Column({ type: 'uuid' })
  riskId: string;

  @ManyToOne(() => Risk, (risk) => risk.inspections)
  @JoinColumn({ name: 'riskId' })
  risk: Risk;

  @Column('timestamp')
  date: Date;

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (c) => c.inspections, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User, (user) => user.inspections)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => Document, (doc) => doc.inspection)
  documents: Document[];
}
