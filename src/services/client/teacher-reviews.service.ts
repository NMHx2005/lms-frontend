import api from '../api';

export interface CourseReview {
    _id: string;
    studentId: {
        _id: string;
        firstName: string;
        lastName: string;
        avatar?: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
    updatedAt?: string;
    helpfulCount?: number;
    isHelpful?: boolean;
}

export interface TeacherResponse {
    _id: string;
    response: string;
    createdAt: string;
    updatedAt?: string;
}

export interface ReviewWithResponse extends CourseReview {
    teacherResponse?: TeacherResponse;
}

export interface ReviewStats {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
    recentReviews: number;
    responseRate: number;
}

export interface GetReviewsParams {
    page?: number;
    limit?: number;
    rating?: number;
    sortBy?: 'createdAt' | 'rating' | 'helpfulCount';
    sortOrder?: 'asc' | 'desc';
    search?: string;
}

/**
 * Get all reviews for a course
 */
export const getCourseReviews = async (courseId: string, params?: GetReviewsParams) => {
    const response = await api.get(`/client/ratings/course/${courseId}`, { params });
    return response.data;
};

/**
 * Get review statistics for a course
 */
export const getCourseReviewStats = async (courseId: string) => {
    const response = await api.get(`/client/ratings/stats/${courseId}`);
    return response.data;
};

/**
 * Create teacher response to a review
 */
export const createTeacherResponse = async (ratingId: string, responseText: string) => {
    const response = await api.post(`/client/teacher-response/${ratingId}`, {
        response: responseText
    });
    return response.data;
};

/**
 * Update teacher response
 */
export const updateTeacherResponse = async (responseId: string, responseText: string) => {
    const response = await api.put(`/client/teacher-response/${responseId}`, {
        response: responseText
    });
    return response.data;
};

/**
 * Delete teacher response
 */
export const deleteTeacherResponse = async (responseId: string) => {
    const response = await api.delete(`/client/teacher-response/${responseId}`);
    return response.data;
};

/**
 * Mark review as helpful
 */
export const markReviewAsHelpful = async (reviewId: string) => {
    const response = await api.post(`/client/ratings/${reviewId}/helpful`);
    return response.data;
};

/**
 * Report a review
 */
export const reportReview = async (reviewId: string, reason: string) => {
    const response = await api.post(`/client/ratings/${reviewId}/report`, { reason });
    return response.data;
};

