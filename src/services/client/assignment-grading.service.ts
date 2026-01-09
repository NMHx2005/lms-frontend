import api from '../api';

export interface Submission {
  _id: string;
  studentId: string;
  studentName: string;
  studentEmail?: string;
  status: 'draft' | 'submitted' | 'graded' | 'late' | 'overdue' | 'returned';
  submittedAt?: string;
  fileUrl?: string;
  textAnswer?: string;
  score?: number;
  feedback?: string;
  attemptNumber: number;
  isLate: boolean;
}

export interface GradeSubmissionData {
  score: number;
  feedback?: string;
  rubricScore?: Array<{
    criterion: string;
    score: number;
    maxScore: number;
  }>;
  feedbackFiles?: Array<{
    name: string;
    url: string;
    type: string;
  }>;
  voiceFeedbackUrl?: string;
  videoFeedbackUrl?: string;
}

export const assignmentGradingService = {
  // Get submissions for an assignment
  async getSubmissions(assignmentId: string, params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }) {
    const response = await api.get(`/client/assignment-grading/assignments/${assignmentId}/submissions`, { params });
    return response.data;
  },

  // Get submission by ID
  async getSubmissionById(submissionId: string) {
    const response = await api.get(`/client/assignment-grading/submissions/${submissionId}`);
    return response.data;
  },

  // Grade a submission
  async gradeSubmission(submissionId: string, data: GradeSubmissionData) {
    const response = await api.post(`/client/assignment-grading/submissions/${submissionId}/grade`, data);
    return response.data;
  },

  // Bulk grade submissions
  async bulkGrade(submissionIds: string[], score: number, feedback?: string) {
    const response = await api.post('/client/assignment-grading/submissions/bulk-grade', {
      submissionIds,
      score,
      feedback,
    });
    return response.data;
  },

  // Return submission for revision
  async returnSubmission(submissionId: string, feedback: string) {
    const response = await api.post(`/client/assignment-grading/submissions/${submissionId}/return`, {
      feedback,
    });
    return response.data;
  },
};
