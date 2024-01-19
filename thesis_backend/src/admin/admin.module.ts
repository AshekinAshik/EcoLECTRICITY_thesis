import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { DatabaseModule } from "src/database/database.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DailyEnergyCostEntity, EnergyCostEntity, UsageLOGEntity } from "src/database/database.entity";
import { AdminEntity } from "./admin.entity";
import { CitizenEntity } from "src/citizen/citizen.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UsageLOGEntity, AdminEntity, CitizenEntity, EnergyCostEntity, DailyEnergyCostEntity])],
    controllers: [AdminController],
    providers: [AdminService]
})

export class AdminModule { }