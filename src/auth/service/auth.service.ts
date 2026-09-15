import { HttpService } from '@nestjs/axios';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly httpService: HttpService) { }

    validateJwtToken(token: string): Promise<any> {
        try {
            return this.jwtService.verify(token);
        } catch (error) {
            throw new UnauthorizedException('Invalid JWT token');
        }
    }
    validateSessionToken() { }
    login() { }
    register() { }
}
