import { Column, CreateDateColumn, Entity, Index, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '@/api/users/user.entity';

@Entity('tokens')
@Index(['userId', 'key'], {
  unique: true,
  where: '(("userId") IS NOT NULL)',
})
@Index(['key'], {
  unique: true,
  where: '(("userId") IS NULL)',
})
export class Token {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  userId?: number;

  @Column()
  key!: string;

  @Column()
  value!: string;

  @Column({ default: -1 })
  ttl!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @ManyToOne(() => User, { cascade: ['remove'], onDelete: 'CASCADE' })
  user!: User;
}
