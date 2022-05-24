import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { User } from '@/users/user.entity';

@ObjectType()
@Entity('todos')
export class Todo {
  @ApiProperty()
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Column()
  userId!: number;

  @ApiProperty()
  @Field()
  @Column()
  title!: string;

  @ApiProperty()
  @Field()
  @Column()
  completed!: boolean;

  @ApiProperty()
  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @ApiPropertyOptional()
  @Field(() => User)
  @ManyToOne(() => User, (user) => user.todos)
  user!: User;
}
