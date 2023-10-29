import { IsEmail, IsInt, IsNotEmpty, IsPhoneNumber, IsString, Matches, MaxLength } from "class-validator";

export class CitizenRegDTO {
    c_id:number;

    @IsString({message: "Invalid Name"})
    @Matches(/^[a-z A-Z]+$/, {message:"Use Valid Name Format"})
    @IsNotEmpty({message: "Name Must be Filled!"})
    @MaxLength(200)
    name:string;

    @IsEmail({}, {message: "Invalid E-mail!"})
    @IsNotEmpty({message: "E-mail Must be Filled!"})
    email:string;

    @IsInt({message: "Invalid Contact!"})
    @IsNotEmpty({message: "E-mail Must be Filled!"})
    contact:number;

    @IsString({message: "Invalid Password!"})
    @IsNotEmpty({message: "Password Must be Filled!"})
    password:string;
}

export class CitizenLoginDTO {
    @IsInt({message: "Invalid Contact!"})
    @IsNotEmpty({message: "Contact Must be Filled!"})
    contact:number;

    @IsString({message: "Invalid Password!"})
    @IsNotEmpty({message: "Password Must be Filled!"})
    password:string;
}