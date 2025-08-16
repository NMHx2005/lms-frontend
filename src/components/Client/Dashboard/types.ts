// Re-export từ main types
export type { User, Course } from '../../../types/index';

// Định nghĩa local các types cần thiết
export interface Assignment {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  courseId: string;
  // ... thêm properties cần thiết
}

export interface Certificate {
  _id: string;
  title: string;
  courseId: string;
  issuedAt: string;
  // ... thêm properties cần thiết
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: string;
  isRead: boolean;
}

export interface Progress {
  _id: string;
  courseId: string;
  completedLessons: number;
  totalLessons: number;
  percentage: number;
}

export interface Rating {
  _id: string;
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Refund {
  _id: string;
  courseId: string;
  amount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface Bill {
  _id: string;
  studentId: string;
  courseId: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  status: string;
  transactionId: string;
  purpose: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalCourses: number;
  completedCourses: number;
  totalHours: number;
  certificates: number;
}

export interface RecentActivity {
  _id: string;
  type: 'course_started' | 'course_completed' | 'assignment_submitted';
  title: string;
  timestamp: string;
}

export interface UpcomingDeadline {
  _id: string;
  title: string;
  dueDate: string;
  type: 'assignment' | 'quiz' | 'exam';
}

export interface LearningTip {
  _id: string;
  title: string;
  content: string;
  category: string;
}