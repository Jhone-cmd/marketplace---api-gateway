import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: any, res: any, next: () => void) {
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const startTime = Date.now();

    this.logger.log(
      `Incoming request: ${method} ${originalUrl} - IP: ${ip} - User-Agent: ${userAgent} `,
    );

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      const responseTime = Date.now() - startTime;

      this.logger.log(
        `Outgoing response: ${method} ${originalUrl} - ${statusCode} - ${contentLength || 0}b - ${userAgent} ${ip} - ${responseTime}ms`,
      );
    });

    // Log de errors
    res.on('error', (error: any) => {
      this.logger.error(
        `Error occurred while processing request: ${method} ${originalUrl} - Error: ${error.message}`,
      );
    });

    // Logs de timeout
    res.on('timeout', () => {
      this.logger.warn(
        `Request timeout: ${method} ${originalUrl} - IP: ${ip} - ${Date.now() - startTime}ms`,
      );
    });

    next();
  }
}
