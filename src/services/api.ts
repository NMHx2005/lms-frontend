import axios from 'axios';

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

const baseURL = joinUrl(API_BASE_URL, API_PREFIX);

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
		if (API_USE_BEARER) {
			const token = localStorage.getItem('token');
			if (token) config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => Promise.reject(error)
);

api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest: any = error.config || {};

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				if (API_WITH_CREDENTIALS) {
					// Cookie-based session/refresh
					await axios.post(joinUrl(baseURL, API_REFRESH_PATH), {}, { withCredentials: true });
					return api(originalRequest);
				}

				// Bearer token flow with refresh token in storage
				const refreshToken = localStorage.getItem('refreshToken');
				const resp = await axios.post(joinUrl(baseURL, API_REFRESH_PATH), { refreshToken });
				const { accessToken } = resp.data || {};
				if (accessToken) {
					localStorage.setItem('token', accessToken);
					api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
				}
				return api(originalRequest);
			} catch (refreshError) {
				localStorage.removeItem('token');
				localStorage.removeItem('refreshToken');
				window.location.href = '/login';
				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default api;