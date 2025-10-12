import api from '../api';

export interface CourseRating {
    _id: string;
    studentId: string;
    courseId: {
        _id: string;
        title: string;
        thumbnail?: string;
    };
    rating: number;
    title: string;
    content: string;
    review?: string; // deprecated, use content
    isPublic: boolean;
    helpfulCount: number;
    createdAt: string;
    updatedAt: string;
}

export interface RatingStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    helpfulVotesReceived: number;
    coursesReviewed: number;
}

export const ratingService = {
    /**
     * Get user's own reviews
     */
    async getMyReviews(params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        success: boolean;
        data: CourseRating[];
        pagination?: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }> {
        const response = await api.get('/client/course-ratings/my-reviews', { params });
        return response.data;
    },

    /**
     * Get user's review statistics
     */
    async getMyReviewStats(): Promise<{
        success: boolean;
        data: RatingStats;
    }> {
        const response = await api.get('/client/course-ratings/my-reviews/stats');
        return response.data;
    },

    /**
     * Create review for a course
     */
    async createReview(courseId: string, data: {
        rating: number;
        title: string;
        content: string;
        review?: string;
        isPublic?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        data: CourseRating;
    }> {
        const response = await api.post(`/client/course-ratings/courses/${courseId}/reviews`, data);
        return response.data;
    },

    /**
     * Get user's review for a specific course
     */
    async getMyReviewForCourse(courseId: string): Promise<{
        success: boolean;
        data: CourseRating | null;
    }> {
        const response = await api.get(`/client/course-ratings/courses/${courseId}/my-review`);
        return response.data;
    },

    /**
     * Update review
     */
    async updateReview(reviewId: string, data: {
        rating?: number;
        title?: string;
        content?: string;
        review?: string;
        isPublic?: boolean;
    }): Promise<{
        success: boolean;
        message: string;
        data: CourseRating;
    }> {
        const response = await api.put(`/client/course-ratings/reviews/${reviewId}`, data);
        return response.data;
    },

    /**
     * Delete review
     */
    async deleteReview(reviewId: string): Promise<{
        success: boolean;
        message: string;
    }> {
        const response = await api.delete(`/client/course-ratings/reviews/${reviewId}`);
        return response.data;
    },

    /**
     * Get course reviews (for viewing)
     */
    async getCourseReviews(courseId: string, params?: {
        page?: number;
        limit?: number;
        sortBy?: string;
    }): Promise<{
        success: boolean;
        data: CourseRating[];
        pagination?: any;
    }> {
        const response = await api.get(`/client/course-ratings/courses/${courseId}/reviews`, { params });
        return response.data;
    },

    /**
     * Get course rating summary
     */
    async getCourseSummary(courseId: string): Promise<{
        success: boolean;
        data: {
            averageRating: number;
            totalReviews: number;
            ratingDistribution: any;
        };
    }> {
        const response = await api.get(`/client/course-ratings/courses/${courseId}/summary`);
        return response.data;
    }
};

