import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { ProxyService } from './proxy/service/proxy.service.js';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly proxyService: ProxyService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      services: {
        users: await this.proxyService.serviceHealthCheck('users'),
        products: await this.proxyService.serviceHealthCheck('products'),
        checkout: await this.proxyService.serviceHealthCheck('checkout'),
        payments: await this.proxyService.serviceHealthCheck('payments'),
      },
    };
  }
}
