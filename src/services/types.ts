// Generic API response shapes (adjust if your backend wraps differently)
export interface ApiList<T> {
	items: T[];
	page?: number;
	limit?: number;
	total?: number;
}

export interface ApiOk<T> {
	success: true;
	message?: string;
	data: T;
}

// Core entities (simplified to match frontend needs)
export interface User {
	id: string;
	email: string;
	name: string;
	firstName?: string;
	lastName?: string;
	avatar?: string | null;
	roles: Array<'student' | 'teacher' | 'admin'>;
	role?: 'student' | 'teacher' | 'admin';
	subscriptionPlan?: 'free' | 'pro' | 'advanced';
	subscriptionExpiresAt?: string;
	isActive: boolean;
	isEmailVerified?: boolean;
	lastLoginAt?: string;
	lastActivityAt?: string;
}

export interface CourseSummary {
	id: string;
	title: string;
	description?: string;
	shortDescription?: string;
	thumbnail?: string | null;
	domain?: string;
	level?: 'beginner' | 'intermediate' | 'advanced';
	category?: string;
	subcategory?: string;
	price?: number;
	originalPrice?: number;
	discountPercentage?: number;
	averageRating?: number;
	totalRatings?: number;
	isPublished?: boolean;
	isApproved?: boolean;
}

export interface CourseDetail extends CourseSummary {
	shortDescription?: string;
	description?: string;
	domain?: string;
	prerequisites?: string[];
	benefits?: string[];
	relatedLinks?: string[];
	externalLinks?: Array<{ name: string; url: string; description?: string }>;
	learningObjectives?: string[];
	estimatedDuration?: number;
	instructorId?: string;
	status?: 'draft' | 'submitted' | 'approved' | 'published' | 'rejected' | 'needs_revision' | 'delisted';
	isFeatured?: boolean;
	submittedAt?: string;
	submittedForReview?: boolean;
	difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
	ageGroup?: 'kids' | 'teens' | 'adults' | 'seniors' | 'all';
	accessibility?: {
		hasSubtitles: boolean;
		hasAudioDescription: boolean;
		hasSignLanguage: boolean;
		supportsScreenReaders: boolean;
		hasHighContrast: boolean;
	};
	technicalRequirements?: {
		minBandwidth: number;
		recommendedBandwidth: number;
		supportedDevices: string[];
		requiredSoftware: string[];
		browserCompatibility: string[];
	};
	learningPath?: {
		isPartOfPath: boolean;
		pathId?: string;
		pathOrder?: number;
		prerequisites: string[];
		nextCourses: string[];
	};
	gamification?: {
		hasBadges: boolean;
		hasPoints: boolean;
		hasLeaderboard: boolean;
		hasAchievements: boolean;
		hasQuests: boolean;
	};
	socialLearning?: {
		hasDiscussionForums: boolean;
		hasGroupProjects: boolean;
		hasPeerReviews: boolean;
		hasStudyGroups: boolean;
		hasMentorship: boolean;
	};
	assessment?: {
		hasQuizzes: boolean;
		hasAssignments: boolean;
		hasFinalExam: boolean;
		hasCertification: boolean;
		passingScore: number;
		maxAttempts: number;
	};
	contentDelivery?: {
		deliveryMethod: 'self-paced' | 'instructor-led' | 'hybrid' | 'live';
		hasLiveSessions: boolean;
		liveSessionSchedule?: string;
		timezone: string;
		recordingPolicy: 'available' | 'limited' | 'not-available';
	};
	support?: {
		hasInstructorSupport: boolean;
		hasCommunitySupport: boolean;
		hasTechnicalSupport: boolean;
		responseTime: 'within-24h' | 'within-48h' | 'within-week' | 'varies';
		officeHours?: string;
	};
	monetization?: {
		pricingModel: 'one-time' | 'subscription' | 'freemium' | 'pay-per-lesson';
		hasFreeTrial: boolean;
		trialDuration?: number;
		hasMoneyBackGuarantee: boolean;
		guaranteePeriod?: number;
		installmentPlan?: {
			enabled: boolean;
			numberOfInstallments: number;
			installmentAmount: number;
		};
	};
	analytics?: {
		viewCount: number;
		searchRanking: number;
		conversionRate: number;
		engagementScore: number;
		retentionRate: number;
		completionTime: number;
		dropoffPoints: string[];
		popularSections: string[];
	};
	seo?: {
		metaTitle: string;
		metaDescription: string;
		keywords: string[];
		canonicalUrl: string;
		structuredData: any;
	};
	localization?: {
		originalLanguage: string;
		availableLanguages: string[];
		hasSubtitles: boolean;
		subtitleLanguages: string[];
		hasDubbing: boolean;
		dubbedLanguages: string[];
	};
	compliance?: {
		gdprCompliant: boolean;
		accessibilityCompliant: boolean;
		industryStandards: string[];
		certifications: string[];
		auditTrail: Array<{
			action: string;
			performedBy: string;
			performedAt: string;
			details: string;
		}>;
	};
	upvotes?: number;
	reports?: number;
	enrolledStudents?: string[];
	totalStudents?: number;
	totalLessons?: number;
	totalDuration?: number;
	completionRate?: number;
	tags?: string[];
	language?: 'vi' | 'en' | 'ja' | 'ko' | 'zh';
	certificate?: boolean;
	maxStudents?: number;
	startDate?: string;
	endDate?: string;
	publishedAt?: string | null;
	approvedAt?: string | null;
	approvedBy?: string | null;
}

export interface Comment {
	id: string;
	commentId?: string;
	content: string;
	authorId: string;
	authorType: 'student' | 'teacher' | 'admin';
	contentType: 'course' | 'lesson' | 'discussion' | 'assignment';
	contentId: string;
	parentId?: string | null;
	rootId?: string | null;
	helpfulVotes?: number;
	totalVotes?: number;
	likes?: string[];
	dislikes?: string[];
	isEdited?: boolean;
	editedAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CartItem {
	productId?: string;
	title: string;
	price: number;
	quantity: number;
}

export interface Cart {
	items: CartItem[];
	// The backend persists items; totals may be computed per endpoint
	subtotal?: number;
	discount?: number;
	total?: number;
}

export interface PaymentRequest {
	cartId?: string;
	amount: number;
	currency?: 'VND' | 'USD' | 'EUR';
	gateway?: 'vnpay' | 'stripe' | 'momo' | 'zalopay';
}

export interface PaymentHistoryItem {
	id: string;
	orderId: string;
	amount: number;
	currency: 'VND' | 'USD' | 'EUR';
	status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
	gateway: 'vnpay' | 'stripe' | 'momo' | 'zalopay';
	createdAt: string;
	updatedAt: string;
}

export interface CertificateSummary {
	id: string;
	certificateId: string;
	verificationCode: string;
	courseId: string;
	studentId: string;
	instructorId: string;
	issueDate: string;
	completionDate: string;
	status: 'active' | 'revoked' | 'expired' | 'replaced';
}

export interface OrderItem { productId?: string; title: string; price: number; quantity: number }
export interface Order {
	id: string;
	userId: string;
	items: OrderItem[];
	amount: number;
	currency: 'VND' | 'USD' | 'EUR';
	status: 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED' | 'CANCELLED';
	txnRef?: string;
	metadata?: any;
	createdAt: string;
	updatedAt: string;
}

export interface SystemMetrics {
	cpuUsage?: number;
	memoryUsage?: number;
	uptime?: number;
}

export type Id = string;


