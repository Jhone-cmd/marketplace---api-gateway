import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({
        description: 'User email',
        example: 'user@example.com'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: 'User password',
        example: 'password123'
    })
    @IsString()
    @MinLength(6)
    @MaxLength(100)
    password: string;
}