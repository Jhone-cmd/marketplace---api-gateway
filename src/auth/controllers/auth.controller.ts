import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../service/auth.service.js';
import { Throttle } from '@nestjs/throttler';
import { RegisterDto } from '../dtos/register.dto.js';
import { LoginDto } from '../dtos/login.dto.js';

@ApiTags("Authentication")
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: "User login" })
    @ApiResponse({ status: 200, description: "Login successfully" })
    @ApiResponse({ status: 401, description: "Invalid credentials" })
    @Throttle({ short: { limit: 5, ttl: 60000 } })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }


    @Post("register")
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({ summary: "User registration" })
    @ApiResponse({ status: 201, description: "Registration successfully" })
    @ApiResponse({ status: 400, description: "Invalid registration data" })
    @Throttle({ medium: { limit: 3, ttl: 60000 } })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }
}
