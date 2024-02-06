import { Injectable } from "@nestjs/common";
import { AdminLoginDTO, AdminMessageDTO, AdminRegDTO } from "./admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DailyEnergyCostEntity, EnergyCostEntity, UsageLOGEntity } from "src/database/database.entity";
import { Like, Repository } from "typeorm";
import { AdminEntity } from "./admin.entity";
import * as bcrypt from 'bcrypt';
import { CitizenEntity } from "src/citizen/citizen.entity";
import { DatabaseDTO } from "src/database/database.dto";
import { MailerService } from "@nestjs-modules/mailer/dist";
// import { ConfigService } from "@nestjs/config";
// import { Twilio } from "twilio";

@Injectable()
export class AdminService {
    // private twilioClient: Twilio

    constructor(
        @InjectRepository(UsageLOGEntity)
        private usageRepo: Repository<UsageLOGEntity>,
        @InjectRepository(AdminEntity)
        private adminRepo: Repository<AdminEntity>,
        @InjectRepository(CitizenEntity)
        private citizenRepo: Repository<CitizenEntity>,
        @InjectRepository(EnergyCostEntity)
        private en_costRepo: Repository<EnergyCostEntity>,
        @InjectRepository(DailyEnergyCostEntity)
        private daily_en_costRepo: Repository<DailyEnergyCostEntity>,

        private readonly mailerService: MailerService

        // private readonly configService: ConfigService,
    ) {
        // const accountSid = configService.get('TWILIO_ACCOUNT_SID');
        // const authToken = configService.get('TWILIO_AUTH_TOKEN');

        // this.twilioClient = new Twilio(accountSid, authToken);
    }

    checkMessage(): any {
        return "Getting Message!"
    }

    async regAdmin(adminRegInfo: AdminRegDTO): Promise<AdminEntity> {
        const salt = await bcrypt.genSalt();
        adminRegInfo.password = await bcrypt.hash(adminRegInfo.password, salt);

        console.log("Admin Registration Info Inserted into Admin Table")
        return this.adminRepo.save(adminRegInfo);
    }

    async loginAdmin(adminLoginInfo: AdminLoginDTO) {
        const admin = await this.adminRepo.findOneBy({ username: adminLoginInfo.username });
        if (admin != null) {
            const isMatch: boolean = await bcrypt.compare(adminLoginInfo.password, admin.password);
            console.log("Admin Login Password Check: ", isMatch);
            return isMatch;
        } else {
            return false;
        }
    }

    // async getUsagePowerData () : Promise<UsageLOGEntity[]> {
    async getUsageData() {
        console.log("sending all usage data to admin")

        // return this.usageRepo.query('SELECT power FROM usage_log');
        return this.usageRepo.query('SELECT log_id, power, current, voltage, time, c_id FROM usage_log')
    }

    async getUsageDataByCitizenID(c_id: number, adminUsername: string) {
        // return this.usageRepo.findOneBy({id: c_id})
        // return this.usageRepo.query('SELECT user_id, power, current, voltage, time FROM usage_log WHERE user_id='+c_id)

        // const citizen = await this.citizenRepo.findOneBy({ id: c_id })

        // return this.usageRepo.find(
        //     {
        //         where: { c_id: c_id },
        //         relations: { citizen: true }
        //     }
        // )

        const currentDate = new Date().toISOString().slice(0, 10) //YYYY-MM-DD in string type
        console.log("RealTimeUsageData - Current Date: " + typeof currentDate + " " + currentDate)

        const realTimeUsageData = await this.usageRepo.find({
            where: {
                c_id: c_id,
                time: Like(`%${currentDate}%`), // Check for date part in time column
            },
        })
        console.log("Total Number of Usage Data From Current Date in Usage_Log table: ", realTimeUsageData.length)

        if (realTimeUsageData.length > 0) {
            return realTimeUsageData
        } else {
            return "No Usage Data from Current Date in Usage_Log table"
        }
    }

