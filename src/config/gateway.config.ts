import { timeout } from 'rxjs';

export const serviceConfig = {
  users: {
    url: process.env.USERS_SERVICE_URL || 'http://localhost:3001',
    timeout: 5000, // 5 seconds
    prefix: '/users',
  },
  products: {
    url: process.env.PRODUCTS_SERVICE_URL || 'http://localhost:3002',
    timeout: 5000, // 5 seconds
    prefix: '/products',
  },
  checkout: {
    url: process.env.ORDERS_SERVICE_URL || 'http://localhost:3003',
    timeout: 5000, // 5 seconds
    prefix: '/checkout',
  },
  payments: {
    url: process.env.PAYMENTS_SERVICE_URL || 'http://localhost:3004',
    timeout: 5000, // 5 seconds
    prefix: '/payments',
  },
} as const;
