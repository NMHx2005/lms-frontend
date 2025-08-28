// ========================================
// LMS SYSTEM TYPES - Đồng bộ với tài liệu
// ========================================

// Core User Interface - Đồng bộ với DATABASE_ENTITIES.md
export interface User {
  _id: string;
  email: string;
  password?: string; // Chỉ có khi tạo mới, không trả về từ API
  name: string;
  avatar?: string;
  roles: ('student' | 'teacher' | 'admin')[];
  subscriptionPlan: 'free' | 'pro' | 'advanced';
  subscriptionExpiresAt?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Course Interface - Đồng bộ với DATABASE_ENTITIES.md
export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  domain: string; // 'IT', 'Economics', 'Law', ...
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  benefits: string[];
  relatedLinks: string[];
  instructorId: string; // ref: Users
  price: number;
  isPublished: boolean;
  isApproved: boolean;
  upvotes: number;
  reports: number;
  enrolledStudents: string[]; // ref: Users
  createdAt: string;
  updatedAt: string;
}

// Section Interface - Đồng bộ với DATABASE_ENTITIES.md
export interface Section {
  _id: string;
  courseId: string; // ref: Courses
  title: string;
  order: number; // vị trí trong khóa học
  createdAt: string;
  updatedAt: string;
}

// Lesson Interface - Đồng bộ với DATABASE_ENTITIES.md
export interface Lesson {
  _id: string;
  sectionId: string; // ref: Sections
  title: string;
  content: string; // rich text
  type: 'video' | 'text' | 'file' | 'link';
  videoUrl?: string;
  videoDuration?: number; // seconds
  fileUrl?: string;
  order: number;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

// Assignment Interface - Đồng bộ với DATABASE_ENTITIES.md
export interface Assignment {
  _id: string;
  lessonId: string; // ref: Lessons
  title: string;
  description: string;
  type: 'file' | 'quiz';
  dueDate?: string;
  maxScore: number;
  questions?: AssignmentQuestion[];
  createdAt: string;
  updatedAt: string;
}

// Assignment Question Interface
export interface AssignmentQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// Submission Interface - Đồng bộ với DATABASE_ENTITIES.md
export interface Submission {
  _id: string;
  assignmentId: string; // ref: Assignments
  studentId: string; // ref: Users
  answers?: string[]; // cho quiz
  fileUrl?: string; // cho file
  score?: number;
  submittedAt: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Enrollment Interface - Đồng bộ với DATABASE_ENTITIES.md
export interface Enrollment {
  _id: string;
  studentId: string; // ref: Users
  courseId: string; // ref: Courses
  enrolledAt: string;
  completedAt?: string;
  progress: number; // 0-100
  completedLessons: string[]; // ref: Lessons
  certificate?: string; // URL
  createdAt: string;
  updatedAt: string;
}

// Bill Interface - Đồng bộ với DATABASE_ENTITIES.md
export interface Bill {
  _id: string;
  studentId: string; // ref: Users
  courseId: string; // ref: Courses
  amount: number;
  currency: string; // 'VND'
  paymentMethod: string; // 'stripe', 'bank_transfer', ...
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string; // từ Stripe
  purpose: 'course_purchase' | 'subscription' | 'refund';
  paidAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Refund Request Interface - Đồng bộ với DATABASE_ENTITIES.md
export interface RefundRequest {
  _id: string;
  studentId: string; // ref: Users
  courseId: string; // ref: Courses
  billId: string; // ref: Bills
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  requestedAt: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Course Rating Interface - Đồng bộ với DATABASE_ENTITIES.md
export interface CourseRating {
  _id: string;
  courseId: string; // ref: Courses
  studentId: string; // ref: Users
  type: 'upvote' | 'report';
  reason?: string; // cho report
  lastActionAt: string; // enforce 7-day window
  createdAt: string;
  updatedAt: string;
}

// ========================================
// EXTENDED INTERFACES CHO FRONTEND
// ========================================

// Extended Course with Instructor Info
export interface CourseWithInstructor extends Course {
  instructor?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  sections?: Section[];
  lessons?: Lesson[];
  enrollment?: Enrollment;
}

// Extended Course for Dashboard Display
export interface DashboardCourse extends Course {
  instructor?: {
    _id: string;
    name: string;
    avatar?: string;
  };
  totalStudents?: number;
  averageRating?: number;
  totalLessons?: number;
}

// Dashboard Stats Interface
export interface DashboardStats {
  totalCourses: number;
  publishedCourses: number;
  approvedCourses: number;
  draftCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
}

// Course Filter Interface (for dashboard)
export interface CourseFilter {
  domain: 'all' | string;
  level: 'all' | 'beginner' | 'intermediate' | 'advanced';
  status: 'all' | 'published' | 'approved' | 'draft';
  search: string;
}

// ========================================
// WISHLIST & STUDY GROUPS INTERFACES
// ========================================

// Wishlist Item Interface
export interface WishlistItem {
  _id: string;
  courseId: string;
  title: string;
  thumbnail: string;
  instructor: string;
  price: number;
  originalPrice?: number;
  rating: number;
  totalStudents: number;
  duration: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  addedAt: string;
  isOnSale: boolean;
  discountPercentage?: number;
}

// Study Group Interface
export interface StudyGroup {
  _id: string;
  name: string;
  description: string;
  courseId: string;
  courseTitle: string;
  thumbnail: string;
  maxMembers: number;
  currentMembers: number;
  isPrivate: boolean;
  createdAt: string;
  lastActivity: string;
  tags: string[];
  owner: {
    _id: string;
    name: string;
    avatar: string;
  };
  members: Array<{
    _id: string;
    name: string;
    avatar: string;
    role: 'owner' | 'admin' | 'member';
    joinedAt: string;
  }>;
  recentDiscussions: Array<{
    _id: string;
    title: string;
    author: string;
    lastReply: string;
    repliesCount: number;
  }>;
}

// Create Group Form Interface
export interface CreateGroupForm {
  name: string;
  description: string;
  courseId: string;
  maxMembers: number;
  isPrivate: boolean;
  tags: string[];
}

// ========================================
// CALENDAR & EVENTS INTERFACES
// ========================================

// Calendar Event Interface
export interface CalendarEvent {
  _id: string;
  title: string;
  type: 'lesson' | 'assignment' | 'exam' | 'deadline' | 'reminder';
  startDate: string;
  endDate?: string;
  allDay: boolean;
  courseId: string;
  courseTitle: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  isCompleted: boolean;
  color: string;
}

// Calendar Course Interface
export interface CalendarCourse {
  _id: string;
  title: string;
  color: string;
  lessons: {
    _id: string;
    title: string;
    duration: number;
    type: 'video' | 'text' | 'file' | 'link';
  }[];
}

// ========================================
// ANALYTICS INTERFACES
// ========================================

// Analytics Data Interface
export interface AnalyticsData {
  overview: {
    totalStudents: number;
    totalCourses: number;
    totalRevenue: number;
    totalViews: number;
    averageRating: number;
    completionRate: number;
  };
  revenueData: Array<{
    month: string;
    revenue: number;
    students: number;
    courses: number;
  }>;
  coursePerformance: Array<{
    _id: string;
    name: string;
    students: number;
    rating: number;
    revenue: number;
    completionRate: number;
    views: number;
    thumbnail: string;
  }>;
  studentGrowth: Array<{
    month: string;
    newStudents: number;
    activeStudents: number;
    returningStudents: number;
  }>;
  topCourses: Array<{
    _id: string;
    name: string;
    views: number;
    enrollments: number;
    rating: number;
    revenue: number;
    thumbnail: string;
  }>;
  studentDemographics: {
    ageGroups: Array<{ age: string; count: number; percentage: number }>;
    countries: Array<{ country: string; count: number; percentage: number }>;
    experienceLevels: Array<{ level: string; count: number; percentage: number }>;
  };
  engagementMetrics: {
    averageWatchTime: number;
    assignmentSubmissionRate: number;
    discussionParticipation: number;
    certificateEarned: number;
  };
}

// ========================================
// AUTHENTICATION INTERFACES
// ========================================

// Auth State Interface
export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

// Login Credentials Interface
export interface LoginCredentials {
  email: string;
  password: string;
}

// Register Data Interface
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'student' | 'teacher';
}

// ========================================
// API RESPONSE INTERFACES
// ========================================

// Standard API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Standard API Error Response Interface
export interface ApiErrorResponse {
  success: false;
  error: string;
  errorCode: number;
  details?: any;
}

// ========================================
// ENUMS
// ========================================

export enum UserRole {
  Student = 'student',
  Teacher = 'teacher',
  Admin = 'admin',
}

export enum CourseLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export enum AssignmentType {
  File = 'file',
  Quiz = 'quiz',
}

export enum LessonType {
  Video = 'video',
  Text = 'text',
  File = 'file',
  Link = 'link',
}

export enum BillStatus {
  Pending = 'pending',
  Completed = 'completed',
  Failed = 'failed',
  Refunded = 'refunded',
}

export enum BillPurpose {
  CoursePurchase = 'course_purchase',
  Subscription = 'subscription',
  Refund = 'refund',
}

export enum RatingType {
  Upvote = 'upvote',
  Report = 'report',
}

export enum RefundStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum SubscriptionPlan {
  Free = 'free',
  Pro = 'pro',
  Advanced = 'advanced',
}

// Profile Update Interface
export interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
  phone?: string;
  address?: string;
  bio?: string;
}

// Password Change Interface
export interface PasswordChangeData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
