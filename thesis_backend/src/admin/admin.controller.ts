import { Controller, Get, Post, Body, UsePipes, ValidationPipe, Session, NotFoundException, UnauthorizedException, Req, ParseIntPipe, Param } from "@nestjs/common";
import { AdminService } from "./admin.service";
import { AdminLoginDTO, AdminRegDTO } from "./admin.dto";
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