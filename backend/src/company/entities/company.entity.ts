import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';


@Entity()
export class Company {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => User, (user) => user.companies)
  users: User[];

  // @OneToMany(() => User, (user) => user.company)
  // users: User[];
}
