import {
    Entity,
    Column,
    Index,
    BeforeInsert,
    ManyToOne,
    JoinColumn,
    AfterUpdate,
} from 'typeorm';
import BaseModel from './model.entity';
import { User } from './user.entity';

@Entity('courses')
export class Course extends BaseModel {
    @Column()
    courseName: string;

    @Column({
        default: 0,
    })
    students: number;

    @ManyToOne(() => User, (user) => user.courses, {
        eager: true,
        onDelete: 'CASCADE',
    })

    @JoinColumn()
    user: User;


    toJSON() {
        return { ...this };
    }
}
