import { Injectable } from "@nestjs/common";
import { CitizenLoginDTO, CitizenRegDTO } from "./citizen.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { UsageLOGEntity } from "src/database/database.entity";
import { Repository } from "typeorm";
import * as bcrypt from 'bcrypt';
import { CitizenEntity } from "./citizen.entity";

@Injectable()
export class CitizenService {
    constructor(
        @InjectRepository(UsageLOGEntity)
        private usageRepo: Repository<UsageLOGEntity>,
        @InjectRepository(CitizenEntity)
        private citizenRepo: Repository<CitizenEntity>,
    ) {}

    async regCitizen(citizenRegInfo:CitizenRegDTO) {
        const salt = await bcrypt.genSalt();
        citizenRegInfo.password = await bcrypt.hash(citizenRegInfo.password, salt);

        return this.citizenRepo.save(citizenRegInfo);
    }

    async loginCitizen(citizenLogInfo: CitizenLoginDTO) {
        const citizen = await this.citizenRepo.findOneBy({ contact: citizenLogInfo.contact });
        if (citizen != null) {
            const isMatch: boolean = await bcrypt.compare(citizenLogInfo.password, citizen.password);
            console.log(isMatch);
            return isMatch;
        } else {
            return false;
        }
    }

    async getUsageData(contact:number) {
        console.log("sending all usage data to citizen")

        const citizen = await this.citizenRepo.findOneBy({contact:contact})
        console.log(citizen)

        // return this.usageRepo.query('SELECT power FROM usage_log');
        return this.usageRepo.query('SELECT log_id, power, current, voltage, time, c_id FROM usage_log WHERE c_id='+citizen.id)
    }
}