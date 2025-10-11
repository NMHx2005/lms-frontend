import api from '../api';

export interface StudentOverview {
    totalStudents: number;
    activeStudents: number;
    completedCourses: number;
    averageProgress: number;
    retentionRate: number;
}

export interface Demographics {
    ageGroups: Array<{ age: string; count: number; percentage: number }>;
    countries: Array<{ country: string; count: number; percentage: number }>;
}

export interface ProgressData {
    courseName: string;
    averageProgress: number;
    studentsStarted: number;
    studentsCompleted: number;
    completionRate: number;
}

export interface RetentionData {
    month: string;
    enrolled: number;
    active: number;
    completed: number;
    retentionRate: number;
}

export interface SatisfactionData {
    overall: {
        averageRating: number;
        totalRatings: number;
    };
    byCourse: Array<{
        courseId: string;
        courseName: string;
        averageRating: number;
        totalRatings: number;
        satisfactionLevel: string;
    }>;
}

export interface ActivityData {
    recentActivity: Array<{
        studentId: string;
        studentName: string;
        courseId: string;
        courseName: string;
        progress: number;
        lastActivity: Date;
        isCompleted: boolean;
        totalTimeSpent: number;
    }>;
    dailyActivity: Array<{
        date: Date;
        activeStudents: number;
    }>;
}

/**
 * Get student analytics overview
 */
export const getStudentOverview = async () => {
    const response = await api.get('/client/analytics/students/overview');
    return response.data;
};

/**
 * Get student demographics
 */
export const getStudentDemographics = async () => {
    const response = await api.get('/client/analytics/students/demographics');
    return response.data;
};

/**
 * Get student progress
 */
export const getStudentProgress = async () => {
    const response = await api.get('/client/analytics/students/progress');
    return response.data;
};

/**
 * Get student retention rate
 */
export const getStudentRetention = async () => {
    const response = await api.get('/client/analytics/students/retention');
    return response.data;
};

/**
 * Get student satisfaction
 */
export const getStudentSatisfaction = async () => {
    const response = await api.get('/client/analytics/students/satisfaction');
    return response.data;
};

/**
 * Get student activity
 */
export const getStudentActivity = async (timeRange?: '7days' | '30days' | '90days') => {
    const response = await api.get('/client/analytics/students/activity', {
        params: { timeRange }
    });
    return response.data;
};

