import api from '../api';

// Analytics Overview
export const getAnalyticsOverview = async () => {
    const response = await api.get('/client/earnings/analytics/overview');
    return response.data;
};

// Earnings Trends
export const getTrends = async (period?: string) => {
    const response = await api.get('/client/earnings/analytics/trends', {
        params: { period }
    });
    return response.data;
};

// Earnings by Course
export const getEarningsByCourse = async () => {
    const response = await api.get('/client/earnings/analytics/by-course');
    return response.data;
};

// Earnings by Period
export const getEarningsByPeriod = async (groupBy?: string, startDate?: string, endDate?: string) => {
    const response = await api.get('/client/earnings/analytics/by-period', {
        params: { groupBy, startDate, endDate }
    });
    return response.data;
};

// Earnings Forecast
export const getForecast = async (months?: number) => {
    const response = await api.get('/client/earnings/analytics/forecast', {
        params: { months }
    });
    return response.data;
};

// Earnings Comparison
export const getComparison = async (compareTo?: string) => {
    const response = await api.get('/client/earnings/analytics/comparison', {
        params: { compareTo }
    });
    return response.data;
};

// Types
export interface AnalyticsOverview {
    totalRevenue: number;
    totalStudents: number;
    totalCourses: number;
    averageRating: number;
    growthRate: number;
    currentMonthRevenue: number;
    lastMonthRevenue: number;
    topPerformingCourse: {
        id: string;
        title: string;
        revenue: number;
        students: number;
        rating: number;
    } | null;
}

export interface TrendData {
    date: string;
    revenue: number;
    students: number;
    courses: number;
}

export interface CourseEarnings {
    id: string;
    title: string;
    thumbnail: string;
    revenue: number;
    students: number;
    price: number;
    rating: number;
    createdAt: string;
}

export interface EarningsByCourse {
    courses: CourseEarnings[];
    totalRevenue: number;
    averageRevenuePerCourse: number;
}

export interface PeriodEarnings {
    period: string;
    revenue: number;
    students: number;
    courses: number;
}

export interface ForecastData {
    month: string;
    predictedRevenue: number;
    confidence: number;
}

export interface Forecast {
    forecast: ForecastData[];
    averageMonthlyRevenue: number;
    historicalData: any[];
    basedOnMonths: number;
}

export interface Comparison {
    current: {
        revenue: number;
        students: number;
        courses: number;
        period: string;
    };
    comparison: {
        revenue: number;
        students: number;
        courses: number;
        period: string;
    };
    growth: {
        revenue: number;
        students: number;
        courses: number;
    };
    compareTo: string;
}
