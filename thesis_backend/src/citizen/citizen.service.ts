import { Injectable } from "@nestjs/common";
import { CitizenLoginDTO, CitizenRegDTO } from "./citizen.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { DailyEnergyCostEntity, EnergyCostEntity, UsageLOGEntity } from "src/database/database.entity";
import { Like, Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { CitizenEntity } from "./citizen.entity";
import { EnergyCostDTO, TotalDailyEnergyCostDTO } from "src/database/database.dto";

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

    //Citizen Real-Time Usage Data
    async getUsageData(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })

        // return this.usageRepo.query('SELECT power FROM usage_log');
        return this.usageRepo.query('SELECT log_id, power, current, voltage, time, c_id FROM usage_log WHERE c_id=' + citizen.id)
    }


    //Citizen Real-Time Energy-Cost Data
    // calculateEnergy(power: number) {
    //     const power_kW = power / 1000
    //     const time_hour = 10 / 3600

    //     let calculatedEnergy = power_kW * time_hour //energy in kWh
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

    calculateEnergy_Cost(power: number) {
        const energyCost = new EnergyCostDTO()
        const power_kW = power / 1000
        const time_hour = 10 / 3600 //for every 10 sec

        let calculatedEnergy = power_kW * time_hour //energy in kWh
        energyCost.energy = Number(calculatedEnergy.toFixed(4))

        const randomDecimal = Math.random()
        let randomCost = 4.6 + randomDecimal * (6.7 - 4.6)

        const calculatedCost = energyCost.energy * randomCost
        energyCost.cost = Number(calculatedCost.toFixed(4))

        return energyCost
    }

    async getCalculatedAndSavedEnergy_Cost(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })
        const usageLogs = await this.usageRepo.query('SELECT power FROM usage_log where c_id=' + citizen.id)

        const now = new Date()
        const currentDate = now.toISOString().slice(0, 10) //YYYY-MM-DD

        const hasEntryForCurrentDate = await this.en_costRepo.exist({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`), // Check for date part in time column
            },
        })
        console.log("Entry of Current Date in Energy_Cost table: ", hasEntryForCurrentDate)

        if (!hasEntryForCurrentDate) {
            let count = 0
            const energyCosts: EnergyCostDTO[] = new Array<EnergyCostDTO>
            for (const usageLog of usageLogs) {
                // const calculatedEnergy = this.calculateEnergy(usageLog.power)
                // const calculatedCost = this.calculateCost(calculatedEnergy)

                // const energyCost = new EnergyCostEntity()
                // energyCost.c_id = citizen.id
                // energyCost.energy = calculatedEnergy
                // energyCost.cost = calculatedCost

                // console.log("Inserting Values into Energy_Cost Table")
                // await this.en_costRepo.save(energyCost)

                energyCosts[count] = this.calculateEnergy_Cost(usageLog.power)
                energyCosts[count].c_id = citizen.id
                count++
            }
            console.log("Inserting Values into Energy_Cost Table")
            await this.en_costRepo.save(energyCosts)
        } else {
            console.log("Not Inserting Values into Energy_Cost Table")
        }

        return this.en_costRepo.query('SELECT * FROM energy_cost WHERE c_id=' + citizen.id)
    }


    //Citizen Daily Energy-Cost Data
    calculateDailyEnergy_Cost(en_costs_currentDate: any) {
        let totalDailyEnergy = 0
        let totalDailyCost = 0
        for (const obj of en_costs_currentDate) {
            totalDailyEnergy = totalDailyEnergy + obj.energy //energy in kWh
            totalDailyCost = totalDailyCost + obj.cost
        }

        const totalDailyEnergyCost = new TotalDailyEnergyCostDTO()
        totalDailyEnergyCost.energy = totalDailyEnergy
        totalDailyEnergyCost.cost = totalDailyCost

        console.log("Total Daily Energy: ", totalDailyEnergyCost.energy)
        console.log("Total Daily Cost: ", totalDailyEnergyCost.cost)

        return totalDailyEnergyCost
    }

    async getDailyCalculatedAndSaveEnergy_Cost(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })

        const now = new Date()
        const currentDate = now.toISOString().slice(0, 10) //YYYY-MM-DD

        const hasEntryForCurrentDate = await this.daily_en_costRepo.exist({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`), // Check for date part in time column
            },
        })
        console.log("Entry of Current Date in Daily_Energy_Cost table: ", hasEntryForCurrentDate)

        if (!hasEntryForCurrentDate) {
            const en_costs_currentDate = await this.en_costRepo.find({
                where: {
                    c_id: citizen.id,
                    time: Like(`%${currentDate}%`), // Check for date part in time column
                },
            })

            const totalDailyEnergyCost = this.calculateDailyEnergy_Cost(en_costs_currentDate)
            totalDailyEnergyCost.c_id = citizen.id

            console.log("Inserting Values into Daily_Energy_Cost Table")
            await this.daily_en_costRepo.save(totalDailyEnergyCost)
        } else {
            console.log("Not Inserting Values into Energy_Cost Table")
        }

        return this.daily_en_costRepo.query('SELECT * FROM daily_energy_cost WHERE c_id=' + citizen.id)
    }
}