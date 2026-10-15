export enum HealthCheckStatus {
    HEALTHY = 'healthy',
    UNHEALTHY = 'unhealthy',
    DEGRADED = 'degraded'
}

export interface ServiceHealthCheck {
    name: string;
    url: string;
    status: HealthCheckStatus;
    responseTime: number;
    lastCheck: Date;
    error?: Error;
}