import api from '../api';

export interface CourseModeration {
    _id: string;
    title: string;
    description: string;
    shortDescription?: string;
    thumbnail?: string;
    domain: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    price: number;
    originalPrice?: number;
    status: 'draft' | 'submitted' | 'approved' | 'published' | 'rejected' | 'needs_revision' | 'delisted';
    isPublished: boolean;
    isApproved: boolean;
    submittedAt?: string;
    submittedForReview?: boolean;
    instructorId: string | {
        _id: string;
        email: string;
        name: string;
        fullName: string;
    };
    instructorName?: string;
    instructor?: {
        _id: string;
        name: string;
        email: string;
    };
    totalStudents: number;
    totalLessons: number;
    totalDuration: number;
    averageRating: number;
    totalRatings: number;
    completionRate: number;
    tags: string[];
    prerequisites?: string[];
    benefits?: string[];
    language: string;
    certificate: boolean;
    createdAt: string;
    updatedAt: string;
    approvedAt?: string;
    approvedBy?: string;
}

export interface CourseModerationFilters {
    search?: string;
    status?: string;
    category?: string;
    level?: string;
    domain?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface CourseModerationStats {
    totalCourses: number;
    pendingApproval: number;
    approvedCourses?: number;
    publishedCourses?: number;  // Đã duyệt
    rejectedCourses?: number;
    draftCourses?: number;       // Nháp
    coursesByDomain?: Array<{
        domain: string;
        count: number;
    }>;
    coursesByLevel?: Array<{
        level: string;
        count: number;
    }>;
    averageRating?: number;
    totalEnrollments?: number;
    totalRevenue?: number;
}

export interface CourseApprovalRequest {
    courseId: string;
    approved: boolean;  // true = approve, false = reject
    feedback?: string;  // Comment/feedback
}

class CourseModerationService {
    // Get pending course approvals
    async getPendingApprovals(filters: CourseModerationFilters = {}) {
        const response = await api.get('/admin/courses/pending-approvals', { params: filters });
        return response.data;
    }

    // Get all courses for moderation with pagination and filters
    async getCoursesForModeration(filters: CourseModerationFilters = {}) {
        const response = await api.get('/admin/courses', {
            params: {
                ...filters,
                // Only get courses that are submitted for review
                submittedForReview: true
            }
        });
        return response.data;
    }

    // Get course moderation statistics
    async getModerationStats() {
        const response = await api.get('/admin/courses/stats');
        return response.data;
    }

    // Approve/reject course
    async approveCourse(approvalData: CourseApprovalRequest) {
        const response = await api.patch('/admin/courses/approve', approvalData);
        return response.data;
    }

    // Get course by ID for moderation
    async getCourseById(courseId: string) {
        const response = await api.get(`/admin/courses/${courseId}`);
        return response.data;
    }

    // Bulk approve/reject courses
    async bulkApproveCourses(courseIds: string[], approved: boolean, feedback?: string) {
        const promises = courseIds.map(courseId =>
            this.approveCourse({ courseId, approved, feedback })
        );
        return Promise.all(promises);
    }

    // Export courses for moderation
    async exportCourses(filters: CourseModerationFilters = {}) {
        const response = await api.get('/admin/courses/export', {
            params: {
                ...filters,
                submittedForReview: true
            },
            responseType: 'blob'
        });
        return response;
    }

    // Search courses for moderation
    async searchCourses(query: string, filters: CourseModerationFilters = {}) {
        const response = await api.get('/admin/courses/search', {
            params: { q: query, ...filters }
        });
        return response.data;
    }
}

export default new CourseModerationService();
