enum CircuitBreakerStateEnum {
    CLOSED = 'CLOSED',
    OPEN = 'OPEN',
    HALF_OPEN = 'HALF_OPEN',
}

export interface CircuitBreakerOptions {
    failureThreshold: number;
    timeout: number;
    resetTimeout: number;
}

export interface CircuitBreakerState {
    failureCount: number;
    lastFailureTime: number;
    nextAttemptTime: number;
    state: CircuitBreakerStateEnum;
}

export interface CircuitBreakerResult<T> {
    success: boolean;
    data?: T;
    error?: Error;
    fromCache?: boolean;
}