import api from '../api';

export interface UserProfile {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    phone?: string;
    dateOfBirth?: string;
    country?: string;
    skills?: string[];
    education?: Array<{
        institution: string;
        degree: string;
        field: string;
        startDate: string;
        endDate?: string;
        current?: boolean;
    }>;
    experience?: Array<{
        company: string;
        position: string;
        startDate: string;
        endDate?: string;
        current?: boolean;
        description?: string;
    }>;
    socialLinks?: {
        website?: string;
        linkedin?: string;
        github?: string;
        twitter?: string;
    };
    roles?: string[];
    subscriptionStatus?: string;
}

export interface ProfileStats {
    profileCompletion: number;
    coursesCreated: number;
    totalStudents: number;
    totalRevenue: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    joinedDate: string;
    lastActive: string;
    subscriptionStatus: string;
}

/**
 * Get user profile
 */
export const getProfile = async () => {
    const response = await api.get('/client/users/profile');
    return response.data;
};

/**
 * Update user profile
 */
export const updateProfile = async (data: Partial<UserProfile>) => {
    const response = await api.put('/client/users/profile', data);
    return response.data;
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api.put('/client/users/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

/**
 * Update bio
 */
export const updateBio = async (bio: string) => {
    const response = await api.put('/client/users/bio', { bio });
    return response.data;
};

/**
 * Update skills
 */
export const updateSkills = async (skills: string[]) => {
    const response = await api.put('/client/users/skills', { skills });
    return response.data;
};

/**
 * Update education
 */
export const updateEducation = async (education: UserProfile['education']) => {
    const response = await api.put('/client/users/education', { education });
    return response.data;
};

/**
 * Update experience
 */
export const updateExperience = async (experience: UserProfile['experience']) => {
    const response = await api.put('/client/users/experience', { experience });
    return response.data;
};

/**
 * Get profile stats
 */
export const getProfileStats = async (): Promise<{ success: boolean; data: ProfileStats }> => {
    const response = await api.get('/client/users/profile/stats');
    return response.data;
};

/**
 * Get course quota info
 */
export const getCourseQuota = async () => {
    const response = await api.get('/client/users/course-quota');
    return response.data;
};

const userProfileService = {
    getProfile,
    updateProfile,
    uploadAvatar,
    updateBio,
    updateSkills,
    updateEducation,
    updateExperience,
    getProfileStats,
    getCourseQuota
};

export default userProfileService;

