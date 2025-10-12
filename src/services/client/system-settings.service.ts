import api from '../api';
import type { SystemSettingsData } from '../admin/system-settings.service';

/**
 * Client service for system settings (public access)
 */
export const clientSystemSettingsService = {
    /**
     * Get public system settings
     * This should be available without authentication
     */
    async getPublicSettings(): Promise<{ success: boolean; data: SystemSettingsData }> {
        try {
            // Try public endpoint first
            const response = await api.get('/public/system-settings');
            return response.data;
        } catch (error) {
            // Fallback to admin endpoint (this might need auth)
            console.warn('Public endpoint not available, trying admin endpoint');
            try {
                const response = await api.get('/admin/system-settings');
                return response.data;
            } catch (adminError) {
                console.error('Failed to fetch system settings:', adminError);
                // Return default values
                return {
                    success: true,
                    data: {
                        siteName: 'Learning Management System',
                        siteDescription: 'Online learning platform for everyone',
                        siteLogo: '/images/logo.png',
                        siteFavicon: '/favicon.ico',
                        siteTagline: 'Learn anywhere, anytime',
                        contactInfo: {
                            email: 'contact@example.com',
                            phone: '+84 123 456 789',
                            address: '',
                            city: '',
                            country: 'Vietnam',
                            zipCode: ''
                        },
                        socialMedia: {},
                        seo: {
                            metaTitle: '',
                            metaDescription: '',
                            metaKeywords: [],
                            ogImage: ''
                        },
                        features: {
                            enableRegistration: true,
                            enableCourseEnrollment: true,
                            enablePayments: true,
                            enableRefunds: true,
                            enableRatings: true,
                            enableCertificates: true,
                            enableDiscussions: true,
                            enableAI: false
                        },
                        email: {
                            enabled: false,
                            fromName: '',
                            fromEmail: '',
                            enableSSL: false
                        },
                        storage: {
                            provider: 'local',
                            maxFileSize: 10485760,
                            allowedFileTypes: []
                        },
                        payment: {
                            enabled: false,
                            currency: 'VND',
                            vnpay: { enabled: false },
                            momo: { enabled: false }
                        },
                        maintenance: {
                            enabled: false,
                            message: '',
                            allowedIPs: []
                        },
                        security: {
                            enableTwoFactor: false,
                            sessionTimeout: 30,
                            maxLoginAttempts: 5,
                            lockoutDuration: 15,
                            requireEmailVerification: false,
                            passwordMinLength: 8,
                            passwordRequireSpecialChar: false
                        },
                        performance: {
                            enableCaching: false,
                            cacheExpiry: 3600,
                            enableCompression: false,
                            maxConcurrentUsers: 1000
                        },
                        moderation: {
                            enableAutoModeration: false,
                            requireCourseApproval: true,
                            requireReviewApproval: false,
                            profanityFilter: true
                        },
                        legal: {
                            termsOfServiceUrl: '/terms',
                            privacyPolicyUrl: '/privacy',
                            refundPolicyUrl: '/refund-policy',
                            copyrightText: '© 2025 LMS Platform. All rights reserved.'
                        }
                    }
                };
            }
        }
    }
};

