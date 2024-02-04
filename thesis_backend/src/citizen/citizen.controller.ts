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
    getAllUsageData(@Session() session): any {
        // const now = new Date();
        // const dateObj = new Date();
        // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // const day = ('0' + dateObj.getDate()).slice(-2);
        // const month = months[dateObj.getMonth()];
        // const year = dateObj.getFullYear();
        // console.log(`${day} ${month} ${year}`)

        return this.citizenService.getAllUsage(session.contact);
    }

    @Get('realtime_usage')
    getRealTimeUsageData(@Session() session): any {
        // const now = new Date();
        // const dateObj = new Date();
        // const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        // const day = ('0' + dateObj.getDate()).slice(-2);
        // const month = months[dateObj.getMonth()];
        // const year = dateObj.getFullYear();
        // console.log(`${day} ${month} ${year}`)

        return this.citizenService.getRealTimeUsageData(session.contact);
    }


    @Get('realtime_energy_cost')
    getRealTimeEnergyAndCostData(@Session() session) {
        // const res = await this.citizenService.getCalculatedAndSavedEnergy_Cost(session.contact)
        //return res    

        // if (res) {
        //     return res
        // } else {
        //     return "Today's Energy-Cost is already uploaded!"
        // }

        return this.citizenService.getRealTimeEnergyCostData_v3(session.contact)
    }

    @Get('usage/:date')
    getUsageByDate(@Param('date') date: any, @Session() session) {
        // const res = await this.citizenService.getCalculatedAndSavedEnergy_Cost(session.contact)
        //return res

        // if (res) {
        //     return res
        // } else {
        //     return "Today's Energy-Cost is already uploaded!"
        // }

        return this.citizenService.getUsageByDate(session.contact, date)
    }

    @Get('energy_cost/:date')
    getEnergyCostByDate(@Param('date') date: any, @Session() session) {
        // const res = await this.citizenService.getCalculatedAndSavedEnergy_Cost(session.contact)
        //return res

        // if (res) {
        //     return res
        // } else {
        //     return "Today's Energy-Cost is already uploaded!"
        // }

        return this.citizenService.getEnergyCostByDate(session.contact, date)
    }

    @Get('daily_energy_cost')
    getDailyEnergyAndCostData(@Session() session): any {
        // const res = await this.citizenService.getDailyCalculatedAndSaveEnergy_Cost(session.contact)

        // if (res) {
        //     return res
        // } else {
        //     return "Today's Energy-Cost is already uploaded!"
        // }

        return this.citizenService.getDailyEnergyCostData(session.contact)
    }
}