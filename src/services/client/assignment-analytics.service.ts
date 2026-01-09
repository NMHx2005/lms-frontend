import api from '../api';

export interface AssignmentAnalytics {
  totalStudents: number;
  submittedCount: number;
  gradedCount: number;
  averageScore: number;
  medianScore: number;
  submissionRate: number;
  lateSubmissionRate: number;
  gradeDistribution: {
    range: string;
    count: number;
    percentage: number;
  }[];
  topPerformers: {
    studentId: string;
    studentName: string;
    score: number;
  }[];
  commonMistakes?: string[];
}

export const assignmentAnalyticsService = {
  // Get assignment analytics
  async getAnalytics(assignmentId: string): Promise<{ success: boolean; data: AssignmentAnalytics }> {
    const response = await api.get(`/client/assignment-analytics/assignments/${assignmentId}/analytics`);
    return response.data;
  },

  // Get student performance
  async getStudentPerformance(assignmentId: string, studentId: string) {
    const response = await api.get(`/client/assignment-analytics/assignments/${assignmentId}/students/${studentId}/performance`);
    return response.data;
  },
};
