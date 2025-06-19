import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/user.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn() id: number;
  @Column() city: string;
  @ManyToOne(() => User, user => user.favorites, { onDelete: 'CASCADE' })
  user: User;
}