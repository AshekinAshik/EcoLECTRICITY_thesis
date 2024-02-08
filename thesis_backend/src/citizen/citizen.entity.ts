import { DailyEnergyCostEntity, EnergyCostEntity, UsageLOGEntity } from "src/database/database.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('citizen')
export class CitizenEntity {
    @PrimaryGeneratedColumn({ name: 'c_id' })
    id: number
    @Column({ length: 150 })
    name: string;
    @Column()
    email: string;
    @Column()
    contact: number;
    @Column()
    location: string;
    @Column()
    password: string;

    @OneToMany(() => UsageLOGEntity, usagelog => usagelog.citizen, { cascade: ["remove"] })
    usagelogs: UsageLOGEntity[]

    @OneToMany(() => EnergyCostEntity, en_cost => en_cost.citizen, { cascade: ["remove"] })
    en_costs: EnergyCostEntity[]

    @OneToMany(() => DailyEnergyCostEntity, daily_en_cost => daily_en_cost.citizen, { cascade: ["remove"] })
    daily_en_costs: EnergyCostEntity[]
}