import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

enum Role {
    USER = 'user',
    ADMIN = 'admin',
    SELLER = 'seller',
}

export class RegisterDto {
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

    @ApiProperty({
        description: 'User first name',
        example: 'John'
    })
    @IsString()
    firstName: string;

    @ApiProperty({
        description: 'User last name',
        example: 'Doe'
    })
    @IsString()
    lastName: string;

    @ApiProperty({
        description: 'User role',
        example: 'user',
        enum: Role,
        default: Role.USER
    })
    @IsOptional()
    @IsString()
    role?: Role = Role.USER;
}
