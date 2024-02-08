import { IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength } from "class-validator";

export class UsageLogData {
    @IsInt({ message: "Invalid Log ID!" })
    @IsNotEmpty({ message: "Log ID Must be Filled!" })
    log_id: number
    @IsInt({ message: "Invalid Power!" })
    @IsNotEmpty({ message: "Power Must be Filled!" })
    power: number
    @IsInt({ message: "Invalid Current!" })
    @IsNotEmpty({ message: "Current Must be Filled!" })
    current: number
    @IsInt({ message: "Invalid Voltage!" })
    @IsNotEmpty({ message: "Voltage Must be Filled!" })
    voltage: number
    @IsNotEmpty({ message: "Time Must be Filled!" })
    time: string
    c_id: number
}

export class DatabaseDTO {
    id: number
    power: number
    current: number
    voltage: number
    time: string
    c_id: number
    cdate: Date
}

export class EnergyCostDTO {
    energy: number
    cost: number
    c_id: number
}

export class TotalDailyEnergyCostDTO {
    energy: number
    cost: number
    c_id: number
}