import api from '../api';

export const clientAssignmentsService = {
  // Get Assignments
  async getAssignments(params: {
    courseId?: string;
    status?: string;
    dueDate?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get('/client/assignments', { params });
    return response.data;
  },

  async getAssignmentById(assignmentId: string) {
    const response = await api.get(`/client/assignments/${assignmentId}`);
    return response.data;
  },

  // Assignment Submissions
  async submitAssignment(assignmentId: string, data: {
    answers?: string[];
    fileUrl?: string;
    notes?: string;
    submitTime: string;
  }) {
    const response = await api.post(`/client/assignments/${assignmentId}/submit`, data);
    return response.data;
  },

  async updateSubmission(assignmentId: string, submissionId: string, data: {
    answers?: string[];
    fileUrl?: string;
    notes?: string;
    updateReason: string;
  }) {
    const response = await api.put(`/client/assignments/${assignmentId}/submissions/${submissionId}`, data);
    return response.data;
  },

  async getSubmission(assignmentId: string, submissionId: string) {
    const response = await api.get(`/client/assignments/${assignmentId}/submissions/${submissionId}`);
    return response.data;
  },

  // Assignment Progress
  async getAssignmentProgress(assignmentId: string) {
    const response = await api.get(`/client/assignments/${assignmentId}/progress`);
    return response.data;
  },

  async saveAssignmentDraft(assignmentId: string, data: {
    answers?: string[];
    fileUrl?: string;
    notes?: string;
    autoSave: boolean;
  }) {
    const response = await api.post(`/client/assignments/${assignmentId}/draft`, data);
    return response.data;
  },

  async getAssignmentDraft(assignmentId: string) {
    const response = await api.get(`/client/assignments/${assignmentId}/draft`);
    return response.data;
  },
};
