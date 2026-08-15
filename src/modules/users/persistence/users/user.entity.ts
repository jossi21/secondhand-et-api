import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../../libs/common/entities/base.entity';

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
}
