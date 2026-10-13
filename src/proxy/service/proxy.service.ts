import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { serviceConfig } from '../../config/gateway.config.js';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { CircuitBreakerService } from '../../common/circuit-breaker/circuit-breaker.service.js';
import { DefaultFallbackService } from '../../common/fallback/default-fallback.service.js';
import { CacheFallbackService } from '../../common/fallback/cache-fallback.service.js';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface UserInfo {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly httpService: HttpService, private readonly circuitBreaker: CircuitBreakerService, private readonly defaultFallback: DefaultFallbackService, private readonly cacheFallback: CacheFallbackService) { }

  async proxyRequest(
    serviceName: keyof typeof serviceConfig,
    method: string,
    path: string,
    data?: unknown,
    userInfo?: UserInfo,
    headers?: Record<string, string>,
  ) {
    const serviceUrl = serviceConfig[serviceName];
    const url = `${serviceUrl}${path}`;

    this.logger.log(`Proxying request to ${url} with method ${method}`);

    const fallback = this.createServiceFallback(serviceName, method, path);

    return this.circuitBreaker.executeWithCircuitBreaker(
      `proxy-${serviceName}`,
      async () => {
        const enhancedHeaders = {
          ...headers,
          'x-user-id': userInfo?.userId,
          'x-user-email': userInfo?.email,
          'x-user-role': userInfo?.role,
        };

        const response = await firstValueFrom(
          this.httpService.request({
            method: method.toLowerCase() as HttpMethod,
            url,
            data,
            headers: enhancedHeaders,
            timeout: serviceUrl.timeout || 5000, // Set a default timeout if not specified
          }),
        );

        if (method.toLowerCase() === 'get') {
          this.cacheFallback.setCachedData(`proxy-${serviceName}-${path}`, response.data);
        }

        return response.data;
      },
      fallback,
      { failureThreshold: 3, timeout: 30000, resetTimeout: 30000 }
    )

  }


  async serviceHealthCheck(serviceName: keyof typeof serviceConfig) {
    try {
      const serviceUrl = serviceConfig[serviceName];
      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(`${serviceUrl}/health`, {
          timeout: 3000, // Set a timeout for the health check request
        }),
      );
      return {
        status: 'healthy',
        data: response.data,
      };
    } catch (error: any) {
      return {
        status: 'unhealthy',
        error: error.message,
      };
    }
  }

  private createServiceFallback(serviceName: string, method: string, path: string) {

    switch (serviceName) {
      case 'users':
        if (path.includes('/auth/login')) {
          return this.defaultFallback.createErrorFallback('users', 'Authentication service is unavailable');
        }
        return this.defaultFallback.createErrorFallback('users', 'User service is unavailable');

      case 'products':
        if (method.toLowerCase() === 'get') {
          return this.cacheFallback.createCacheFallback(`product-${path}`, { products: [], total: 0, page: 1, limit: 10 });
        }
        return this.defaultFallback.createErrorFallback('products', 'Product service is unavailable');

      case 'checkout':
      case 'payments':
        return this.defaultFallback.createErrorFallback(serviceName, `${serviceName} service is unavailable`);

      default:
        return this.defaultFallback.createErrorFallback(`Service ${serviceName} is unavailable`, serviceName);
    }
  }
}
