import api from '../api';

export const sharedPaymentWebhooksService = {
  // Payment Return/Redirect
  async handlePaymentReturn(query: Record<string, any>) {
    const response = await api.get('/payments/return', { params: query });
    return response.data;
  },

  // Payment IPN (Instant Payment Notification)
  async handlePaymentIpn(payload: any) {
    const response = await api.post('/payments/ipn', payload);
    return response.data;
  },

  // Payment Webhook Verification
  async verifyWebhookSignature(payload: any, signature: string, timestamp: string) {
    const response = await api.post('/payments/verify-webhook', {
      payload,
      signature,
      timestamp
    });
    return response.data;
  },

  // Payment Status Check
  async checkPaymentStatus(transactionId: string) {
    const response = await api.get(`/payments/status/${transactionId}`);
    return response.data;
  },

  // Payment Reconciliation
  async reconcilePayments(data: {
    startDate: string;
    endDate: string;
    paymentMethod?: string;
    status?: string;
  }) {
    const response = await api.post('/payments/reconcile', data);
    return response.data;
  },
};
