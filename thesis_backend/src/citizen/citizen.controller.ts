import { Body, Controller, Post, UsePipes, ValidationPipe, Session, NotFoundException, Get, ParseIntPipe, Param } from "@nestjs/common";
import { CitizenService } from "./citizen.service";
import { CitizenLoginDTO, CitizenRegDTO } from "./citizen.dto";
import session = require("express-session");

@Controller('citizen')
export class CitizenController {
    constructor(private readonly citizenService: CitizenService) { }

    //Citizen Registration
    @Post('register')
    @UsePipes(new ValidationPipe())
    regCitizen(@Body() citizenRegInfo: CitizenRegDTO): any {
        console.log(citizenRegInfo)

        this.citizenService.regCitizen(citizenRegInfo)
        return "Citizen Registration Successful!"
    }

    //Citizen Login
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

    //Real-time Usage of Citizen
    @Get('realtime_usage')
    getRealTimeUsageData(@Session() session): any {
        return this.citizenService.getRealTimeUsageData(session.contact);
    }

    //Real-time Energy and Cost of Citizen
    @Get('realtime_energy_cost')
    getRealTimeEnergyAndCostData(@Session() session) {
        return this.citizenService.getRealTimeEnergyCostData(session.contact)
    }

    //Usage of Citizen by Date
    @Get('usage/:date')
    getUsageByDate(@Param('date') date: any, @Session() session) {
        return this.citizenService.getUsageByDate(session.contact, date)
    }

    //Energy and Cost of Citizen by Date
    @Get('energy_cost/:date')
    getEnergyCostByDate(@Param('date') date: any, @Session() session) {
        return this.citizenService.getEnergyCostByDate(session.contact, date)
    }

    //Daily Total Energy and Cost of Citizen
    @Get('daily_energy_cost')
    getDailyEnergyAndCostData(@Session() session): any {
        return this.citizenService.getDailyEnergyCostData(session.contact)
    }

    //Generate 6-digit OTP
    @Get('generateOTP')
    getGeneratedOTP(@Session() session) {
        return this.citizenService.getGeneratedOTP(session.contact);
    }


    //Citizen All Usage Data
    // @Get('dashboard')
    // getAllUsageData(@Session() session): any {
    //     return this.citizenService.getAllUsage(session.contact);
    // }
}