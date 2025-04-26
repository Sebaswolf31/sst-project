import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Risk } from '../../risk/entities/risk.entity';
import { Inspection } from 'src/inspection/entities/inspection.entity';

@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @OneToMany(() => User, (user) => user.company)
  users: User[];

  @OneToMany(() => Risk, (risk) => risk.company)
  risks: Risk[];

  @OneToMany(() => Inspection, (insp) => insp.company)
  inspections: Inspection[];
}
