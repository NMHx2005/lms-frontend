import api from '../api';

export const clientPaymentsService = {
  // Payment History
  async getPaymentHistory(params: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    courseId?: string;
  }) {
    const response = await api.get('/client/payments/history', { params });
    return response.data;
  },

  async getPaymentById(paymentId: string) {
    const response = await api.get(`/client/payments/${paymentId}`);
    return response.data;
  },

  // Refund Requests
  async requestRefund(paymentId: string, data: {
    reason: string;
    amount: number;
    refundType: string;
    description: string;
    bankAccount: {
      accountNumber: string;
      bankName: string;
      accountHolder: string;
    };
  }) {
    const response = await api.post(`/client/payments/${paymentId}/refund`, data);
    return response.data;
  },

  async getRefundStatus(refundId: string) {
    const response = await api.get(`/client/payments/refunds/${refundId}`);
    return response.data;
  },

  // Payment Methods
  async getPaymentMethods() {
    const response = await api.get('/client/payments/methods');
    return response.data;
  },

  async addPaymentMethod(data: {
    type: string;
    cardNumber?: string;
    expiryMonth?: string;
    expiryYear?: string;
    cvv?: string;
    cardholderName?: string;
    bankAccountNumber?: string;
    bankName?: string;
    accountHolderName?: string;
    isDefault?: boolean;
  }) {
    const response = await api.post('/client/payments/methods', data);
    return response.data;
  },

  async updatePaymentMethod(methodId: string, data: {
    isDefault?: boolean;
    expiryMonth?: string;
    expiryYear?: string;
  }) {
    const response = await api.put(`/client/payments/methods/${methodId}`, data);
    return response.data;
  },

  async deletePaymentMethod(methodId: string) {
    const response = await api.delete(`/client/payments/methods/${methodId}`);
    return response.data;
  },

  // Invoices
  async getInvoices(params: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) {
    const response = await api.get('/client/payments/invoices', { params });
    return response.data;
  },

  async downloadInvoice(invoiceId: string, format: string) {
    const response = await api.get(`/client/payments/invoices/${invoiceId}/download`, {
      params: { format }
    });
    return response.data;
  },
};
