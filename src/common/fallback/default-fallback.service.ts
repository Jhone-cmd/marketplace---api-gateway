import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class DefaultFallbackService {
    private readonly logger = new Logger(DefaultFallbackService.name);

    createDefaultFallback<T>(defaultResponse: T, serviceName: string): () => Promise<T> {
        return async (): Promise<T> => {
            this.logger.warn(`Returning default fallback from service: ${serviceName}`);
            return defaultResponse;
        };
    }

    createErrorFallback<T>(errorMessage: string, serviceName: string): () => Promise<T> {
        return async (): Promise<T> => {
            this.logger.error(`Fallback error in service: ${serviceName}. Error: ${errorMessage}`);
            throw new Error(`${serviceName} service unavailable: ${errorMessage}`);
        };
    }


    createEmptyArrayFallback<T>(serviceName: string): () => Promise<T[]> {
        return async (): Promise<T[]> => {
            this.logger.warn(`Returning empty array fallback from service: ${serviceName}`);
            return [];
        };
    }

    createEmptyObjectFallback<T>(serviceName: string): () => Promise<T> {
        return async (): Promise<T> => {
            this.logger.warn(`Returning empty object fallback from service: ${serviceName}`);
            return {} as T;
        };
    }
}