    getCitizens() {
        console.log("Sending All Citizen ID and Name to Admin")

        return this.citizenRepo.query('SELECT c_id, name FROM citizen')
    }

    getCitizenByID(c_id: number, adminUsername: string) {
        return this.citizenRepo.query('SELECT * FROM citizen WHERE c_id=' + c_id)
    }

    getCitizenProfileByID(c_id: number, adminUsername: string) {
        return this.citizenRepo.findOneBy({ id: c_id })
    }

    deleteCitizenByID(c_id: number, adminUsername: string) {
        return this.citizenRepo.delete(c_id)
    }

    getCostByCitizenID(c_id: number, adminUsername: string) {
        const res = this.getUsageDataByCitizenID(c_id, adminUsername)

        return typeof (res)
    }

    setValue(values: DatabaseDTO) {
        return this.usageRepo.save(values)
    }

    calculateEnergy(power: number) {
        const power_kW = power / 1000
        const time_hour = 10 / 3600

        let calculatedEnergy = power_kW * time_hour
        calculatedEnergy = Number(calculatedEnergy.toFixed(4))

        return calculatedEnergy
    }

    calculateCost(calculatedEnergy: number) {
        const randomDecimal = Math.random()
        let randomCost = 4.6 + randomDecimal * (6.7 - 4.6)

        let calculatedCost = calculatedEnergy * randomCost
        calculatedCost = Number(calculatedCost.toFixed(4))

        return calculatedCost
    }

    async getCalculatedAndSavedEnergy_Cost(c_id: number, adminUsername: string) {
        const usageLogs = await this.usageRepo.query('SELECT power FROM usage_log where c_id=' + c_id)

        const now = new Date()
        const currentDate = now.toISOString().slice(0, 10)
        // console.log(currentDate)
        // console.log(typeof currentDate)

        // const hasEntryForCurrentDate = await this.en_costRepo.findOne({
        //     where: { c_id: c_id, time: currentDate },
        // });
        const hasEntryForCurrentDate = await this.en_costRepo.exist({
            where: {
                time: Like(`%${currentDate}%`), // Check for date part in time column
            },
        });
        // console.log(hasEntryForCurrentDate)

        if (!hasEntryForCurrentDate) {
            for (const usageLog of usageLogs) {
                const calculatedEnergy = this.calculateEnergy(usageLog.power)
                const calculatedCost = this.calculateCost(calculatedEnergy)

                const energyCost = new EnergyCostEntity()
                energyCost.c_id = c_id
                energyCost.energy = calculatedEnergy
                energyCost.cost = calculatedCost

                console.log("inserting into energycost")
                await this.en_costRepo.save(energyCost)
            }
        } else {
            console.log("not inserting into energycost")
            return false
        }
    }

    async sendMailToCitizen(messageInfo: AdminMessageDTO, adminUsername: string) {
        const admin = await this.adminRepo.findOneBy({ username: adminUsername });

        await this.mailerService.sendMail(
            {
                to: messageInfo.receiver,
                subject: "EcoLECTRICITY: " + messageInfo.subject,
                text: messageInfo.message,
            }
        );
    }

    // async sendOTP(phoneNumber: string) {
    //     const serviceSid = this.configService.get(
    //         'TWILIO_VERIFICATION_SERVICE_SID',
    //     );
    //     let msg = '';
    //     await this.twilioClient.verify.v2
    //         .services(serviceSid)
    //         .verifications.create({ to: phoneNumber, channel: 'sms' })
    //         .then((verification) => (msg = verification.status));
    //     return { msg: msg };
    // }
    // async verifyOTP(phoneNumber: string, code: string) {
    //     const serviceSid = this.configService.get(
    //         'TWILIO_VERIFICATION_SERVICE_SID',
    //     );
    //     let msg = '';
    //     await this.twilioClient.verify.v2
    //         .services(serviceSid)
    //         .verificationChecks.create({ to: phoneNumber, code: code })
    //         .then((verification) => (msg = verification.status));
    //     return { msg: msg };
    // }


}