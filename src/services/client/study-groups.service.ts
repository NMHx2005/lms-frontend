import api from '../api';

export type StudyGroupPayload = {
    name: string;
    description?: string;
    courseId?: string;
    maxMembers?: number;
    isPrivate?: boolean;
    tags?: string[];
};

export const clientStudyGroupsService = {
    async listPublic(params?: { page?: number; limit?: number; search?: string; courseId?: string; tags?: string[] }) {
        const response = await api.get('/client/study-groups/public', { params });
        return response.data;
    },

    async listMine(params?: { page?: number; limit?: number }) {
        const response = await api.get('/client/study-groups', { params });
        return response.data;
    },

    async listJoined(params?: { page?: number; limit?: number }) {
        const response = await api.get('/client/study-groups/joined/me', { params });
        return response.data;
    },

    async create(data: StudyGroupPayload) {
        const response = await api.post('/client/study-groups', data);
        return response.data;
    },

    async update(groupId: string, data: Partial<StudyGroupPayload>) {
        const response = await api.put(`/client/study-groups/${groupId}`, data);
        return response.data;
    },

    async remove(groupId: string) {
        const response = await api.delete(`/client/study-groups/${groupId}`);
        return response.data;
    },

    async detail(groupId: string) {
        const response = await api.get(`/client/study-groups/${groupId}`);
        return response.data;
    },

    async join(groupId: string) {
        const response = await api.post(`/client/study-groups/${groupId}/join`);
        return response.data;
    },

    async leave(groupId: string) {
        const response = await api.post(`/client/study-groups/${groupId}/leave`);
        return response.data;
    },
};


