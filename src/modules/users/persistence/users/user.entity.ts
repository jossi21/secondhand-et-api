import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../libs/common/entities/base.entity';
import { UserRole } from './user-role.enum';

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  nationalIdRef?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;
}
