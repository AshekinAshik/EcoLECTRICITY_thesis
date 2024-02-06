import { Module } from "@nestjs/common";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";
import { DatabaseModule } from "src/database/database.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DailyEnergyCostEntity, EnergyCostEntity, UsageLOGEntity } from "src/database/database.entity";
import { AdminEntity } from "./admin.entity";
import { CitizenEntity } from "src/citizen/citizen.entity";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [TypeOrmModule.forFeature([UsageLOGEntity, AdminEntity, CitizenEntity, EnergyCostEntity, DailyEnergyCostEntity]), MailerModule.forRoot(
        {
            transport: {
                host: 'smtp.gmail.com',
                port: 465,
                ignoreTLS: true,
                secure: true,
                auth: {
                    user: 'ashekin.ashik@gmail.com',
                    pass: 'szmjagdwtejciwrg'
                }
            }
        }
    )],
    controllers: [AdminController],
    providers: [AdminService]
})

export class AdminModule { }