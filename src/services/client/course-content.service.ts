import api from '../api';
import { getSectionsByCourse, getSectionsPreview } from './section.service';
import { getLessonsBySection } from './lesson.service';

export interface CourseContent {
    courseId: string;
    sections: SectionWithLessons[];
    totalLessons: number;
    totalDuration: number;
}

export interface SectionWithLessons {
    _id: string;
    title: string;
    description?: string;
    order: number;
    isPublished: boolean;
    duration?: number;
    lessons: LessonContent[];
    isExpanded?: boolean;
}

export interface QuizQuestion {
    id: string;
    question: string;
    answers: string[];
    correctAnswer: number;
    explanation?: string;
}

export interface AssignmentDetails {
    instructions: string;
    dueDate?: string;
    maxScore?: number;
    submissionType?: 'text' | 'file' | 'both';
}

export interface LessonContent {
    _id: string;
    title: string;
    description?: string;
    type: 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment';
    content?: string;
    videoUrl?: string;
    fileUrl?: string;
    linkUrl?: string;
    externalLink?: string;
    duration: number;
    estimatedTime?: number;
    order: number;
    isPublished: boolean;
    isFree?: boolean;
    isRequired?: boolean;
    isCompleted?: boolean;
    isLocked?: boolean;
    attachments?: Array<{
        name: string;
        url: string;
        type: string;
        size: number;
    }>;
    quizQuestions?: QuizQuestion[];
    assignmentDetails?: AssignmentDetails;
}

export interface LessonProgress {
    lessonId: string;
    courseId: string;
    studentId: string;
    isCompleted: boolean;
    completedAt?: string;
    progress?: number; // For video lessons, 0-100
    lastPosition?: number; // For video lessons, position in seconds
}

