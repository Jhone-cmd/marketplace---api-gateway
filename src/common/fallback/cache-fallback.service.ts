import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class CacheFallbackService {
    private readonly logger = new Logger(CacheFallbackService.name);
    private readonly cache = new Map<string, { data: any; timestamp: number }>();

    async getCachedData<T>(key: string, timeout: number = 300000): Promise<T | null> {

        const cached = this.cache.get(key);
        if (!cached) {
            this.logger.log(`Cache miss for key: ${key}`);
            return null;
        }

        const isExpired = (Date.now() - cached.timestamp) > timeout;

        if (isExpired) {
            this.logger.log(`Cache expired for key: ${key}`);
            this.cache.delete(key);
            return null;
        }

        this.logger.log(`Cache hit for key: ${key}`);
        return cached.data;
    }

    setCachedData<T>(key: string, data: T): void {
        this.cache.set(key, { data, timestamp: Date.now() });
        this.logger.log(`Data cached for key: ${key}`);
    }

    createCacheFallback<T>(key: string, defaultData: T, timeout: number = 300000): () => Promise<T> {
        return async (): Promise<T> => {

            const cached = await this.getCachedData<T>(key, timeout);

            if (cached) {
                this.logger.log(`Returning cached data for key: ${key}`);
                return cached;
            }

            this.logger.warn(`No cached data found for key: ${key}. Returning default data.`);
            return defaultData;
        };
    }
}