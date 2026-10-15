import { Injectable } from '@nestjs/common';
import { HealthCheckService } from '../common/health-check/health-check.service.js';
import { HealthCheckStatus } from '../common/health-check/health-check.interface.js';

@Injectable()
export class HealthService {
    constructor(private readonly healthCheckService: HealthCheckService) { }

    async getHealthStatus() {

        const healthChecks = await this.healthCheckService.checkAllServicesHealth();

        const results = {
            status: HealthCheckStatus.HEALTHY,
            timestamp: new Date().toISOString(),
            gateway: {
                status: HealthCheckStatus.HEALTHY,
                uptime: process.uptime(),
                memory: process.memoryUsage(),
            },
            services: {},
        };

        let hasUnhealthyServices = false;

        healthChecks.forEach((serviceHealth) => {
            results.services[serviceHealth.name] = {
                name: serviceHealth.name,
                status: serviceHealth.status,
                responseTime: serviceHealth.responseTime,
                lastCheck: serviceHealth.lastCheck,
                url: serviceHealth.url,
                ...(serviceHealth.error && { error: serviceHealth.error }),
            };

            if (serviceHealth.status === 'unhealthy') {
                hasUnhealthyServices = true;
            }
        });

        if (hasUnhealthyServices) {
            results.status = HealthCheckStatus.DEGRADED;
        }

        return results;
    }

    async getReadyStatus() {
        const healthStatus = await this.getHealthStatus();
        return {
            status: healthStatus.status === HealthCheckStatus.HEALTHY ? 'ready' : 'not ready',
            timestamp: new Date().toISOString(),
        };
    }

    async getLiveStatus() {
        return {
            status: 'live',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
}
