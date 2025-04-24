import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Risk } from '../../risk/entities/risk.entity';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../company/entities/company.entity';

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  riskId: string;

  @ManyToOne(() => Risk)
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
}
