import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../libs/common/entities/base.entity';
import { UserRole, ContactType } from './user-role.enum';

export interface UserContact {
  type: ContactType;
  value: string;
}

@Entity('users')
export class UserEntity extends BaseEntity {
  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone?: string;

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ nullable: true })
  nationalIdRef?: string;

  @Column({ nullable: true })
  nationalIdPhotoUrl?: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.BUYER })
  role: UserRole;

  @Column({ type: 'jsonb', nullable: true })
  contacts?: UserContact[];
}
