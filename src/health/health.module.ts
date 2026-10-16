import { Module } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';
import { HealthCheckModule } from '../common/health-check/health-check.module.js';


@Module({
  imports: [HealthCheckModule],
  controllers: [HealthController],
  providers: [HealthService]
})
export class HealthModule { }
