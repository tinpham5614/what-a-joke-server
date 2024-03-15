import { IsEmail, IsNotEmpty } from "class-validator";
import { Role } from "src/users/schema/user.schema";

export class SignUpDto {
    @IsNotEmpty()
    readonly firstName: string;

    @IsNotEmpty()
    readonly lastName: string;

    @IsNotEmpty()
    @IsEmail()
    readonly email: string;

    @IsNotEmpty()
    readonly password: string;

    @IsNotEmpty()
    readonly confirmPassword: string;

    @IsNotEmpty()
    readonly role: Role;
}