import { Entity, Column, Index, BeforeInsert, OneToMany } from 'typeorm';
import BaseModel from './model.entity';
import * as bcrypt from 'bcryptjs';
import { Course } from './course.entity';

export enum RoleEnumType {
    USER = 'user',
    ADMIN = 'admin',
}

@Entity('users')
export class User extends BaseModel {
    @Index('email_index')
    @Column({
        unique: true,
    })
    email: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: RoleEnumType,
        default: RoleEnumType.USER,
    })
    role: RoleEnumType.USER;

    @Column()
    fullName: string;

    @OneToMany(() => Course, (course) => course.user)
    courses: Course[];

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 12);
    }

    // ? Validate password
    static async comparePasswords(
        candidatePassword: string,
        hashedPassword: string
    ) {
        return await bcrypt.compare(candidatePassword, hashedPassword);
    }

    toJSON() {
        return { ...this, password: undefined };
    }
}
