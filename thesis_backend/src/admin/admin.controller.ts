import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Session, NotFoundException, UnauthorizedException, Req, ParseIntPipe, Param, Delete } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminLoginDTO, AdminMessageDTO, AdminRegDTO } from "./admin.dto";
import { DatabaseDTO } from "src/database/database.dto";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    //testing API call
    @Get('msg')
    checkMessage(): any {
        return this.adminService.checkMessage();
    }

    //Admin Registration
    @Post('register')
    @UsePipes(new ValidationPipe())
    regAdmin(@Body() adminRegInfo: AdminRegDTO): any {
        console.log("Admin Registration Info: ", adminRegInfo);

        return this.adminService.regAdmin(adminRegInfo)
    }

    //Admin Login 
    @Post('login')
    @UsePipes(new ValidationPipe())
    async loginAdmin(@Body() adminLoginInfo: AdminLoginDTO, @Session() session) {
        console.log("Admin Login Credentials: ", adminLoginInfo);

        const result = await this.adminService.loginAdmin(adminLoginInfo);

        if (result) {
            session.username = adminLoginInfo.username;
            console.log("Admin Login - Session Username: " + session.username)

            return "Admin Login Successful!"
        } else {
            return new NotFoundException({ message: "Admin Not Found!" })
        }
    }

    //List of All Citizens' ID and Name
    @Get('citizens')
    getCitizensID(): any {
        return this.adminService.getCitizens();
    }

    //Real-time Usage of Citizen by ID
    @Get('realtime_usages/:c_id')
    async getRealTimeUsageDataByCitizenID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = this.adminService.getRealTimeUsageDataByCitizenID(c_id, session.username)
        if (res) {
            return res
        } else {
            return new NotFoundException({ message: "No Usage Data was Found!" })
        }
    }

    //Real-time Energy and Cost of Citizen by ID
    @Get('realtime_energy_cost/:c_id')
    async getRealTimeEnergyCostByCitizenID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = this.adminService.getRealTimeEnergyCostByCitizenID(c_id, session.username)
        if (res) {
            return res
        } else {
            return new NotFoundException({ message: "No Energy_Cost Data was Found!" })
        }
    }

    //Daily Total Energy and Cost of Citizen by ID
    @Get('daily_energy_cost/:c_id')
    getDailyEnergyAndCostDataByCitizenID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session): any {
        return this.adminService.getDailyEnergyAndCostDataByCitizenID(c_id, session.contact)
    }

    //Get Searched Citizen by ID
    @Get('search/citizen/:c_id')
    async getCitizenByID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = await this.adminService.getCitizenByID(c_id, session.username)

        return res
    }

    //Get Citizen Data by ID
    @Get('citizen_profile/:c_id')
    async getCitizenProfileByID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = await this.adminService.getCitizenProfileByID(c_id, session.username)

        return res
    }

    //Delete Citizen by ID
    @Delete('delete/citizen/:c_id')
    async deleteCitizenByID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = await this.adminService.deleteCitizenByID(c_id, session.username)
    }

    //Send Mail to Citizen
    @Post('sendmail')
    sendMailToCitizen(@Body() messageInfo: AdminMessageDTO, @Session() session) {
        console.log(messageInfo);
        this.adminService.sendMailToCitizen(messageInfo, session.username);

        return "E-mail Send Successful!";
    }

    @Post('logout')
    // @UseGuards(SessionGuard)
    logoutManager(@Req() req) {
        if (req.session.destroy()) {
            console.log('Admin Sign Out Successful!');
            return true;
        } else {
            throw new UnauthorizedException("Invalid Actions : Admin Sign Out Failed!");
        }
    }
    

    // @Get('dashboard')
    // getUsageData(): any {
    //     return this.adminService.getUsageData();
    // }

    //Get Cost of Citizen by ID
    // @Get('cost/:c_id')
    // async getCostByCitizenID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
    //     const res = await this.adminService.getCostByCitizenID(c_id, session.username)

    //     return res
    // }

    //Get Energy and Cost of Citizen by ID
    // @Get('energy_cost/:c_id')
    // async getEnergy(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
    //     const res = await this.adminService.getCalculatedAndSavedEnergy_Cost(c_id, session.username)

    //     return res
    // }

    // @Post('sendOTP')
    // async sendOTP(@Body() data: { phone: string }): Promise<{ msg: string }> {
    //     let prefix = '+88';
    //     let phone = prefix.concat(data.phone);
    //     return await this.adminService.sendOTP(phone);
    // }

    // @Post('verifyOTP')
    // async verifyOTP(@Body() data: { phone: string; otp: string }): Promise<{ msg: string }> {
    //     let prefix = '+88';
    //     let phone = prefix.concat(data.phone);
    //     return await this.adminService.verifyOTP(phone, data.otp);
    // }
}