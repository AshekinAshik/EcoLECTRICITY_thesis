// import { Injectable } from '@nestjs/common';

// @Injectable()
// export class AppService {
//   getHello(): string {
//     return 'Hello World!';
//   }
// }

import { Injectable } from "@nestjs/common";
import { AdminLoginDTO, AdminRegDTO } from "./admin.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UsageLOGEntity } from "src/database/database.entity";
import { Repository } from "typeorm";
import { AdminEntity } from "./admin.entity";
import * as bcrypt from 'bcrypt';
import { CitizenEntity } from "src/citizen/citizen.entity";
import { DatabaseDTO } from "src/database/database.dto";

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(UsageLOGEntity)
        private usageRepo: Repository<UsageLOGEntity>,
        @InjectRepository(AdminEntity)
        private adminRepo: Repository<AdminEntity>,
        @InjectRepository(CitizenEntity)
        private citizenRepo: Repository<CitizenEntity>,
    ) { }

    checkMessage(): any {
        return "Getting Message!"
    }

    async regAdmin(adminRegInfo: AdminRegDTO): Promise<AdminEntity> {
        console.log("status: admin.service > regAdmin")

        const salt = await bcrypt.genSalt();
        adminRegInfo.password = await bcrypt.hash(adminRegInfo.password, salt);
        console.log("status: added salt with password")

        return this.adminRepo.save(adminRegInfo);
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
        const citizen = await this.citizenRepo.findOneBy({ id: c_id })

        return this.usageRepo.find(
            {
                where: { c_id: c_id },
                relations: { citizen: true }
            }
        )
    }

    getCitizensID() {
        console.log("sending id and name of citizens to admin")

        return this.citizenRepo.query('SELECT c_id, name FROM citizen')
    }

    getCitizenByID(c_id: number, adminUsername: string) {
        return this.citizenRepo.query('SELECT * FROM citizen WHERE c_id=' + c_id)
    }

    getCostByCitizenID(c_id: number, adminUsername: string) {
        const res = this.getUsageDataByCitizenID(c_id, adminUsername)

        return typeof(res)
    }

    setValue(values: DatabaseDTO) {
        return this.usageRepo.save(values)
    }

    async loginAdmin(adminLoginInfo: AdminLoginDTO) {
        const admin = await this.adminRepo.findOneBy({ username: adminLoginInfo.username });
        if (admin != null) {
            const isMatch: boolean = await bcrypt.compare(adminLoginInfo.password, admin.password);
            console.log(isMatch);
            return isMatch;
        } else {
            return false;
        }
    }
}