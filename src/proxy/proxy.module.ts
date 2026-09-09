import { Module } from '@nestjs/common';
import { ProxyService } from './service/proxy.service.js';

@Module({
  imports: [],
  providers: [ProxyService],
  exports: [],
})
export class ProxyModule {}
