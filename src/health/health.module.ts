import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';
import { HealthCheckService } from '../common/health-check/health-check.service.js';


@Module({
  imports: [HealthCheckService],
  controllers: [HealthController],
  providers: [HealthService]
})
export class HealthModule { }
