import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column()
    title: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    @Column({ default: "user" })
    role: string;

    @Column({ nullable: true })
    age?: number;

}