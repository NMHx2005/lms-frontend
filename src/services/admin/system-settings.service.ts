import api from '../api';

export interface SystemSettingsData {
    // Website Identity
    siteName: string;
    siteDescription: string;
    siteLogo: string;
    siteFavicon: string;
    siteTagline: string;

    // Contact Information
    contactInfo: {
        email: string;
        phone: string;
        address: string;
        city: string;
        country: string;
        zipCode: string;
    };

    // Social Media
    socialMedia: {
        facebook?: string;
        twitter?: string;
        instagram?: string;
        linkedin?: string;
        youtube?: string;
        github?: string;
    };

    // SEO Settings
    seo: {
        metaTitle: string;
        metaDescription: string;
        metaKeywords: string[];
        ogImage: string;
        googleAnalyticsId?: string;
        facebookPixelId?: string;
    };

    // System Features
    features: {
        enableRegistration: boolean;
        enableCourseEnrollment: boolean;
        enablePayments: boolean;
        enableRefunds: boolean;
        enableRatings: boolean;
        enableCertificates: boolean;
        enableDiscussions: boolean;
        enableAI: boolean;
    };

    // Email Settings
    email: {
        enabled: boolean;
        fromName: string;
        fromEmail: string;
        smtpHost?: string;
        smtpPort?: number;
        smtpUser?: string;
        smtpPassword?: string;
        enableSSL: boolean;
    };

    // Storage Settings
    storage: {
        provider: 'cloudinary' | 'aws-s3' | 'local';
        maxFileSize: number;
        allowedFileTypes: string[];
        cloudinaryCloudName?: string;
        cloudinaryApiKey?: string;
        cloudinaryApiSecret?: string;
    };

    // Payment Settings
    payment: {
        enabled: boolean;
        currency: string;
        vnpay: {
            enabled: boolean;
            tmnCode?: string;
            hashSecret?: string;
            url?: string;
        };
        momo: {
            enabled: boolean;
            partnerCode?: string;
            accessKey?: string;
            secretKey?: string;
        };
    };

    // System Maintenance
    maintenance: {
        enabled: boolean;
        message: string;
        allowedIPs: string[];
    };

    // Security Settings
    security: {
        enableTwoFactor: boolean;
        sessionTimeout: number;
        maxLoginAttempts: number;
        lockoutDuration: number;
        requireEmailVerification: boolean;
        passwordMinLength: number;
        passwordRequireSpecialChar: boolean;
    };

    // Performance Settings
    performance: {
        enableCaching: boolean;
        cacheExpiry: number;
        enableCompression: boolean;
        maxConcurrentUsers: number;
    };

    // Content Moderation
    moderation: {
        enableAutoModeration: boolean;
        requireCourseApproval: boolean;
        requireReviewApproval: boolean;
        profanityFilter: boolean;
    };

    // Legal
    legal: {
        termsOfServiceUrl: string;
        privacyPolicyUrl: string;
        refundPolicyUrl: string;
        copyrightText: string;
    };
}

export const systemSettingsService = {
    /**
     * Get system settings
     */
    async getSettings(): Promise<{ success: boolean; data: SystemSettingsData }> {
        const response = await api.get('/admin/system-settings');
        return response.data;
    },

    /**
     * Update system settings
     */
    async updateSettings(updates: Partial<SystemSettingsData>): Promise<{ success: boolean; data: SystemSettingsData }> {
        const response = await api.put('/admin/system-settings', updates);
        return response.data;
    },

    /**
     * Reset settings to defaults
     */
    async resetSettings(): Promise<{ success: boolean; data: SystemSettingsData }> {
        const response = await api.post('/admin/system-settings/reset');
        return response.data;
    },

    /**
     * Upload logo
     */
    async uploadLogo(file: File): Promise<{ success: boolean; data: any }> {
        const formData = new FormData();
        formData.append('logo', file);
        console.log('📤 Uploading logo:', file.name, file.size);
        const response = await api.post('/admin/system-settings/logo', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('📥 Logo upload response:', response.data);
        return response.data;
    },

    /**
     * Upload favicon
     */
    async uploadFavicon(file: File): Promise<{ success: boolean; data: any }> {
        const formData = new FormData();
        formData.append('favicon', file);
        console.log('📤 Uploading favicon:', file.name, file.size);
        const response = await api.post('/admin/system-settings/favicon', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        console.log('📥 Favicon upload response:', response.data);
        return response.data;
    }
};

