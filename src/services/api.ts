import axios from 'axios';
import { toast } from 'react-hot-toast';

// Default to backend port 5000, but can be overridden by VITE_API_URL env var
// Note: Vite proxy is configured to forward /api to localhost:5000
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5000';
const API_PREFIX = (import.meta as any).env?.VITE_API_PREFIX || '/api';
const API_TIMEOUT = Number((import.meta as any).env?.VITE_API_TIMEOUT) || 15000;
const API_WITH_CREDENTIALS = String((import.meta as any).env?.VITE_API_WITH_CREDENTIALS || 'false') === 'true';
const API_USE_BEARER = String((import.meta as any).env?.VITE_API_USE_BEARER || 'true') === 'true';
const API_REFRESH_PATH = (import.meta as any).env?.VITE_API_REFRESH_PATH || '/auth/refresh';

function joinUrl(base: string, path: string): string {
	if (!base) return path || '/';
	if (!path) return base;
	const baseTrimmed = base.endsWith('/') ? base.slice(0, -1) : base;
	const pathTrimmed = path.startsWith('/') ? path : `/${path}`;
	return `${baseTrimmed}${pathTrimmed}`;
}

function extractErrorMessage(err: any): string {
	const data = err?.response?.data;
	if (!data) return err?.message || 'Network error. Please try again.';
	if (typeof data === 'string') return data;

	// Try nested error object first
	const rootError = data.error || data;

	// Collect detailed messages when available (e.g., validation details)
	const details = rootError?.details;
	if (Array.isArray(details) && details.length) {
		const msgs = details
			.map((d: any) => {
				const field = d?.field || d?.path || '';
				const msg = d?.message || d?.msg || '';
				return field ? `${field}: ${msg}` : msg;
			})
			.filter(Boolean);
		if (msgs.length) return msgs.join('\n');
	}

	if (rootError?.message) return rootError.message;
	if (data.message) return data.message;

	// Common alternative shapes
	if (data.error_message) return data.error_message;
	if (Array.isArray(data.errors) && data.errors.length) return data.errors[0]?.message || 'Request failed.';

	return 'Request failed. Please try again.';
}

const baseURL = joinUrl(API_BASE_URL, API_PREFIX);
// If using cookie-based auth, do not attach Bearer tokens
const SHOULD_USE_BEARER = API_USE_BEARER && !API_WITH_CREDENTIALS;

const api = axios.create({
	baseURL,
	timeout: API_TIMEOUT,
	headers: {
		'Content-Type': 'application/json',
		'X-Requested-With': 'XMLHttpRequest',
	},
	withCredentials: API_WITH_CREDENTIALS,
});

api.interceptors.request.use(
	(config) => {

		// If data is FormData, remove Content-Type header to let browser set it with boundary
		if (config.data instanceof FormData) {
			delete config.headers['Content-Type'];
		}

		if (SHOULD_USE_BEARER) {
			const token = localStorage.getItem('accessToken');
			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			} else {
				console.warn('⚠️ No accessToken found in localStorage');
			}
		} else {
			console.log('ℹ️ Using cookie-based auth (SHOULD_USE_BEARER is false)');
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => {
		console.log('✅ API Response:', {
			status: response.status,
			url: response.config.url,
			data: response.data
		});
		return response;
	},
	async (error) => {
		console.log('❌ API Error:', {
			status: error.response?.status,
			url: error.config?.url,
			message: error.message,
			data: error.response?.data
		});
		const originalRequest: any = error.config || {};

		// Do NOT attempt refresh on auth endpoints themselves
		const urlPath = (originalRequest?.url || '').toString();
		const isAuthEndpoint = [
			'/auth/login',
			'/auth/register',
			'/auth/refresh',
			'/auth/validate-token',
		].some((p) => urlPath.includes(p));
		if (isAuthEndpoint) {
			return Promise.reject(error);
		}

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				if (API_WITH_CREDENTIALS) {
					await axios.post(joinUrl(baseURL, API_REFRESH_PATH), {}, { withCredentials: true });
					return api(originalRequest);
				}

				const storedRefreshToken = localStorage.getItem('refreshToken');
				// No refresh token available → do not attempt refresh
				if (!storedRefreshToken) {
					return Promise.reject(error);
				}

				const resp = await axios.post(joinUrl(baseURL, API_REFRESH_PATH), { refreshToken: storedRefreshToken });
				const refreshedAccessToken = resp?.data?.data?.accessToken ?? resp?.data?.accessToken;
				if (refreshedAccessToken) {
					localStorage.setItem('accessToken', refreshedAccessToken);
					api.defaults.headers.common['Authorization'] = `Bearer ${refreshedAccessToken}`;
					originalRequest.headers = originalRequest.headers || {};
					originalRequest.headers['Authorization'] = `Bearer ${refreshedAccessToken}`;
				}
				return api(originalRequest);
			} catch (refreshError) {
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				return Promise.reject(refreshError);
			}
		}

		// Check if this request should suppress error toast
		const suppressErrorToast = error.config?.suppressErrorToast;

		const message = extractErrorMessage(error);
		if (message && !suppressErrorToast) {
			toast.error(message);
		}
		return Promise.reject(error);
	}
);

export default api;