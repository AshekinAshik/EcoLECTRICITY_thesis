import { Module } from "@nestjs/common";
import { CitizenController } from "./citizen.controller";
import { CitizenService } from "./citizen.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CitizenEntity } from "./citizen.entity";
import { UsageLOGEntity } from "src/database/database.entity";

@Module({
    imports: [TypeOrmModule.forFeature([CitizenEntity, UsageLOGEntity])],
    controllers: [CitizenController],
    providers: [CitizenService]
})

export class CitizenModule {}