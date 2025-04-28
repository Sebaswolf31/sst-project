import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../company/entities/company.entity';
import { Inspection } from '../../inspection/entities/inspection.entity';
import { Document } from '../../document/entities/document.entity';

export enum RiskCategory {
  A = 'A',
  B = 'B',
  C = 'C',
}

export enum RiskImpact {
  LOW = 'A',
  MEDIUM = 'B',
  HIGH = 'C',
}

@Entity()
export class Risk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column({
    type: 'enum',
    enum: RiskCategory,
    default: RiskCategory.A,
  })
  category: RiskCategory;

  @Column({
    type: 'enum',
    enum: RiskImpact,
    default: RiskImpact.LOW,
  })
  impact: RiskImpact;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  probability: number;

  @Column({
    type: 'simple-array',
    nullable: true,
  })
  attachments: string[] | null; // URLs de Cloudinary

  @Column({ type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, (company) => company.risks, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  @Column({ type: 'uuid' })
  createdById: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @OneToMany(() => Inspection, (inspection) => inspection.risk)
  inspections: Inspection[]; // ✅ Relación inversa

  @OneToMany(() => Document, (doc) => doc.risk)
  documents: Document[];
}
