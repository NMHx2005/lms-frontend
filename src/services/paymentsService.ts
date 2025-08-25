import api from './api';
import { PaymentHistoryItem, PaymentRequest } from './types';

export const paymentsService = {
	create(payload: PaymentRequest) {
		return api.post<{ redirectUrl?: string; success?: boolean }>('/payments/create', payload).then(r => r.data);
	},
	return(query: Record<string, any>) {
		return api.get<{ success: boolean; orderId?: string; amount?: number }>('/payments/return', { params: query }).then(r => r.data);
	},
	ipn(payload: any) {
		return api.post<{ success: boolean }>('/payments/ipn', payload).then(r => r.data);
	},
	history(params?: { page?: number; limit?: number }) {
		return api.get<{ items: PaymentHistoryItem[]; total?: number }>('/payments/history', { params }).then(r => r.data);
	},
	refund(payload: { transactionId: string; amount?: number; reason?: string }) {
		return api.post<{ success: boolean }>('/payments/refund', payload).then(r => r.data);
	},
};


