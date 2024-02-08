import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('admin')
export class AdminEntity {
    @PrimaryGeneratedColumn({ name: 'a_id' })
    a_id: number;
    @Column({ length: 150 })
    name: string;
    @Column({ length: 80, unique: true })
    username: string;
    @Column()
    email: string;
    @Column()
    contact: number;
    @Column()
    password: string;
}