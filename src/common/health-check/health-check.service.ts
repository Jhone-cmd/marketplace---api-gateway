import { Injectable, Logger } from '@nestjs/common';
import { HealthCheckStatus, ServiceHealthCheck } from './health-check.interface.js';
import { HttpService } from '@nestjs/axios';
import { CircuitBreakerService } from '../circuit-breaker/circuit-breaker.service.js';
import { serviceConfig } from '../../config/gateway.config.js';
import { firstValueFrom, timeout } from 'rxjs';

@Injectable()
export class HealthCheckService {
    private readonly logger = new Logger(HealthCheckService.name);
    private readonly healthCache = new Map<string, ServiceHealthCheck>();

    constructor(private readonly httpService: HttpService, private readonly circuitBreakerService: CircuitBreakerService) { }

    async checkServiceHealth(serviceName: keyof typeof serviceConfig): Promise<ServiceHealthCheck | unknown> {
        const service = serviceConfig[serviceName];
        const startTime = Date.now();

        try {
            await this.circuitBreakerService.executeWithCircuitBreaker(
                `health-${serviceName}`,
                async () => {
                    const response = await firstValueFrom(this.httpService.get(`${service.url}/health`, {
                        timeout: service.timeout,
                    }).pipe(timeout(service.timeout)));
                    return response.status
                },
                async () => {
                    this.logger.warn(`Circuit breaker fallback`);
                    throw new Error('Circuit breaker fallback');
                }
            )

            const responseTime = Date.now() - startTime;
            const serviceHealth = {
                name: serviceName,
                url: service.url,
                status: HealthCheckStatus.HEALTHY,
                responseTime,
                lastCheck: new Date(),
            };

            this.healthCache.set(serviceName, serviceHealth);
            return serviceHealth;

        } catch (error: Error | any) {
            const responseTime = Date.now() - startTime;
            const serviceHealth = {
                name: serviceName,
                url: service.url,
                status: HealthCheckStatus.UNHEALTHY,
                responseTime,
                lastCheck: new Date(),
                error: error.message,
            };

            this.healthCache.set(serviceName, serviceHealth);
            this.logger.error(`Error checking health of service ${serviceName}: ${error.message}`);
        }
    }
}

