import api from '../api';

export interface Course {
    _id: string;
    title: string;
    description: string;
    shortDescription?: string;
    thumbnail?: string;
    domain: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    subcategory?: string;
    price: number;
    originalPrice?: number;
    discountPercentage?: number;
    status: 'draft' | 'published' | 'archived';
    isPublished: boolean;
    isApproved: boolean;
    isFeatured: boolean;
    submittedAt?: string;
    submittedForReview?: boolean;
    instructorId: string | {
        _id: string;
        email: string;
        name: string;
        fullName: string;
        subscriptionStatus: string;
        isPremium: boolean;
    };
    instructorName?: string;
    instructor?: {
        _id: string;
        name: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar?: string;
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
    maxStudents?: number;
    startDate?: string;
    endDate?: string;
    publishedAt?: string;
    approvedAt?: string;
    approvedBy?: string;
    createdAt: string;
    updatedAt: string;

    // Additional fields from detailed API response
    technicalRequirements?: {
        minBandwidth: number;
        recommendedBandwidth: number;
        supportedDevices: string[];
        requiredSoftware: string[];
        browserCompatibility: string[];
    };
    assessment?: {
        hasQuizzes: boolean;
        hasAssignments: boolean;
        hasFinalExam: boolean;
        hasCertification: boolean;
        passingScore: number;
        maxAttempts: number;
    };
    accessibility?: {
        hasSubtitles: boolean;
        hasAudioDescription: boolean;
        hasSignLanguage: boolean;
        supportsScreenReaders: boolean;
        hasHighContrast: boolean;
    };
    learningPath?: {
        isPartOfPath: boolean;
        prerequisites: string[];
        nextCourses: string[];
    };
    gamification?: {
        hasBadges: boolean;
        hasPoints: boolean;
        hasLeaderboard: boolean;
        hasAchievements: boolean;
        hasQuests: boolean;
    };
    socialLearning?: {
        hasDiscussionForums: boolean;
        hasGroupProjects: boolean;
        hasPeerReviews: boolean;
        hasStudyGroups: boolean;
        hasMentorship: boolean;
    };
    contentDelivery?: {
        deliveryMethod: string;
        hasLiveSessions: boolean;
        timezone: string;
        recordingPolicy: string;
    };
    support?: {
        hasInstructorSupport: boolean;
        hasCommunitySupport: boolean;
        hasTechnicalSupport: boolean;
        responseTime: string;
    };
    monetization?: {
        installmentPlan: {
            enabled: boolean;
        };
        pricingModel: string;
        hasFreeTrial: boolean;
        hasMoneyBackGuarantee: boolean;
    };
    analytics?: {
        viewCount: number;
        searchRanking: number;
        conversionRate: number;
        engagementScore: number;
        retentionRate: number;
        completionTime: number;
        dropoffPoints: string[];
        popularSections: string[];
    };
    seo?: {
        keywords: string[];
    };
    localization?: {
        originalLanguage: string;
        availableLanguages: string[];
        hasSubtitles: boolean;
        subtitleLanguages: string[];
        hasDubbing: boolean;
        dubbedLanguages: string[];
    };
    compliance?: {
        gdprCompliant: boolean;
        accessibilityCompliant: boolean;
        industryStandards: string[];
        certifications: string[];
        auditTrail: string[];
    };

    // Additional fields from API response
    learningObjectives?: string[];
    targetAudience?: string[];
    estimatedDuration?: number;
    externalLinks?: Array<{
        name: string;
        url: string;
        description: string;
        _id: string;
        id: string;
    }>;
    relatedLinks?: string[];
    ageGroup?: string;
    difficulty?: string;
    upvotes?: number;
    reports?: number;
    enrolledStudents?: string[];
    discountAmount?: number;
    isDiscounted?: boolean;
    detailedStatus?: string;
    canSubmitForReview?: boolean;
    isInReview?: boolean;
    needsAction?: boolean;
    canEnroll?: boolean;
    sections?: any[];
    lessons?: any[];
    assignments?: any[];
}

export interface CourseFilters {
    search?: string;
    status?: string;
    category?: string;
    level?: string;
    domain?: string;
    featured?: boolean;
    instructor?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface CourseStats {
    totalCourses: number;
    publishedCourses: number;
    pendingApproval: number;
    draftCourses: number;
    coursesByDomain: Array<{
        domain: string;
        count: number;
    }>;
    coursesByLevel: Array<{
        level: string;
        count: number;
    }>;
    averageRating: number;
    totalEnrollments: number;
    totalRevenue: number;
}

export interface SingleCourseAnalytics {
    viewCount: number;
    enrollmentCount: number;
    completionRate: number;
    averageRating: number;
    revenue: number;
    conversionRate: number;
}

export interface BulkStatusUpdate {
    courseIds: string[];
    status: string;
    comment?: string;
}

export interface CourseApproval {
    courseId: string;
    action: 'approve' | 'reject';
    comment?: string;
}

class CourseService {
    // Get all courses with pagination and filters
    async getCourses(filters: CourseFilters = {}) {
        const response = await api.get('/admin/courses', { params: filters });
        return response.data;
    }

