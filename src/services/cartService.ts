import api from './api';
import { Cart } from './types';

export const cartService = {
	get() {
		return api.get<Cart>('/cart').then(r => r.data);
	},
	add(payload: { courseId: string; quantity?: number; couponCode?: string }) {
		return api.post<Cart>('/cart/add', payload).then(r => r.data);
	},
	update(payload: { items?: Array<{ courseId: string; quantity: number }>; couponCode?: string }) {
		return api.put<Cart>('/cart/update', payload).then(r => r.data);
	},
	remove(courseId: string) {
		return api.delete<Cart>(`/cart/remove/${courseId}`).then(r => r.data);
	},
	clear() {
		return api.delete<Cart>('/cart/clear').then(r => r.data);
	},
	checkout(payload: any) {
		return api.post<{ redirectUrl?: string; success?: boolean }>('/cart/checkout', payload).then(r => r.data);
	},
	total(params?: Record<string, any>) {
		return api.get<{ subtotal: number; discount?: number; total: number }>('/cart/total', { params }).then(r => r.data);
	},
};


