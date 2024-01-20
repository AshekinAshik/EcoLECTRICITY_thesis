import { Body, Controller, Post, UsePipes, ValidationPipe, Session, NotFoundException, Get, ParseIntPipe, Param } from "@nestjs/common";
import { CitizenService } from "./citizen.service";
import { CitizenLoginDTO, CitizenRegDTO } from "./citizen.dto";
import session = require("express-session");

@Controller('citizen')
export class CitizenController {
    constructor(private readonly citizenService: CitizenService) { }

    @Post('register')
    @UsePipes(new ValidationPipe())
    regCitizen(@Body() citizenRegInfo: CitizenRegDTO): any {
        console.log(citizenRegInfo)

        this.citizenService.regCitizen(citizenRegInfo)
        return "Citizen Registration Successful!"
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async loginCitizen(@Body() citizenLogInfo: CitizenLoginDTO, @Session() session) {
        console.log("Citizen Login Credentials: ", citizenLogInfo)

        const result = await this.citizenService.loginCitizen(citizenLogInfo)

        if (result) {
            session.contact = citizenLogInfo.contact
            console.log("Citizen Login Session Contact: " + session.contact)

            return "Citizen Login Successful!"
        } else {
            return new NotFoundException({ message: "Citizen Not Found!" })
        }
    }

    @Get('dashboard')
    getUsageData(@Session() session): any {
        // const now = new Date();
        // const dateObj = new Date();
        // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // const day = ('0' + dateObj.getDate()).slice(-2);
        // const month = months[dateObj.getMonth()];
        // const year = dateObj.getFullYear();
        // console.log(`${day} ${month} ${year}`)

        return this.citizenService.getUsageData(session.contact);
    }

    @Get('energy_cost')
    getEnergyAndCost(@Session() session) {
        // const res = await this.citizenService.getCalculatedAndSavedEnergy_Cost(session.contact)
        //return res

        // if (res) {
        //     return res
        // } else {
        //     return "Today's Energy-Cost is already uploaded!"
        // }

        return this.citizenService.getCalculatedAndSavedEnergy_Cost(session.contact)
    }

    @Get('daily_energy_cost')
    getDailyEnergyAndCost(@Session() session): any {
        // const res = await this.citizenService.getDailyCalculatedAndSaveEnergy_Cost(session.contact)

        // if (res) {
        //     return res
        // } else {
        //     return "Today's Energy-Cost is already uploaded!"
        // }

        return this.citizenService.getDailyCalculatedAndSaveEnergy_Cost(session.contact)
    }
}