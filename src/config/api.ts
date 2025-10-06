// API Configuration
export const API_CONFIG = {
    BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    ENDPOINTS: {
        AUTH: '/api/auth',
        ADMIN: '/api/admin',
        CLIENT: '/api/client',
        UPLOAD: '/api/upload',
        PAYMENTS: '/api/payments',
        CART: '/api/cart',
        REPORTS: '/api/reports',
        METRICS: '/api/metrics',
        VERIFICATION: '/api/verify',
        COMMENTS: '/api/comments',
        COURSES: '/api/courses'
    }
};

// Request timeout configuration
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Token configuration
export const TOKEN_CONFIG = {
    ACCESS_TOKEN_KEY: 'accessToken',
    REFRESH_TOKEN_KEY: 'refreshToken',
    TOKEN_EXPIRY_BUFFER: 5 * 60 * 1000 // 5 minutes before expiry
};
