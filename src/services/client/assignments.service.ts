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
  async submitAssignment(assignmentId: string, courseId: string, data: {
    answers?: string[];
    fileUrl?: string;
    fileSize?: number;
    fileType?: string;
    textAnswer?: string;
    isDraft?: boolean;
    comment?: string;
  }) {
    const response = await api.post('/client/assignments/submit', {
      assignmentId,
      courseId,
      ...data,
    });
    return response.data;
  },

  async saveDraft(assignmentId: string, courseId: string, data: {
    fileUrl?: string;
    textAnswer?: string;
    comment?: string;
  }) {
    return this.submitAssignment(assignmentId, courseId, {
      ...data,
      isDraft: true,
    });
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

  // Get student submissions for an assignment
  async getSubmissions(assignmentId: string) {
    const response = await api.get('/client/assignments/submissions', {
      params: { assignmentId },
    });
    return response.data;
  },

  // Get submission by ID
  async getSubmissionById(submissionId: string) {
    const response = await api.get(`/client/assignments/submissions/${submissionId}`);
    return response.data;
  },
};
