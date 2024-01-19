import { Injectable } from "@nestjs/common";
import { CitizenLoginDTO, CitizenRegDTO } from "./citizen.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DailyEnergyCostEntity, EnergyCostEntity, UsageLOGEntity } from "src/database/database.entity";
import { Like, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { CitizenEntity } from "./citizen.entity";
import { TotalDailyEnergyCostDTO } from "src/database/database.dto";

@Injectable()
export class CitizenService {
    constructor(
        @InjectRepository(UsageLOGEntity)
        private usageRepo: Repository<UsageLOGEntity>,
        @InjectRepository(CitizenEntity)
        private citizenRepo: Repository<CitizenEntity>,
        @InjectRepository(EnergyCostEntity)
        private en_costRepo: Repository<EnergyCostEntity>,
        @InjectRepository(DailyEnergyCostEntity)
        private daily_en_costRepo: Repository<DailyEnergyCostEntity>,
    ) { }

    async regCitizen(citizenRegInfo: CitizenRegDTO) {
        const salt = await bcrypt.genSalt();
        citizenRegInfo.password = await bcrypt.hash(citizenRegInfo.password, salt);

        return this.citizenRepo.save(citizenRegInfo);
    }

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

    async getUsageData(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })
        console.log("Usage Data of Citizen: ", citizen)

        // return this.usageRepo.query('SELECT power FROM usage_log');
        return this.usageRepo.query('SELECT log_id, power, current, voltage, time, c_id FROM usage_log WHERE c_id=' + citizen.id)
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

    async getCalculatedAndSavedEnergy_Cost(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })
        const usageLogs = await this.usageRepo.query('SELECT power FROM usage_log where c_id=' + citizen.id)

        const now = new Date()
        const currentDate = now.toISOString().slice(0, 10) //YYYY-MM-DD
        // console.log(currentDate)
        // console.log(typeof currentDate)

        const hasEntryForCurrentDate = await this.en_costRepo.exist({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`), // Check for date part in time column
            },
        })
        console.log("Entry of Current Date in Energy_Cost table: ", hasEntryForCurrentDate)

        if (!hasEntryForCurrentDate) {
            for (const usageLog of usageLogs) {
                const calculatedEnergy = this.calculateEnergy(usageLog.power)
                const calculatedCost = this.calculateCost(calculatedEnergy)

                const energyCost = new EnergyCostEntity()
                energyCost.c_id = citizen.id
                energyCost.energy = calculatedEnergy
                energyCost.cost = calculatedCost

                console.log("inserting into energycost")
                await this.en_costRepo.save(energyCost)
            }
        } else {
            console.log("not inserting into energycost")
        }
        return this.en_costRepo.query('SELECT * FROM energy_cost WHERE c_id=' + citizen.id)
    }

    calculateDailyEnergy_Cost(en_costs_currentDate: any) {
        let totalDailyEnergy = 0
        let totalDailyCost = 0
        for (const obj of en_costs_currentDate) {
            totalDailyEnergy = totalDailyEnergy + obj.energy
            totalDailyCost = totalDailyCost + obj.cost
        }
        console.log("total energy by current date: ", totalDailyEnergy)
        console.log("total cost by current date: ", totalDailyCost)

        let totalDailyEnergyCost : TotalDailyEnergyCostDTO
        totalDailyEnergyCost.energy = totalDailyEnergy
        totalDailyEnergyCost.cost = totalDailyCost
        
        return totalDailyEnergyCost
    }

    async getDailyCalculatedAndSaveEnergy_Cost(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })
        // const realtime_en_costs = await this.en_costRepo.query('SELECT * FROM energy_cost where c_id=' + citizen.id)

        const now = new Date()
        const currentDate = now.toISOString().slice(0, 10) //YYYY-MM-DD
        // console.log(currentDate)
        // console.log(typeof currentDate)

        const en_costs_currentDate = await this.en_costRepo.find({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`), // Check for date part in time column
            },
        })

        let totalDailyEnergyCost = this.calculateDailyEnergy_Cost(en_costs_currentDate)
        totalDailyEnergyCost.c_id = citizen.id

        await this.daily_en_costRepo.save(totalDailyEnergyCost)

        // console.log(en_costs_currentDate)
        // return en_costs_currentDate
    }
}