    // Get course statistics
    async getCourseStats() {
        const response = await api.get('/admin/courses/stats');
        return response.data;
    }

    // Get pending course approvals
    async getPendingApprovals() {
        const response = await api.get('/admin/courses/pending-approvals');
        return response.data;
    }

    // Search courses
    async searchCourses(query: string, filters: CourseFilters = {}) {
        const response = await api.get('/admin/courses/search', {
            params: { q: query, ...filters }
        });
        return response.data;
    }

    // Get course by ID
    async getCourseById(courseId: string) {
        const response = await api.get(`/admin/courses/${courseId}`);
        return response.data;
    }

    // Create a new course
    async createCourse(courseData: Partial<Course>) {
        const response = await api.post('/admin/courses', courseData);
        return response.data;
    }

    // Update course
    async updateCourse(courseId: string, courseData: Partial<Course>) {
        const response = await api.put(`/admin/courses/${courseId}`, courseData);
        return response.data;
    }

    // Update course status only (without full validation)
    async updateCourseStatus(courseId: string, statusData: { isPublished?: boolean; isFeatured?: boolean; status?: string }) {
        const response = await api.patch(`/admin/courses/${courseId}/status`, statusData);
        return response.data;
    }

    // Delete course
    async deleteCourse(courseId: string) {
        const response = await api.delete(`/admin/courses/${courseId}`);
        return response.data;
    }

    // Approve/reject course
    async approveCourse(approvalData: CourseApproval) {
        const response = await api.patch('/admin/courses/approve', approvalData);
        return response.data;
    }

    // Bulk update course status
    async bulkUpdateCourseStatus(updateData: BulkStatusUpdate) {
        const response = await api.patch('/admin/courses/bulk-status', updateData);
        return response.data;
    }

    // Feature/unfeature course
    async toggleCourseFeature(courseId: string, isFeatured?: boolean) {
        const response = await api.patch(`/admin/courses/${courseId}/feature`, { isFeatured });
        return response.data;
    }

    // Get course enrollment statistics
    async getCourseEnrollmentStats(courseId: string) {
        const response = await api.get(`/admin/courses/${courseId}/enrollment-stats`);
        return response.data;
    }

    // Get course analytics
    async getCourseAnalytics(courseId: string): Promise<SingleCourseAnalytics> {
        const response = await api.get(`/admin/courses/${courseId}/analytics`);
        return response.data;
    }

    // Export courses to Excel
    async exportCourses(filters: CourseFilters = {}) {
        const response = await api.get('/admin/courses/export', {
            params: filters,
            responseType: 'blob'
        });
        return response;
    }

    // Duplicate course
    async duplicateCourse(courseId: string) {
        const response = await api.post(`/admin/courses/${courseId}/duplicate`);
        return response.data;
    }

    // Archive course
    async archiveCourse(courseId: string) {
        const response = await api.patch(`/admin/courses/${courseId}/archive`);
        return response.data;
    }

    // Restore course
    async restoreCourse(courseId: string) {
        const response = await api.patch(`/admin/courses/${courseId}/restore`);
        return response.data;
    }

    // Publish course
    // Note: publishCourse and unpublishCourse methods removed as they don't exist in backend
    // Use updateCourse with isPublished field instead

    // Get course categories
    async getCourseCategories() {
        const response = await api.get('/admin/courses/categories');
        return response.data;
    }

    // Get course domains
    async getCourseDomains() {
        const response = await api.get('/admin/courses/domains');
        return response.data;
    }

    // Get course tags
    async getCourseTags() {
        const response = await api.get('/admin/courses/tags');
        return response.data;
    }

    // Bulk delete courses
    async bulkDeleteCourses(courseIds: string[]) {
        const response = await api.delete('/admin/courses/bulk', {
            data: { courseIds }
        });
        return response.data;
    }

    // Bulk feature courses
    async bulkFeatureCourses(courseIds: string[]) {
        const response = await api.patch('/admin/courses/bulk-feature', {
            courseIds
        });
        return response.data;
    }

    // Bulk unfeature courses
    async bulkUnfeatureCourses(courseIds: string[]) {
        const response = await api.patch('/admin/courses/bulk-unfeature', {
            courseIds
        });
        return response.data;
    }
}

export default new CourseService();
