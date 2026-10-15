import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service.js';
import { HealthCheckService } from '../common/health-check/health-check.service.js';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('health')
export class HealthController {
    constructor(private readonly healthService: HealthService, private readonly healthCheckService: HealthCheckService) { }

    @Get()
    @ApiOperation({ summary: 'Health check of gateway' })
    @ApiResponse({ status: 200, description: 'The gateway is healthy.' })
    async getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            memory: process.memoryUsage(),
            version: process.version,
        };
    }

    @Get('services')
    @ApiOperation({ summary: 'Health check of all services' })
    @ApiResponse({ status: 200, description: 'The health status of all services.' })
    async getServicesHealth() {
        const healthChecks = await this.healthCheckService.checkAllServicesHealth();
        const overallStatus = healthChecks.every((serviceHealth) => serviceHealth.status === 'healthy')
            ? 'healthy'
            : healthChecks.some((serviceHealth) => serviceHealth.status === 'unhealthy')
                ? 'degraded'
                : 'unknown';

        return {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            summary: {
                totalServices: healthChecks.length,
                healthyServices: healthChecks.filter((serviceHealth) => serviceHealth.status === 'healthy').length,
                unhealthyServices: healthChecks.filter((serviceHealth) => serviceHealth.status === 'unhealthy').length,
                degradedServices: healthChecks.filter((serviceHealth) => serviceHealth.status === 'degraded').length,
            },
            services: healthChecks.map((serviceHealth) => ({
                name: serviceHealth.name,
                status: serviceHealth.status,
                responseTime: serviceHealth.responseTime,
                lastCheck: serviceHealth.lastCheck,
                url: serviceHealth.url,
                ...(serviceHealth.error && { error: serviceHealth.error }),
            })),
        };
    }

    @Get('services/:serviceName')
    @ApiOperation({ summary: 'Health check of a specific service' })
    @ApiResponse({ status: 200, description: 'The health status of the specified service.' })
    async getServiceHealth(serviceName: string) {
        const cached = this.healthCheckService.getCachedHealth(serviceName);

        if (!cached) {
            return {
                status: 'unknown',
                message: `No cached health information available for service: ${serviceName}`,
                timestamp: new Date().toISOString(),
            };
        }

        return cached;
    }



    @Get('ready')
    @ApiOperation({ summary: 'Check if the application is ready to receive requests' })
    @ApiResponse({ status: 200, description: 'The application is ready to receive requests.' })
    async getReadyStatus() {
        return this.healthService.getReadyStatus();
    }

    @Get('live')
    @ApiOperation({ summary: 'Check if the application is live and running' })
    @ApiResponse({ status: 200, description: 'The application is live and running.' })
    async getLiveStatus() {
        return this.healthService.getLiveStatus();
    }
}
