import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsageLOGEntity } from "./database.entity";

@Module({
    imports: [TypeOrmModule.forFeature([UsageLOGEntity])],
    controllers: [],
    providers: [],
})

export class DatabaseModule {};