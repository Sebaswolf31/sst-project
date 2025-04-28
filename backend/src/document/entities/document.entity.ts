import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Inspection } from '../../inspection/entities/inspection.entity';
import { Risk } from '../../risk/entities/risk.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalName: string;

  @Column()
  cloudinaryUrl: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @ManyToOne(() => User, (user) => user.documents)
  @JoinColumn({ name: 'uploadedById' })
  uploadedBy: User;

  // Relación con Inspection
  @ManyToOne(() => Inspection, (inspection) => inspection.documents, {
    nullable: true,
  })
  @JoinColumn({ name: 'inspectionId' })
  inspection?: Inspection;

  // Relación con Risk
  @ManyToOne(() => Risk, (risk) => risk.documents, { nullable: true })
  @JoinColumn({ name: 'riskId' })
  risk?: Risk;
}
