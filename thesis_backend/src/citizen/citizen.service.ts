import { Injectable } from "@nestjs/common";
import { CitizenLoginDTO, CitizenRegDTO } from "./citizen.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DailyEnergyCostEntity, EnergyCostEntity, UsageLOGEntity } from "src/database/database.entity";
import { Like, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { CitizenEntity } from "./citizen.entity";
import { EnergyCostDTO, TotalDailyEnergyCostDTO } from "src/database/database.dto";
import { MailerService } from "@nestjs-modules/mailer/dist";

@Injectable()
export class CitizenService {
    constructor(
        @InjectRepository(UsageLOGEntity)
        private usageRepo: Repository<UsageLOGEntity>,
        @InjectRepository(CitizenEntity)
        private citizenRepo: Repository<CitizenEntity>,
        @InjectRepository(EnergyCostEntity)
        private energycost_Repo: Repository<EnergyCostEntity>,
        @InjectRepository(DailyEnergyCostEntity)
        private daily_energycost_Repo: Repository<DailyEnergyCostEntity>,

        private readonly mailerService: MailerService
    ) { }

    //Citizen Registration
    async regCitizen(citizenRegInfo: CitizenRegDTO) {
        const salt = await bcrypt.genSalt();
        citizenRegInfo.password = await bcrypt.hash(citizenRegInfo.password, salt);

        return this.citizenRepo.save(citizenRegInfo);
    }

    //Citizen Login
    async loginCitizen(citizenLogInfo: CitizenLoginDTO) {
        const citizen = await this.citizenRepo.findOneBy({ contact: citizenLogInfo.contact });
        if (citizen != null) {
            const isMatch: boolean = await bcrypt.compare(citizenLogInfo.password, citizen.password);
            console.log("Citizen Login Password Match: ", isMatch);
            return isMatch;
        } else {
            return false;
        }
    }

    //Citizen All Usage Data
    async getAllUsage(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })

        return this.usageRepo.query('SELECT * FROM usage_log WHERE c_id=' + citizen.id)
    }

    //Real-Time Usage of Citizen
    async getRealTimeUsageData(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })

        const currentDate = new Date().toISOString().slice(0, 10) //YYYY-MM-DD in string type
        // console.log("RealTimeUsageData from Citizen - Current Date: " + typeof currentDate + " " + currentDate)

        const realTimeUsageData = await this.usageRepo.find({
            where: {
                c_id: citizen.id,
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

    //Real-time Energy and Cost of Citizen
    async getRealTimeEnergyCostData(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })

        const currentDate = new Date().toISOString().slice(0, 10) //YYYY-MM-DD in string type
        console.log("RealTimeEnergyCostData - Current Date: " + typeof currentDate + " " + currentDate)

        //retrieving the latest Usage data inserted in Current Date
        const latestUsageData = await this.usageRepo.findOne({
            where: { c_id: citizen.id, time: Like(`%${currentDate}%`) },
            order: { time: 'DESC' },
        });
        console.log("Latest Usage log_id: " + latestUsageData.id)

        if (!latestUsageData) {
            console.log("No Usage Data from Current Date")
        } else {
            const energyCost = this.calculateRealTimeEnergyCost(latestUsageData, citizen.id)
            console.log("Calculating Energy_Cost of Usage log_id: " + latestUsageData.id)

            console.log("Inserting Values into Energy_Cost Table")
            await this.energycost_Repo.save(energyCost)
        }

        const realtime_energycost_Data = await this.energycost_Repo.find({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`),
            },
        });

        return realtime_energycost_Data.length > 0 ? realtime_energycost_Data : "No Energy_Cost Data from Current Date"
    }

    //Usage of Citizen by Date
    async getUsageByDate(contact: number, date: string) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })
        const usageByDate = await this.usageRepo.find({
            where: {
                c_id: citizen.id,
                time: Like(`%${date}%`),
            },
        })

        return usageByDate.length > 0 ? usageByDate : "No Usage Data from Searched Date"
    }

    //Energy and Cost of Citizen by Date
    async getEnergyCostByDate(contact: number, date: string) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })
        const energy_costByDate = await this.energycost_Repo.find({
            where: {
                c_id: citizen.id,
                time: Like(`%${date}%`),
            },
        })

        return energy_costByDate.length > 0 ? energy_costByDate : "No Energy_Cost Data from Searched Date"
    }

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

    //Daily Total Energy and Cost of Citizen
    async getDailyEnergyCostData(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })

        const now = new Date()
        const currentDate = now.toISOString().slice(0, 10) //YYYY-MM-DD in string type
        console.log("DailyEnergyCost from Citizen - Current Date: " + typeof currentDate + " " + currentDate)

        const hasEntryForCurrentDate = await this.daily_energycost_Repo.exist({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`),
            },
        })
        console.log("Entry of Current Date in Daily_Energy_Cost table: ", hasEntryForCurrentDate)

        if (!hasEntryForCurrentDate) {
            const realtime_energycost_currentDate = await this.energycost_Repo.find({
                where: {
                    c_id: citizen.id,
                    time: Like(`%${currentDate}%`),
                },
            })

            const totalDailyEnergyCost = this.calculateDailyEnergy_Cost(realtime_energycost_currentDate, citizen.id)

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
                    c_id: citizen.id,
                    time: Like(`%${currentDate}%`),
                },
            })

            const totalDailyEnergyCost = this.calculateDailyEnergy_Cost(realtime_energycost_currentDate, citizen.id)

            console.log("Updating Values into Daily_Energy_Cost Table")
            await this.daily_energycost_Repo.query(`UPDATE daily_energy_cost SET energy=${totalDailyEnergyCost.energy}, cost=${totalDailyEnergyCost.cost} WHERE time LIKE '${currentDate}%'`)
        }

        return this.daily_energycost_Repo.query(`SELECT * FROM daily_energy_cost WHERE c_id=${citizen.id} ORDER BY time DESC`)
    }

    async sendOTPToCitizen(contact: number, otp: string) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact });

        await this.mailerService.sendMail(
            {
                to: citizen.email,
                subject: "EcoLECTRICITY: OTP for Login",
                text: "Your login 6-digit OTP is: " + otp,
            }
        );
    }

    //Generate 6-digit OTP
    async getGeneratedOTP(contact: number) {
        let otp = ""
        otp += Math.floor(Math.random() * 9) + 1
        for (let i = 1; i < 6; i++) {
            otp += Math.floor(Math.random() * 10)
        }

        const response_sendOTP = this.sendOTPToCitizen(contact, otp)

        return otp
    }
}