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

    //Citizen All Usage Data
    async getUsage(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })

        // return this.usageRepo.query('SELECT power FROM usage_log');
        return this.usageRepo.query('SELECT log_id, power, current, voltage, time, c_id FROM usage_log WHERE c_id=' + citizen.id)
    }

    //Citizen Real-Time Usage Data
    async getRealTimeUsage(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })

        const now = new Date()
        const currentDate = now.toISOString().slice(0, 10) //YYYY-MM-DD in string type
        // console.log(currentDate)
        // console.log(typeof currentDate)

        // const hasUsageForCurrentDate = await this.usageRepo.exist({
        //     where: {
        //         c_id: citizen.id,
        //         time: Like(`%${currentDate}%`),
        //     },
        // })

        // if (hasUsageForCurrentDate) {
        //     const realTimeUsageData = await this.usageRepo.find({
        //         where: {
        //             c_id: citizen.id,
        //             time: Like(`%${currentDate}%`),
        //         },
        //     })

        //     return realTimeUsageData
        // } else {
        //     return "No Usage Data from Current Date"
        // }

        const realTimeUsageData = await this.usageRepo.find({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`), // Check for date part in time column
            },
        })
        console.log("Total Number of Usage From Current Date in Usage_Log table: ", realTimeUsageData.length)

        if (realTimeUsageData.length != 0) {
            return realTimeUsageData
        } else {
            return "No Usage Data from Current Date"
        }
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

        energyCost.energy = Number((power_kW * time_hour).toFixed(4))

        const randomDecimal = Math.random()
        let randomCost = 4.6 + randomDecimal * (6.7 - 4.6)
        energyCost.cost = Number((energyCost.energy * randomCost).toFixed(4))

        return energyCost
    }

    async getRealTimeEnergyCost(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })
        const currentDate = new Date().toISOString().slice(0, 10)

        const usageLogs = await this.usageRepo.find({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`),
            },
        })

        console.log("Total Usage Data from Current Date in Usage_Logs table: ", usageLogs.length)
        if (usageLogs.length > 0) {
            const hasEnergyCostEntryForCurrentDate = await this.en_costRepo.exist({
                where: {
                    c_id: citizen.id,
                    time: Like(`%${currentDate}%`),
                },
            })
            console.log("Entry of Current Date in Energy_Cost table: ", hasEnergyCostEntryForCurrentDate)

            if (!hasEnergyCostEntryForCurrentDate) {
                const energyCosts = usageLogs.map((usageLog) => this.calculateEnergy_Cost(usageLog.power));
                energyCosts.forEach((cost) => cost.c_id = citizen.id);

                console.log("Inserting Values into Energy_Cost Table")
                await this.en_costRepo.save(energyCosts)
            } else {
                console.log("Not Inserting Values into Energy_Cost Table")
            }
        }

        const en_costData = await this.en_costRepo.find({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`),
            },
        });

        return en_costData.length > 0 ? en_costData : "No Energy_Cost Data from Current Date"
    }

    calculateEnergy_Costtest(power: number) {
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

    async getRealTimeEnergyCosttest(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })

        const now = new Date()
        const currentDate = now.toISOString().slice(0, 10) //YYYY-MM-DD in string type
        // console.log(currentDate)
        // console.log(typeof currentDate)

        const usageLogs = await this.usageRepo.find({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`), // Check for date part in time column
            },
        })

        console.log("Total Usage Data from Current Date in Usage_Logs table: ", usageLogs.length)
        if (usageLogs.length != 0) {
            const hasEnergyCostEntryForCurrentDate = await this.en_costRepo.exist({
                where: {
                    c_id: citizen.id,
                    time: Like(`%${currentDate}%`), // Check for date part in time column
                },
            })
            console.log("Entry of Current Date in Energy_Cost table: ", hasEnergyCostEntryForCurrentDate)

            if (!hasEnergyCostEntryForCurrentDate) {
                let count = 0
                const energyCosts: EnergyCostDTO[] = new Array<EnergyCostDTO>
                for (const usageLog of usageLogs) {
                    energyCosts[count] = this.calculateEnergy_Costtest(usageLog.power)
                    energyCosts[count].c_id = citizen.id
                    count++

                    // const calculatedEnergy = this.calculateEnergy(usageLog.power)
                    // const calculatedCost = this.calculateCost(calculatedEnergy)

                    // const energyCost = new EnergyCostEntity()
                    // energyCost.c_id = citizen.id
                    // energyCost.energy = calculatedEnergy
                    // energyCost.cost = calculatedCost

                    // console.log("Inserting Values into Energy_Cost Table")
                    // await this.en_costRepo.save(energyCost)
                }
                console.log("Inserting Values into Energy_Cost Table")
                await this.en_costRepo.save(energyCosts)
            } else {
                console.log("Not Inserting Values into Energy_Cost Table")
            }
        }

        const en_costData = await this.en_costRepo.find({
            where: {
                c_id: citizen.id,
                time: Like(`%${currentDate}%`), // Check for date part in time column
            },
        })

        if (en_costData.length === 0) {
            return "No Energy_Cost Data from Current Date"
        } else {
            return en_costData
        }
        // console.log("Energy_Cost Data Status: ", en_costData)
        // console.log(typeof en_costData)
    }

    //Citizen Energy and Cost by Date
    async getEnegyCostByDate(contact: number, date: string) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })
        const energy_costByDate = await this.en_costRepo.find({
            where: {
                c_id: citizen.id,
                time: Like(`%${date}%`), // Check for date part in time column
            },
        })

        console.log(date)
        console.log(typeof date)
        return energy_costByDate
    }

    //Citizen Daily Total Energy-Cost Data
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

    async getDailyEnergyCost(contact: number) {
        const citizen = await this.citizenRepo.findOneBy({ contact: contact })

        const now = new Date()
        const currentDate = now.toISOString().slice(0, 10) //YYYY-MM-DD in string type

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
            console.log("Not Inserting Values into Daily_Energy_Cost Table")
        }

        return this.daily_en_costRepo.query('SELECT * FROM daily_energy_cost WHERE c_id=' + citizen.id)
    }
}