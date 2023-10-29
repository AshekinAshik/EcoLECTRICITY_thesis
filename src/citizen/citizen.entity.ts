import { UsageLOGEntity } from "src/database/database.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('citizen')
export class CitizenEntity {
    @PrimaryGeneratedColumn({name:'c_id'})
    id:number
    @Column({length:150})
    name:string;
    @Column()
    email:string;
    @Column()
    contact:number;
    @Column()
    location:string;
    @Column()
    password:string;

    @OneToMany(() => UsageLOGEntity, usagelog => usagelog.citizen, {cascade: ["remove"]})
        usagelogs: UsageLOGEntity[]
}