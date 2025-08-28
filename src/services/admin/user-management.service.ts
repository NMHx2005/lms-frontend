import api from '../api';

export const adminUserManagementService = {
  // Get All Users
  async getAllUsers(params: {
    page?: number;
    limit?: number;
    role?: string;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  // Create New User
  async createUser(data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
    profile?: {
      phoneNumber?: string;
      dateOfBirth?: string;
      gender?: string;
      country?: string;
      city?: string;
      bio?: string;
      expertise?: string[];
      socialLinks?: {
        linkedin?: string;
        github?: string;
      };
    };
    preferences?: {
      language?: string;
      timezone?: string;
      emailNotifications?: boolean;
      marketingEmails?: boolean;
    };
    sendWelcomeEmail?: boolean;
  }) {
    const response = await api.post('/admin/users', data);
    return response.data;
  },

  // Get User by ID
  async getUserById(userId: string, params?: {
    includeActivity?: boolean;
    includeEnrollments?: boolean;
    includePayments?: boolean;
  }) {
    const response = await api.get(`/admin/users/${userId}`, { params });
    return response.data;
  },

  // Update User
  async updateUser(userId: string, data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
    profile?: {
      phoneNumber?: string;
      bio?: string;
    };
    adminNotes?: string;
    notifyUser?: boolean;
  }) {
    const response = await api.put(`/admin/users/${userId}`, data);
    return response.data;
  },

  // Delete User
  async deleteUser(userId: string, data: {
    reason: string;
    retainData: boolean;
    notifyUser: boolean;
    transferContent?: string;
  }) {
    const response = await api.delete(`/admin/users/${userId}`, { data });
    return response.data;
  },

  // Bulk Update User Status
  async bulkUpdateUserStatus(data: {
    userIds: string[];
    status: string;
    reason: string;
    notifyUsers: boolean;
    sendEmail: boolean;
  }) {
    const response = await api.put('/admin/users/bulk/status', data);
    return response.data;
  },
};
