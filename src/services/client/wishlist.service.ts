import api from '../api';
import type { WishlistItem } from '../../types/index';

export interface WishlistResponse {
  success: boolean;
  data: WishlistItem[];
  message?: string;
  total?: number;
  page?: number;
  limit?: number;
}

export interface WishlistItemResponse {
  success: boolean;
  data: WishlistItem;
  message?: string;
}

export interface AddToWishlistRequest {
  courseId: string;
  notes?: string;
}

export interface UpdateWishlistRequest {
  notes?: string;
}

export const wishlistService = {
  // Get user's wishlist
  async getWishlist(params?: {
    page?: number;
    limit?: number;
    sortBy?: 'addedAt' | 'price' | 'rating' | 'title';
    sortOrder?: 'asc' | 'desc';
    category?: string;
    search?: string;
  }): Promise<WishlistResponse> {
    const response = await api.get('/client/wishlist', { params });
    return response.data;
  },

  // Add course to wishlist
  async addToWishlist(data: AddToWishlistRequest): Promise<WishlistItemResponse> {
    const response = await api.post('/client/wishlist', data);
    return response.data;
  },

  // Remove course from wishlist
  async removeFromWishlist(wishlistId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.delete(`/client/wishlist/${wishlistId}`);
    return response.data;
  },

  // Update wishlist item (e.g., notes)
  async updateWishlistItem(wishlistId: string, data: UpdateWishlistRequest): Promise<WishlistItemResponse> {
    const response = await api.put(`/client/wishlist/${wishlistId}`, data);
    return response.data;
  },

  // Check if course is in wishlist
  async isInWishlist(courseId: string): Promise<{ success: boolean; data: { isInWishlist: boolean; wishlistId?: string } }> {
    const response = await api.get(`/client/wishlist/check/${courseId}`);
    return response.data;
  },

  // Clear all wishlist items
  async clearWishlist(): Promise<{ success: boolean; message: string }> {
    const response = await api.delete('/client/wishlist/clear');
    return response.data;
  },

  // Move wishlist item to cart
  async moveToCart(wishlistId: string): Promise<{ success: boolean; message: string }> {
    const response = await api.post(`/client/wishlist/${wishlistId}/move-to-cart`);
    return response.data;
  },

  // Get wishlist statistics
  async getWishlistStats(): Promise<{
    success: boolean;
    data: {
      totalItems: number;
      totalValue: number;
      onSaleCount: number;
      categories: string[];
    };
  }> {
    const response = await api.get('/client/wishlist/stats');
    return response.data;
  }
};
