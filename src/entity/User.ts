import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"


enum Role {
    Admin = "Admin",
    User = "User"
}

@Entity()
export class User {

    @PrimaryGeneratedColumn() // ✅ This auto-generates the ID
    id: number;  

    @Column()
    email: string

    @Column()
    password: string;

    @Column()
    title: string

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column()
    role: Role;

}