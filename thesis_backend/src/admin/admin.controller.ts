import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Session, NotFoundException, UnauthorizedException, Req, ParseIntPipe, Param, Delete } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminLoginDTO, AdminMessageDTO, AdminRegDTO } from "./admin.dto";
import { DatabaseDTO } from "src/database/database.dto";

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('msg') //testing purpose
    checkMessage(): any {
        return this.adminService.checkMessage();
    }

    @Post('testing')
    setValue(@Body() values: DatabaseDTO) {
        return this.adminService.setValue(values)
    }

    @Post('register')
    @UsePipes(new ValidationPipe())
    regAdmin(@Body() adminRegInfo: AdminRegDTO): any {
        console.log("Admin Registration Info: ", adminRegInfo);

        return this.adminService.regAdmin(adminRegInfo)

        // if (this.adminService.regAdmin(adminRegInfo)) {
        //     return "Admin Registration Successful!";
        // }

        // return "Admin Registration Failed!";
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    async loginAdmin(@Body() adminLoginInfo: AdminLoginDTO, @Session() session) {
        console.log("Admin Login Credentials: ", adminLoginInfo);

        const result = await this.adminService.loginAdmin(adminLoginInfo);

        if (result) {
            session.username = adminLoginInfo.username;
            console.log("Admin Login Session Username: " + session.username)

            return "Admin Login Successful!"
        } else {
            return new NotFoundException({ message: "Admin Not Found!" })
        }

        // if (result) {
        //     return "Admin Login Successful!"
        // } else {
        //     return "Admin Login Failed!"
        // }
    }

    @Get('citizens')
    getCitizensID(): any {
        return this.adminService.getCitizens();
    }

    @Get('dashboard')
    getUsageData(): any {
        return this.adminService.getUsageData();
    }

    @Get('usages/:c_id')
    async getUsageDataByCitizenID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = this.adminService.getUsageDataByCitizenID(c_id, session.username)
        if (res) {
            return res
        } else {
            return new NotFoundException({ message: "No Usage Data was Found!" })
        }
    }

    @Get('search/citizen/:c_id')
    async getCitizenByID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = await this.adminService.getCitizenByID(c_id, session.username)

        return res
    }

    @Get('citizen_profile/:c_id')
    async getCitizenProfileByID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = await this.adminService.getCitizenProfileByID(c_id, session.username)

        return res
    }

    @Delete('delete/citizen/:c_id')
    async deleteCitizenByID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = await this.adminService.deleteCitizenByID(c_id, session.username)
    }

    @Get('cost/:c_id')
    async getCostByCitizenID(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = await this.adminService.getCostByCitizenID(c_id, session.username)

        return res
    }

    @Get('energy_cost/:c_id')
    async getEnergy(@Param("c_id", ParseIntPipe) c_id: number, @Session() session) {
        const res = await this.adminService.getCalculatedAndSavedEnergy_Cost(c_id, session.username)

        return res
    }

    @Post('sendmail')
    sendMailToCitizen(@Body() messageInfo: AdminMessageDTO, @Session() session) {
        console.log(messageInfo);
        this.adminService.sendMailToCitizen(messageInfo, session.username);

        return "E-mail Send Successful!";
    }

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
}