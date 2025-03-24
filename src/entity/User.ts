import { Entity, PrimaryColumn, Column } from "typeorm";

export enum Role {
    Admin = "Admin",
    User = "User"
}

@Entity()
export class User {
    @PrimaryColumn({ type: "varchar", length: 50 })
    id: string;

    @Column()
    email: string;

    @Column()
    password: string;

    @Column()
    title: string;

    @Column()
    firstname: string;

    @Column()
    lastname: string;

    // ✅ Correct way to define an enum in TypeORM
    @Column({ type: "enum", enum: Role, default: Role.User })
    role: Role;
}