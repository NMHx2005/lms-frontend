import api from '../api';

export const sharedPaymentService = {
  // Payment Processing
  async createPayment(data: {
    courseId: string;
    amount: number;
    currency: string;
    description: string;
    returnUrl: string;
    cancelUrl: string;
    customerInfo: {
      email: string;
      phone: string;
      name: string;
    };
    orderInfo: {
      items: Array<{
        name: string;
        quantity: number;
        price: number;
      }>;
      discount: number;
      tax: number;
      shipping: number;
    };
  }) {
    const response = await api.post('/payments/create', data);
    return response.data;
  },

  async getPaymentHistory(params: {
    page?: number;
    limit?: number;
    status?: string;
    startDate?: string;
    endDate?: string;
    courseId?: string;
  }) {
    const response = await api.get('/payments/history', { params });
    return response.data;
  },

  async requestRefund(data: {
    paymentId: string;
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
    const response = await api.post('/payments/refund', data);
    return response.data;
  },

  // Shopping Cart
  async getCart() {
    const response = await api.get('/cart');
    return response.data;
  },

  async addCourseToCart(data: {
    courseId: string;
    quantity: number;
    couponCode?: string;
    giftRecipient?: string;
  }) {
    const response = await api.post('/cart/add', data);
    return response.data;
  },

  async updateCartItem(data: {
    courseId: string;
    quantity: number;
    couponCode?: string;
    removeItem?: boolean;
  }) {
    const response = await api.put('/cart/update', data);
    return response.data;
  },

  async removeCourseFromCart(courseId: string) {
    const response = await api.delete(`/cart/remove/${courseId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/cart/clear');
    return response.data;
  },

  async checkoutCart(data: {
    paymentMethod: string;
    couponCode?: string;
    billingAddress: {
      name: string;
      email: string;
      phone: string;
      address: string;
      city: string;
      country: string;
      zipCode: string;
    };
    saveAddress?: boolean;
  }) {
    const response = await api.post('/cart/checkout', data);
    return response.data;
  },

  async getCartTotal(params: {
    couponCode?: string;
    includeShipping?: boolean;
  }) {
    const response = await api.get('/cart/total', { params });
    return response.data;
  },
};
