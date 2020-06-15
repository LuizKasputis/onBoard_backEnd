import {Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate} from "typeorm";
import { hashPassword } from '../hasPassword/haspassword';

@Entity()
export class User {
    
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({ unique: true})
    email: string

    @Column()
    birthDate: String

    @Column()
    cpf: number

    @Column()
    password: string

    @BeforeInsert()
    @BeforeUpdate()
        hashpassword(){
            if (this.password) {
                this.password = hashPassword(this.password);
            }
        }

};
