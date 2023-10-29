import { Body, Controller, Post, UsePipes, ValidationPipe, Session, NotFoundException, Get } from "@nestjs/common";
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
        console.log(citizenLogInfo)

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
    getUsageData(@Session() session) : any {
        return this.citizenService.getUsageData(session.contact);
    }
}