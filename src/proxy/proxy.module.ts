import { Module } from '@nestjs/common';
import { ProxyService } from './service/proxy.service.js';
import { HttpModule } from '@nestjs/axios';
import { CircuitBreakerModule } from '../common/circuit-breaker/circuit-breaker.module.js';
import { FallbackModule } from '../common/fallback/fallback.module.js';
import { RetryModule } from '../common/retry/retry.module.js';
import { TimeoutModule } from '../common/timeout/timeout.module.js';

@Module({
  imports: [HttpModule, CircuitBreakerModule, FallbackModule, RetryModule, TimeoutModule],
  providers: [ProxyService],
  exports: [ProxyService],
})
export class ProxyModule { }
