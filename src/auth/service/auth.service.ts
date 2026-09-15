import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private readonly configService: ConfigService) { }

    validateJwtToken() { }
    validateSessionToken() { }
    login() { }
    register() { }
}
