import { CitizenEntity } from "src/citizen/citizen.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('usage_log')
export class UsageLOGEntity {
    @PrimaryGeneratedColumn({
        name: 'log_id',
    })
    id: number;

    @Column({ type: 'float' })
    power: number
    @Column({ type: 'float' })
    current: number
    @Column({ type: 'float' })
    voltage: number
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    time: string;
    @Column({ nullable: true })
    c_id: number

    // @Column({nullable: true})
    // cdate: Date

    @ManyToOne(() => CitizenEntity, citizen => citizen.usagelogs, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'c_id' })
    citizen: CitizenEntity
}

@Entity('energy_cost')
export class EnergyCostEntity {
    @PrimaryGeneratedColumn({
        name: 'e_c_id',
    })
    id: number

    @Column({ type: 'float' })
    energy: number
    @Column({ type: 'float' })
    cost: number
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    time: any;
    @Column({ nullable: true })
    c_id: number

    @ManyToOne(() => CitizenEntity, citizen => citizen.en_costs, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'c_id' })
    citizen: CitizenEntity
}

@Entity('daily_energy_cost')
export class DailyEnergyCostEntity {
    @PrimaryGeneratedColumn({
        name: 'daily_e_c_id',
    })
    id: number

    @Column({ type: 'float' })
    energy: number
    @Column({ type: 'float' })
    cost: number
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    time: any;
    @Column({ nullable: true })
    c_id: number

    @ManyToOne(() => CitizenEntity, citizen => citizen.daily_en_costs, { onDelete: "CASCADE" })
    @JoinColumn({ name: 'c_id' })
    citizen: CitizenEntity
}