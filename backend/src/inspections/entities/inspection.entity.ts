
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

@Entity()
export class Inspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  date: Date;

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
