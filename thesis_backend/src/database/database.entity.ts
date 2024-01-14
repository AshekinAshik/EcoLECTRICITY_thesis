import { CitizenEntity } from "src/citizen/citizen.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('usage_log')
export class UsageLOGEntity {
    @PrimaryGeneratedColumn({
        name: 'log_id', 
    })
    id:number;

    @Column({type: 'float'})
    power:number;
    @Column({type: 'float'})
    current:number;
    @Column({type: 'float'})
    voltage:number;
    @Column({type: 'timestamp'})
    time:string;
    @Column({nullable:true})
    c_id:number

    // @Column({nullable: true})
    // cdate: Date

    @ManyToOne(() => CitizenEntity, citizen => citizen.usagelogs, {onDelete: "CASCADE"})
    @JoinColumn({name: 'c_id'})
        citizen: CitizenEntity
}