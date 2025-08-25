import api from './api';
import { SystemMetrics } from './types';

export const metricsService = {
	getSystem() {
		return api.get<SystemMetrics>('/metrics/system').then(r => r.data);
	},
};


