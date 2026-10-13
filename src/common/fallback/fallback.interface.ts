export interface FallbackStrategy<T> {
    execute(): Promise<T>
}

export interface FallbackOptions {
    useCache?: boolean;
    cacheTimeout?: number; // in milliseconds
    defaultResponse?: any;
    retryCount?: number;
    retryDelay?: number; // in milliseconds
}