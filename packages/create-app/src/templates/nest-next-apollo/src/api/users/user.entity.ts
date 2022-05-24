import { Field, HideField, Int, ObjectType } from '@nestjs/graphql';
import { ApiHideProperty, ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import bcrypt from 'bcryptjs';

import { Todo } from '@/api/todos/todo.entity';

@ObjectType()
@Entity('users')
export class User {
  @ApiProperty()
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty()
  @Field()
  @Column({
    unique: true,
  })
  email!: string;

  @ApiHideProperty()
  @Exclude()
  @HideField()
  @Column()
  password!: string;

  @ApiProperty()
  @Field()
  @Column()
  firstName!: string;

  @ApiProperty()
  @Field()
  @Column()
  lastName!: string;

  @ApiProperty()
  @Field()
  @CreateDateColumn()
  createdAt!: Date;

  @ApiProperty()
  @Field()
  @UpdateDateColumn()
  updatedAt!: Date;

  @ApiPropertyOptional()
  @Field(() => [Todo])
  @OneToMany(() => Todo, (todo) => todo.user)
  todos!: Todo[];

  static async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  static async comparePassword(password: string, hashPassword: string) {
    return bcrypt.compare(password, hashPassword);
  }
}
