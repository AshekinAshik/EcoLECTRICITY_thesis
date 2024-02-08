import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DailyEnergyCostEntity, EnergyCostEntity, UsageLOGEntity } from "./database.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UsageLOGEntity, EnergyCostEntity, DailyEnergyCostEntity])],
    controllers: [],
    providers: [],
})

export class DatabaseModule { };