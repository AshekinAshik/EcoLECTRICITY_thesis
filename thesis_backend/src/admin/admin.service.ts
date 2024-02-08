import { Injectable } from "@nestjs/common";
import { AdminLoginDTO, AdminMessageDTO, AdminRegDTO, EnergyCostDTO, TotalDailyEnergyCostDTO } from "./admin.dto";
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
        private energycost_Repo: Repository<EnergyCostEntity>,
        @InjectRepository(DailyEnergyCostEntity)
        private daily_energycost_Repo: Repository<DailyEnergyCostEntity>,

        private readonly mailerService: MailerService

        // private readonly configService: ConfigService,
    ) {
        // const accountSid = configService.get('TWILIO_ACCOUNT_SID');
        // const authToken = configService.get('TWILIO_AUTH_TOKEN');

        // this.twilioClient = new Twilio(accountSid, authToken);
    }

    //testing API call
    checkMessage(): any {
        return "Getting Message!"
    }

    //Admin Registration
    async regAdmin(adminRegInfo: AdminRegDTO): Promise<AdminEntity> {
        const salt = await bcrypt.genSalt();
        adminRegInfo.password = await bcrypt.hash(adminRegInfo.password, salt);

        console.log("Admin Registration Info Inserted into Admin Table")
        return this.adminRepo.save(adminRegInfo);
    }

    //Admin Login
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

    //Real-time Usage of Citizen by ID
    async getRealTimeUsageDataByCitizenID(c_id: number, adminUsername: string) {
        const currentDate = new Date().toISOString().slice(0, 10) //YYYY-MM-DD in string type
        console.log("RealTimeUsageData from Admin - Current Date: " + typeof currentDate + " " + currentDate)

        const realTimeUsageData = await this.usageRepo.find({
            where: {
                c_id: c_id,
                time: Like(`%${currentDate}%`),
            },
        })
        console.log("Total Number of Usage Data From Current Date in Usage_Log table: ", realTimeUsageData.length)

        if (realTimeUsageData.length > 0) {
            return realTimeUsageData
        } else {
            return "No Usage Data from Current Date in Usage_Log table"
        }
    }

    calculateRealTimeEnergyCost(latestUsageData: UsageLOGEntity, citizen_id: number): EnergyCostDTO {
        const energyCost = new EnergyCostDTO()
        const timeHour = 10 / 3600

        energyCost.energy = Number(((latestUsageData.power / 1000) * timeHour).toFixed(4))
        console.log("Energy: ", energyCost.energy)

        const randomDecimal = Math.random()
        let randomCost = 4.6 + randomDecimal * (6.7 - 4.6)

        energyCost.cost = Number((energyCost.energy * randomCost).toFixed(4))
        console.log("Cost: ", energyCost.cost)

        energyCost.c_id = citizen_id

        return energyCost
    }

    //Real-time Energy and Cost of Citizen by ID
    async getRealTimeEnergyCostByCitizenID(c_id: number, adminUsername: string) {
        const currentDate = new Date().toISOString().slice(0, 10) //YYYY-MM-DD in string type
        // console.log("RealTimeEnergyCostData from Admin - Current Date: " + typeof currentDate + " " + currentDate)

        const latestUsageData = await this.usageRepo.findOne({
            where: { c_id: c_id, time: Like(`%${currentDate}%`) },
            order: { time: 'DESC' },
        });
        console.log("Latest Usage log_id: " + latestUsageData.id)

        if (!latestUsageData) {
            console.log("No Usage Data from Current Date")
        } else {
            const energyCost = this.calculateRealTimeEnergyCost(latestUsageData, c_id);
            console.log("Calculating Energy_Cost of Usage log_id: " + latestUsageData.id)

            console.log("Inserting Values into Energy_Cost Table")
            await this.energycost_Repo.save(energyCost)
        }

        const realtime_energycost_Data = await this.energycost_Repo.find({
            where: {
                c_id: c_id,
                time: Like(`%${currentDate}%`),
            },
        });

        return realtime_energycost_Data.length > 0 ? realtime_energycost_Data : "No Energy_Cost Data from Current Date"
    }

    //List of All Citizens' ID and Name
    getCitizens() {
        console.log("Sending All Citizen ID and Name to Admin")

        return this.citizenRepo.query('SELECT c_id, name FROM citizen')
    }

    //Get Searched Citizen by ID
    getCitizenByID(c_id: number, adminUsername: string) {
        return this.citizenRepo.query('SELECT * FROM citizen WHERE c_id=' + c_id)
    }

    //Get Citizen Data by ID
    getCitizenProfileByID(c_id: number, adminUsername: string) {
        return this.citizenRepo.findOneBy({ id: c_id })
    }

    //Delete Citizend by ID
    deleteCitizenByID(c_id: number, adminUsername: string) {
        return this.citizenRepo.delete(c_id)
    }

    // getCostByCitizenID(c_id: number, adminUsername: string) {
    //     const res = this.getRealTimeUsageDataByCitizenID(c_id, adminUsername)

    //     return typeof (res)
    // }

    // calculateEnergy(power: number) {
    //     const power_kW = power / 1000
    //     const time_hour = 10 / 3600

    //     let calculatedEnergy = power_kW * time_hour
    //     calculatedEnergy = Number(calculatedEnergy.toFixed(4))

    //     return calculatedEnergy
    // }

    // calculateCost(calculatedEnergy: number) {
    //     const randomDecimal = Math.random()
    //     let randomCost = 4.6 + randomDecimal * (6.7 - 4.6)

    //     let calculatedCost = calculatedEnergy * randomCost
    //     calculatedCost = Number(calculatedCost.toFixed(4))

    //     return calculatedCost
    // }

    // async getCalculatedAndSavedEnergy_Cost(c_id: number, adminUsername: string) {
    //     const usageLogs = await this.usageRepo.query('SELECT power FROM usage_log where c_id=' + c_id)

    //     const now = new Date()
    //     const currentDate = now.toISOString().slice(0, 10)
    //     // console.log(currentDate)
    //     // console.log(typeof currentDate)

    //     // const hasEntryForCurrentDate = await this.energycost_Repo.findOne({
    //     //     where: { c_id: c_id, time: currentDate },
    //     // });
    //     const hasEntryForCurrentDate = await this.energycost_Repo.exist({
    //         where: {
    //             time: Like(`%${currentDate}%`), // Check for date part in time column
    //         },
    //     });
    //     // console.log(hasEntryForCurrentDate)

    //     if (!hasEntryForCurrentDate) {
    //         for (const usageLog of usageLogs) {
    //             const calculatedEnergy = this.calculateEnergy(usageLog.power)
    //             const calculatedCost = this.calculateCost(calculatedEnergy)

    //             const energyCost = new EnergyCostEntity()
    //             energyCost.c_id = c_id
    //             energyCost.energy = calculatedEnergy
    //             energyCost.cost = calculatedCost

    //             console.log("inserting into energycost")
    //             await this.energycost_Repo.save(energyCost)
    //         }
    //     } else {
    //         console.log("not inserting into energycost")
    //         return false
    //     }
    // }

    calculateDailyEnergy_Cost(realtime_energycost_currentDate: any, citizen_id: number) {
        let totalDailyEnergy = 0
        let totalDailyCost = 0
        for (const obj of realtime_energycost_currentDate) {
            totalDailyEnergy += obj.energy //energy in kWh
            totalDailyCost += obj.cost
        }

        const totalDailyEnergyCost = new TotalDailyEnergyCostDTO()
        totalDailyEnergyCost.energy = totalDailyEnergy
        totalDailyEnergyCost.cost = totalDailyCost

        console.log("Total Daily Energy: ", totalDailyEnergyCost.energy)
        console.log("Total Daily Cost: ", totalDailyEnergyCost.cost)

        totalDailyEnergyCost.c_id = citizen_id

        return totalDailyEnergyCost
    }

    //Daily Total Energy and Cost of Citizen by ID
    async getDailyEnergyAndCostDataByCitizenID(c_id: number, adminUsername: string) {
        const currentDate = new Date().toISOString().slice(0, 10) //YYYY-MM-DD in string type
        // console.log("DailyEnergyCost from Admin - Current Date: " + typeof currentDate + " " + currentDate)

        const hasEntryForCurrentDate = await this.daily_energycost_Repo.exist({
            where: {
                c_id: c_id,
                time: Like(`%${currentDate}%`),
            },
        })
        console.log("Entry of Current Date in Daily_Energy_Cost table: ", hasEntryForCurrentDate)

        if (!hasEntryForCurrentDate) {
            const realtime_energycost_currentDate = await this.energycost_Repo.find({
                where: {
                    c_id: c_id,
                    time: Like(`%${currentDate}%`),
                },
            })

            const totalDailyEnergyCost = this.calculateDailyEnergy_Cost(realtime_energycost_currentDate, c_id)

            console.log("Inserting Values into Daily_Energy_Cost Table")
            await this.daily_energycost_Repo.save(totalDailyEnergyCost)
        } else {
            // console.log("Not Inserting Values into Daily_Energy_Cost Table")
            // const daily_energycost_currentDate = await this.daily_energycost_Repo.find({
            //     where: {
            //         c_id: citizen.id,
            //         time: Like(`%${currentDate}%`)
            //     }
            // })

            // const daily_energycost_currentDate = await this.daily_energycost_Repo.findOneBy({ time: Like(`%${currentDate}%`)})
            // console.log("Daily Energy Cost Data from Current Date: ", daily_energycost_currentDate)

            const realtime_energycost_currentDate = await this.energycost_Repo.find({
                where: {
                    c_id: c_id,
                    time: Like(`%${currentDate}%`), // Check for date part in time column
                },
            })

            const totalDailyEnergyCost = this.calculateDailyEnergy_Cost(realtime_energycost_currentDate, c_id)

            console.log("Updating Values into Daily_Energy_Cost Table")
            await this.daily_energycost_Repo.query(`UPDATE daily_energy_cost SET energy=${totalDailyEnergyCost.energy}, cost=${totalDailyEnergyCost.cost} WHERE time LIKE '${currentDate}%'`)
        }

        return this.daily_energycost_Repo.query(`SELECT * FROM daily_energy_cost WHERE c_id=${c_id} ORDER BY time DESC`)
    }

    //Send Mail to Citizen
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

    // async getUsageData() {
    //     console.log("sending all usage data to admin")

    //     return this.usageRepo.query('SELECT log_id, power, current, voltage, time, c_id FROM usage_log')
    // }

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