export const courseContentService = {
    /**
     * Get complete course content with sections and lessons
     * @param courseId - Course ID
     * @param silentFail - If true, will not show error toast (useful for checking enrollment status)
     */
    async getCourseContent(courseId: string, silentFail: boolean = false): Promise<{
        success: boolean;
        data?: CourseContent;
        error?: string;
    }> {
        try {
            // Get sections for the course
            const sectionsResponse = silentFail
                ? await api.get(`/client/sections/course/${courseId}`, { suppressErrorToast: true } as any).then(res => res.data).catch(() => ({ success: false }))
                : await getSectionsByCourse(courseId);

            if (!sectionsResponse.success || !sectionsResponse.data) {
                return {
                    success: false,
                    error: 'Không thể tải danh sách phần học'
                };
            }

            const sections = sectionsResponse.data;
            const sectionsWithLessons: SectionWithLessons[] = [];

            // Get lessons for each section
            for (const section of sections) {
                const lessonsResponse = await getLessonsBySection(section._id);

                if (lessonsResponse.success && lessonsResponse.data) {
                    const lessons: LessonContent[] = lessonsResponse.data.map((lesson: any) => ({
                        _id: lesson._id,
                        title: lesson.title,
                        description: lesson.description,
                        type: lesson.type,
                        content: lesson.content,
                        videoUrl: lesson.videoUrl,
                        fileUrl: lesson.fileUrl,
                        linkUrl: lesson.linkUrl,
                        externalLink: lesson.externalLink,
                        duration: lesson.duration,
                        estimatedTime: lesson.estimatedTime,
                        order: lesson.order,
                        isPublished: lesson.isPublished,
                        isFree: lesson.isFree,
                        isRequired: lesson.isRequired,
                        isCompleted: lesson.progress?.isCompleted || false, // Get from API progress data
                        isLocked: false, // Will be updated based on course structure
                        attachments: lesson.attachments,
                        quizQuestions: lesson.quizQuestions,
                        assignmentDetails: lesson.assignmentDetails
                    }));

                    // Sort lessons by order
                    lessons.sort((a, b) => a.order - b.order);

                    sectionsWithLessons.push({
                        _id: section._id,
                        title: section.title,
                        description: section.description,
                        order: section.order,
                        isPublished: section.isPublished,
                        duration: section.duration,
                        lessons,
                        isExpanded: section.order === 1 // Expand first section by default
                    });
                }
            }

            // Sort sections by order
            sectionsWithLessons.sort((a, b) => a.order - b.order);

            // Calculate totals
            const totalLessons = sectionsWithLessons.reduce((acc, section) => acc + section.lessons.length, 0);
            const totalDuration = sectionsWithLessons.reduce((acc, section) =>
                acc + section.lessons.reduce((sectionAcc, lesson) => sectionAcc + lesson.duration, 0), 0
            );

            // Set lesson locked status (first lesson is always unlocked)
            let isFirstLesson = true;
            sectionsWithLessons.forEach(section => {
                section.lessons.forEach(lesson => {
                    if (isFirstLesson) {
                        lesson.isLocked = false;
                        isFirstLesson = false;
                    } else {
                        // For now, unlock all lessons. In a real app, this would depend on completion status
                        lesson.isLocked = false;
                    }
                });
            });

            return {
                success: true,
                data: {
                    courseId,
                    sections: sectionsWithLessons,
                    totalLessons,
                    totalDuration
                }
            };
        } catch (error) {
            console.error('Error fetching course content:', error);
            return {
                success: false,
                error: 'Lỗi khi tải nội dung khóa học'
            };
        }
    },

    /**
     * Get lesson progress for a student
     */
    async getLessonProgress(courseId: string, lessonId: string): Promise<{
        success: boolean;
        data?: LessonProgress;
        error?: string;
    }> {
        try {
            const response = await api.get(`/client/progress/course/${courseId}/lesson/${lessonId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching lesson progress:', error);
            return {
                success: false,
                error: 'Lỗi khi tải tiến độ bài học'
            };
        }
    },

    /**
     * Mark lesson as completed
     */
    async markLessonCompleted(courseId: string, lessonId: string): Promise<{
        success: boolean;
        data?: any;
        error?: string;
    }> {
        try {
            const response = await api.post(`/client/progress/course/${courseId}/lesson/${lessonId}/complete`);
            return response.data;
        } catch (error) {
            console.error('Error marking lesson as completed:', error);
            return {
                success: false,
                error: 'Lỗi khi đánh dấu hoàn thành bài học'
            };
        }
    },

    /**
     * Update lesson progress (for video lessons)
     */
    async updateLessonProgress(courseId: string, lessonId: string, progress: number, lastPosition?: number): Promise<{
        success: boolean;
        data?: any;
        error?: string;
    }> {
        try {
            const response = await api.patch(`/client/progress/course/${courseId}/lesson/${lessonId}`, {
                progress,
                lastPosition
            });
            return response.data;
        } catch (error) {
            console.error('Error updating lesson progress:', error);
            return {
                success: false,
                error: 'Lỗi khi cập nhật tiến độ bài học'
            };
        }
    },

    /**
     * Get course progress summary
     */
    async getCourseProgress(courseId: string): Promise<{
        success: boolean;
        data?: {
            courseId: string;
            totalLessons: number;
            completedLessons: number;
            progress: number;
            lastActivityAt?: string;
        };
        error?: string;
    }> {
        try {
            const response = await api.get(`/client/progress/course/${courseId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching course progress:', error);
            return {
                success: false,
                error: 'Lỗi khi tải tiến độ khóa học'
            };
        }
    },

    /**
     * Get course content preview (public - no enrollment required)
     * Shows course structure without sensitive content
     */
    async getCourseContentPreview(courseId: string): Promise<{
        success: boolean;
        data?: CourseContent;
        error?: string;
    }> {
        try {
            // Get sections preview (public endpoint - no enrollment required)
            const sectionsResponse = await getSectionsPreview(courseId);

            if (!sectionsResponse.success || !sectionsResponse.data) {
                return {
                    success: false,
                    error: 'Không thể tải cấu trúc khóa học'
                };
            }

            const sections: any[] = sectionsResponse.data;

            // Map sections to the expected format
            const sectionsWithLessons: SectionWithLessons[] = sections.map((section: any) => ({
                _id: section._id,
                title: section.title,
                description: section.description,
                order: section.order,
                isPublished: true,
                duration: section.totalDuration || 0,
                lessons: (section.lessons || []).map((lesson: any) => ({
                    _id: lesson._id,
                    title: lesson.title,
                    description: '',
                    type: lesson.type,
                    duration: lesson.duration || 0,
                    estimatedTime: lesson.duration || 0,
                    order: lesson.order,
                    isPublished: true,
                    isFree: lesson.isPreview || false,
                    isRequired: false,
                    isCompleted: false,
                    isLocked: !lesson.isPreview, // Lock lessons that are not preview
                    content: '',
                    // No videoUrl, fileUrl, or linkUrl for security
                })),
                isExpanded: false
            }));

            // Calculate totals
            const totalLessons = sectionsWithLessons.reduce((sum, section) => sum + section.lessons.length, 0);
            const totalDuration = sectionsWithLessons.reduce((sum, section) => sum + (section.duration || 0), 0);

            return {
                success: true,
                data: {
                    courseId,
                    sections: sectionsWithLessons,
                    totalLessons,
                    totalDuration
                }
            };
        } catch (error) {
            console.error('Error fetching course content preview:', error);
            return {
                success: false,
                error: 'Lỗi khi tải cấu trúc khóa học'
            };
        }
    }
};
