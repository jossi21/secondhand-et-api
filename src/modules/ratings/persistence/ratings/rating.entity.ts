import { Column, Entity, Index, JoinColumn, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../../../libs/common/entities/base.entity';
import { UserEntity } from '../../../users/persistence/users/user.entity';

@Entity('ratings')
@Unique(['fromUserId', 'toUserId'])
@Index(['toUserId'])
export class RatingEntity extends BaseEntity {
  @Column({ type: 'int' })
  score: number;

  @Column({ nullable: true, type: 'text' })
  comment?: string;

  @Column({ name: 'from_user_id', type: 'uuid' })
  fromUserId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'from_user_id' })
  fromUser: UserEntity;

  @Column({ name: 'to_user_id', type: 'uuid' })
  toUserId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'to_user_id' })
  toUser: UserEntity;
}
