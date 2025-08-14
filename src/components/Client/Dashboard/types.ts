// Core User Interface
export interface User {
  _id: string;
  email: string;
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

// Course Interface
export interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail?: string;
  domain: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  prerequisites: string[];
  benefits: string[];
  relatedLinks: string[];
  instructorId: string;
  price: number;
  isPublished: boolean;
  isApproved: boolean;
  upvotes: number;
  reports: number;
  createdAt: string;
  updatedAt: string;
}

// Section Interface
export interface Section {
  _id: string;
  courseId: string;
  title: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Lesson Interface
export interface Lesson {
  _id: string;
  sectionId: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'file' | 'link';
  videoUrl?: string;
  videoDuration?: number;
  fileUrl?: string;
  order: number;
  isRequired: boolean;
  createdAt: string;
  updatedAt: string;
}

// Assignment Interface
export interface Assignment {
  _id: string;
  lessonId: string;
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

// Submission Interface
export interface Submission {
  _id: string;
  assignmentId: string;
  studentId: string;
  answers?: string[];
  fileUrl?: string;
  score?: number;
  submittedAt: string;
  gradedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Enrollment Interface
export interface Enrollment {
  _id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number;
  completedLessons: string[];
  certificate?: string;
  createdAt: string;
  updatedAt: string;
}

// Bill Interface
export interface Bill {
  _id: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId: string;
  purpose: 'course_purchase' | 'subscription' | 'refund';
  paidAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Refund Request Interface
export interface RefundRequest {
  _id: string;
  studentId: string;
  courseId: string;
  billId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  requestedAt: string;
  processedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Course Rating Interface
export interface CourseRating {
  _id: string;
  courseId: string;
  studentId: string;
  type: 'upvote' | 'report';
  reason?: string;
  lastActionAt: string;
  createdAt: string;
  updatedAt: string;
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
