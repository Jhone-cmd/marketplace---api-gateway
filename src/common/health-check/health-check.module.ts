import { Module } from '@nestjs/common';
import { HealthCheckService } from './health-check.service.js';
import { CircuitBreakerModule } from '../circuit-breaker/circuit-breaker.module.js';
import { HttpModule } from '@nestjs/axios';
@Module({
    imports: [HttpModule, CircuitBreakerModule],
    providers: [HealthCheckService],
    exports: [HealthCheckService],
})
export class HealthCheckModule { }
