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
    id?: string;
    question: string;
    type?: string;
    answers: string[];
    correctAnswer: number | number[] | string | any;
    explanation?: string;
    points?: number;
    difficulty?: string;
}

export interface AssignmentDetails {
    instructions: string;
    dueDate?: string;
    maxScore?: number;
    submissionType?: 'text' | 'file' | 'both';
    allowLateSubmission?: boolean;
    latePenalty?: number;
    timeLimit?: number;
    attempts?: number;
}

export interface LessonContent {
    _id: string;
    title: string;
    description?: string;
    type: 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment';
    content?: string;
    videoUrl?: string;
    fileUrl?: string;
    fileSize?: number;
    fileType?: string;
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
    quizSettings?: {
        timeLimit?: number;
        timeLimitPerQuestion?: number;
        allowPause?: boolean;
        maxAttempts?: number;
        scoreCalculation?: 'best' | 'average' | 'last';
        cooldownPeriod?: number;
        passingScore?: number;
        negativeMarking?: boolean;
        negativeMarkingPercentage?: number;
        partialCredit?: boolean;
        randomizeQuestions?: boolean;
        randomizeAnswers?: boolean;
        questionPool?: number;
        immediateFeedback?: boolean;
        showCorrectAnswers?: boolean;
        showExplanation?: boolean;
        showScoreBreakdown?: boolean;
        showClassAverage?: boolean;
    };
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
    async getCourseContent(courseId: string, silentFail: boolean = false, previewMode: boolean = false): Promise<{
        success: boolean;
        data?: CourseContent;
        error?: string;
    }> {
        try {
            console.log('🚀 getCourseContent called:', {
                courseId,
                previewMode,
                silentFail
            });
            
            // Get sections for the course
            const sectionsResponse = silentFail
                ? await api.get(`/client/sections/course/${courseId}`, { 
                    params: previewMode ? { preview: 'true' } : {},
                    suppressErrorToast: true 
                  } as any).then(res => res.data).catch(() => ({ success: false }))
                : await getSectionsByCourse(courseId, previewMode);
            
            console.log('📦 Sections response:', {
                success: sectionsResponse.success,
                sectionsCount: sectionsResponse.data?.length || 0,
                previewMode
            });

            if (!sectionsResponse.success || !sectionsResponse.data) {
                return {
                    success: false,
                    error: 'Không thể tải danh sách phần học'
                };
            }

            const sections = sectionsResponse.data;
            const sectionsWithLessons: SectionWithLessons[] = [];

            console.log('🔍 getCourseContent debug:', {
                previewMode,
                sectionsCount: sections.length,
                firstSection: sections[0] ? {
                    id: sections[0]._id,
                    title: sections[0].title,
                    hasLessons: !!sections[0].lessons,
                    lessonsCount: sections[0].lessons?.length || 0,
                    lessons: sections[0].lessons?.map((l: any) => ({
                        id: l._id,
                        title: l.title,
                        isPreview: l.isPreview
                    })) || []
                } : null
            });

            // Get lessons for each section
            // In preview mode, use lessons already populated in sections (don't call getLessonsBySection which requires enrollment)
            // In normal mode, call getLessonsBySection to get full lesson details
            for (const section of sections) {
                let lessons: LessonContent[] = [];

                if (previewMode) {
                    // In preview mode, use lessons from populated sections
                    // These lessons have limited fields (no content, videoUrl for security)
                    console.log('👁️ Preview mode - section:', {
                        sectionId: section._id,
                        sectionTitle: section.title,
                        hasLessons: !!section.lessons,
                        lessonsCount: section.lessons?.length || 0,
                        allLessons: section.lessons?.map((l: any) => ({
                            id: l._id,
                            title: l.title,
                            isPreview: l.isPreview
                        })) || []
                    });
                    
                    // IMPORTANT: Filter to only include preview lessons in preview mode
                    const previewLessons = (section.lessons || []).filter((lesson: any) => lesson.isPreview === true);
                    
                    console.log('🔒 Filtered preview lessons:', {
                        beforeFilter: section.lessons?.length || 0,
                        afterFilter: previewLessons.length,
                        previewLessons: previewLessons.map((l: any) => ({
                            id: l._id,
                            title: l.title,
                            isPreview: l.isPreview
                        }))
                    });
                    
                    if (previewLessons.length > 0) {
                        lessons = previewLessons.map((lesson: any) => {
                            // In preview mode: allow YouTube URLs (always public)
                            // Also allow Cloudinary URLs if lesson is marked as isPreview (instructor explicitly allows preview)
                            const videoUrl = lesson.videoUrl || '';
                            const isYouTubeUrl = videoUrl && (
                                videoUrl.includes('youtube.com') || 
                                videoUrl.includes('youtu.be')
                            );
                            const isCloudinaryUrl = videoUrl && videoUrl.includes('cloudinary.com');
                            
                            // Allow YouTube URLs always, and Cloudinary URLs if lesson is marked as preview
                            // If instructor marked lesson as isPreview, they want to allow preview access
                            const safeVideoUrl = (isYouTubeUrl || (isCloudinaryUrl && lesson.isPreview)) ? videoUrl : '';
                            
                            // Always log for debugging (even if videoUrl is empty)
                            console.log('🔒 Preview lesson videoUrl processing:', {
                                lessonId: lesson._id,
                                lessonTitle: lesson.title,
                                lessonType: lesson.type,
                                isPreview: lesson.isPreview,
                                originalVideoUrl: videoUrl || '(empty)',
                                isYouTubeUrl,
                                isCloudinaryUrl,
                                safeVideoUrl: safeVideoUrl || '(empty)',
                                note: videoUrl 
                                    ? (isYouTubeUrl ? 'YouTube URL allowed' : 
                                       (isCloudinaryUrl && lesson.isPreview ? 'Cloudinary URL allowed (isPreview=true)' : 
                                        'URL blocked in preview'))
                                    : 'No videoUrl in lesson data'
                            });
                            
                            return {
                                _id: lesson._id,
                                title: lesson.title,
                                description: '',
                                type: lesson.type,
                                content: '', // No content in preview mode
                                videoUrl: safeVideoUrl, // Only YouTube URLs allowed in preview
                                fileUrl: '', // No fileUrl in preview mode (Cloudinary URLs are sensitive)
                                linkUrl: lesson.externalLink || '', // Allow external links
                                externalLink: lesson.externalLink || '', // Allow external links
                                duration: lesson.duration || lesson.estimatedTime || 0,
                                estimatedTime: lesson.estimatedTime || lesson.duration || 0,
                                order: lesson.order,
                                isPublished: lesson.isPublished !== false,
                                isFree: lesson.isPreview || false,
                                isRequired: lesson.isRequired || false,
                                isCompleted: false,
                                isLocked: false, // Preview lessons are unlocked
                                attachments: [],
                                quizQuestions: lesson.type === 'quiz' ? [] : undefined, // No quiz questions in preview
                                quizSettings: undefined, // No quiz settings in preview
                                assignmentDetails: undefined // No assignment details in preview
                            };
                        });
                    }
                } else {
                    // Normal mode: get full lesson details from getLessonsBySection
                    const lessonsResponse = await getLessonsBySection(section._id);

                    if (lessonsResponse.success && lessonsResponse.data) {
                        lessons = lessonsResponse.data.map((lesson: any) => ({
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
                            quizSettings: lesson.quizSettings, // ← ADDED: quiz settings for shuffle, time limit, etc.
                            assignmentDetails: lesson.assignmentDetails
                        }));
                    }
                }

                // Sort lessons by order
                lessons.sort((a, b) => a.order - b.order);

                if (lessons.length > 0 || !previewMode) {
                    sectionsWithLessons.push({
                        _id: section._id,
                        title: section.title,
                        description: section.description,
                        order: section.order,
                        isPublished: section.isPublished !== false,
                        duration: section.duration || 0,
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
