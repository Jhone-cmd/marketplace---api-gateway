import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { serviceConfig } from '../../config/gateway.config.js';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

interface UserInfo {
  userId: string;
  email: string;
  role: string;
}

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly httpService: HttpService) { }

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

    try {
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
      return response;
    } catch (error: any) {
      this.logger.error(`Error proxying request to ${url}: ${error.message}`);
      throw error;
    }
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
}
