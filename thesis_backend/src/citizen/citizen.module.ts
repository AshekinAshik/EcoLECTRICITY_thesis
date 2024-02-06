import { Module } from "@nestjs/common";
import { CitizenController } from "./citizen.controller";
import { CitizenService } from "./citizen.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CitizenEntity } from "./citizen.entity";
import { DailyEnergyCostEntity, EnergyCostEntity, UsageLOGEntity } from "src/database/database.entity";
import { MailerModule } from "@nestjs-modules/mailer";

@Module({
    imports: [TypeOrmModule.forFeature([CitizenEntity, UsageLOGEntity, EnergyCostEntity, DailyEnergyCostEntity]), MailerModule.forRoot(
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
    controllers: [CitizenController],
    providers: [CitizenService]
})

export class CitizenModule { }