import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../../libs/common/entities/base.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  slug: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ name: 'parent_id', type: 'uuid', nullable: true })
  parentId?: string;

  @Column({ nullable: true })
  icon?: string;

  @ManyToOne(() => CategoryEntity, (category) => category.children, {
    nullable: true,
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent?: CategoryEntity;

  @OneToMany(() => CategoryEntity, (category) => category.parent)
  children?: CategoryEntity[];
}
