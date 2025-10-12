import { clientAuthService } from './auth.service';
import api from '../api';

export interface ProgressOverview {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalLessons: number;
    completedLessons: number;
    overallProgress: number;
    certificates: Certificate[];
    recentActivities: RecentActivity[];
    courses: CourseProgress[];
}

export interface CourseProgress {
    _id: string;
    courseId: string;
    courseTitle: string;
    courseThumbnail: string;
    progress: number;
    enrolledAt: string;
    lastActivityAt: string;
    isCompleted: boolean;
    isActive: boolean;
    totalLessons: number;
    completedLessons: number;
}

export interface Certificate {
    _id: string; // enrollmentId
    courseId: string;
    courseTitle: string;
    issuedAt: string;
    downloadUrl: string;
    certificateNumber: string;
    category?: string;
}

export interface RecentActivity {
    type: 'lesson_completed' | 'course_completed' | 'certificate_issued';
    title: string;
    subtitle: string;
    time: string;
    courseId?: string;
    icon: 'check' | 'trophy' | 'book';
    color: 'success' | 'warning' | 'info';
}

export const progressService = {
    /**
     * Get overall progress overview by aggregating multiple APIs
     */
    async getOverview(): Promise<ProgressOverview> {
        try {
            // Fetch all data in parallel
            const [enrollmentsResponse, certificatesResponse] = await Promise.all([
                clientAuthService.getEnrolledCourses({ limit: 100 }),
                this.getCertificates()
            ]);

            const enrollments = enrollmentsResponse.data?.enrollments || [];
            const certificates = certificatesResponse.data || [];

            // Calculate stats from enrollments
            const totalCourses = enrollments.length;
            const completedCourses = enrollments.filter((e: any) => e.isCompleted).length;
            const inProgressCourses = enrollments.filter((e: any) => e.isActive && !e.isCompleted).length;

            // Calculate lessons stats
            let totalLessons = 0;
            let completedLessons = 0;

            enrollments.forEach((enrollment: any) => {
                if (enrollment.courseId?.totalLessons) {
                    totalLessons += enrollment.courseId.totalLessons;
                    // Calculate completed lessons based on progress percentage
                    const progress = enrollment.progress || 0;
                    completedLessons += Math.floor((progress / 100) * enrollment.courseId.totalLessons);
                }
            });

            // Calculate overall progress
            const overallProgress = totalLessons > 0
                ? Math.round((completedLessons / totalLessons) * 100)
                : 0;

            // Generate recent activities from enrollments
            const recentActivities = this.generateRecentActivities(enrollments, certificates);

            // Map enrollments to courses
            const courses: CourseProgress[] = enrollments.map((enrollment: any) => ({
                _id: enrollment._id,
                courseId: enrollment.courseId?._id || '',
                courseTitle: enrollment.courseId?.title || 'N/A',
                courseThumbnail: enrollment.courseId?.thumbnail || '',
                progress: enrollment.progress || 0,
                enrolledAt: enrollment.enrolledAt,
                lastActivityAt: enrollment.lastActivityAt,
                isCompleted: enrollment.isCompleted || false,
                isActive: enrollment.isActive || false,
                totalLessons: enrollment.courseId?.totalLessons || 0,
                completedLessons: Math.floor(((enrollment.progress || 0) / 100) * (enrollment.courseId?.totalLessons || 0))
            }));

            return {
                totalCourses,
                completedCourses,
                inProgressCourses,
                totalLessons,
                completedLessons,
                overallProgress,
                certificates,
                recentActivities,
                courses
            };
        } catch (error) {
            console.error('Error fetching progress overview:', error);
            throw error;
        }
    },

    /**
     * Get user's certificates
     */
    async getCertificates(): Promise<{ success: boolean; data: Certificate[] }> {
        try {
            const response = await api.get('/client/certificates');
            return response.data;
        } catch (error) {
            console.error('Error fetching certificates:', error);
            return { success: false, data: [] };
        }
    },

    /**
     * Download certificate PDF
     */
    async downloadCertificate(enrollmentId: string): Promise<Blob> {
        const response = await api.get(`/client/certificates/${enrollmentId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    },

    /**
     * Verify certificate
     */
    async verifyCertificate(certificateNumber: string): Promise<{
        success: boolean;
        data: {
            valid: boolean;
            message?: string;
            certificateNumber?: string;
            studentName?: string;
            courseTitle?: string;
            completedAt?: Date;
            issuedAt?: Date;
        };
    }> {
        const response = await api.get(`/client/certificates/verify/${certificateNumber}`);
        return response.data;
    },

    /**
     * Generate recent activities from enrollments and certificates
     */
    generateRecentActivities(enrollments: any[], certificates: Certificate[]): RecentActivity[] {
        const activities: RecentActivity[] = [];

        // Add recent certificate activities
        certificates
            .sort((a, b) => new Date(b.issuedAt).getTime() - new Date(a.issuedAt).getTime())
            .slice(0, 3)
            .forEach(cert => {
                activities.push({
                    type: 'certificate_issued',
                    title: `Nhận chứng chỉ "${cert.courseTitle}"`,
                    subtitle: `Certificate No: ${cert.certificateNumber}`,
                    time: this.formatTimeAgo(cert.issuedAt),
                    courseId: cert.courseId,
                    icon: 'trophy',
                    color: 'warning'
                });
            });

        // Add recent completed courses
        enrollments
            .filter((e: any) => e.isCompleted && e.completedAt)
            .sort((a: any, b: any) =>
                new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
            )
            .slice(0, 2)
            .forEach((enrollment: any) => {
                activities.push({
                    type: 'course_completed',
                    title: `Hoàn thành khóa học "${enrollment.courseId?.title || 'N/A'}"`,
                    subtitle: `Tiến độ: 100%`,
                    time: this.formatTimeAgo(enrollment.completedAt),
                    courseId: enrollment.courseId?._id,
                    icon: 'check',
                    color: 'success'
                });
            });

        // Add recent activities from in-progress courses
        enrollments
            .filter((e: any) => e.isActive && !e.isCompleted && e.lastActivityAt)
            .sort((a: any, b: any) =>
                new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
            )
            .slice(0, 2)
            .forEach((enrollment: any) => {
                activities.push({
                    type: 'lesson_completed',
                    title: `Đang học "${enrollment.courseId?.title || 'N/A'}"`,
                    subtitle: `Tiến độ: ${enrollment.progress || 0}%`,
                    time: this.formatTimeAgo(enrollment.lastActivityAt),
                    courseId: enrollment.courseId?._id,
                    icon: 'book',
                    color: 'info'
                });
            });

        // Sort all activities by time and return top 5
        return activities
            .sort((a, b) => {
                // Extract numeric value from time string for sorting
                const getTimeValue = (timeStr: string) => {
                    const match = timeStr.match(/(\d+)/);
                    return match ? parseInt(match[1]) : 999;
                };
                return getTimeValue(a.time) - getTimeValue(b.time);
            })
            .slice(0, 5);
    },

    /**
     * Format time ago
     */
    formatTimeAgo(dateString: string): string {
        const now = new Date();
        const date = new Date(dateString);
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return diffMins <= 1 ? 'Vừa xong' : `${diffMins} phút trước`;
        } else if (diffHours < 24) {
            return `${diffHours} giờ trước`;
        } else if (diffDays < 30) {
            return `${diffDays} ngày trước`;
        } else {
            const diffMonths = Math.floor(diffDays / 30);
            return `${diffMonths} tháng trước`;
        }
    }
};

