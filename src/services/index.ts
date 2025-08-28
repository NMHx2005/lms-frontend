// Main API service
export { default as api } from './api';

// Shared services (public endpoints)
export * from './shared';

// Admin services (admin-only endpoints)
export * from './admin';

// Client services (authenticated user endpoints)
export * from './client';
