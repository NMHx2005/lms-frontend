export { UserService } from './userService';
export type { User, UserFilters, UserStats } from './userService';

export { default as courseService } from './courseService';
export type { Course, CourseFilters, CourseStats, BulkStatusUpdate, CourseApproval, SingleCourseAnalytics } from './courseService';

export { default as courseModerationService } from './courseModerationService';
export type { CourseModeration, CourseModerationFilters, CourseModerationStats, CourseApprovalRequest } from './courseModerationService';

export { default as systemService } from './systemService';
export type { SystemOverview as SystemServiceOverview, Refund, BackupStatus, SystemSettings, RefundQuery, ProcessRefundData, SystemLogsQuery } from './systemService';

export { default as BillsPaymentsService } from './billsPaymentsService';
export type { Bill, BillFilters, PaymentActivity, PaginatedResponse, BillRevenueAnalytics } from './billsPaymentsService';

export { default as AnalyticsService } from './analyticsService';
export type {
    DashboardAnalytics,
    UserAnalytics,
    CourseAnalytics,
    RevenueAnalytics,
    EnrollmentAnalytics,
    ActivityLog,
    ActivitySummary as AnalyticsActivitySummary,
    AnalyticsFilters
} from './analyticsService';

export { default as PermissionsService } from './permissionsService';
export type {
    User as PermissionsUser,
    UserFilters as PermissionsUserFilters,
    BulkRoleUpdate,
    AuthUser,
    BulkAuthRoleUpdate
} from './permissionsService';

export { default as AuditLogsService } from './auditLogsService';
export type {
    AuditLog,
    AuditLogFilters,
    ActivityPreset,
    PaginatedResponse as AuditLogsPaginatedResponse
} from './auditLogsService';

export { default as CategoryManagementService } from './categoryManagementService';
export type {
    Course as CategoryCourse,
    CourseFilters as CategoryCourseFilters,
    CourseAnalytics as CategoryCourseAnalytics,
    CategoryStats,
    UpdateCourseCategoryData,
    Category,
    CategoryCreateData,
    CategoryUpdateData
} from './categoryManagementService';

export {
    getSupportTickets,
    getSupportTicketById,
    assignTicket,
    updateTicketStatus,
    addTicketNote,
    getSupportStaff,
    getSupportStats,
    searchTickets,
    getFAQs,
    getFAQById,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    toggleFAQStatus
} from './supportService';
export type {
    SupportTicket,
    FAQ,
    SupportStaff,
    TicketStats,
    TicketFilters,
    AssignTicketData,
    UpdateTicketStatusData,
    AddTicketNoteData,
    CreateFAQData,
    UpdateFAQData,
    PaginatedResponse as SupportPaginatedResponse,
    ApiResponse as SupportApiResponse
} from './supportService';

// Export announcement service
export type {
    Announcement,
    AnnouncementStats,
    AnnouncementFilters,
    CreateAnnouncementData,
    UpdateAnnouncementData,
    AnnouncementAnalytics,
    BulkActionData,
    PaginatedResponse as AnnouncementPaginatedResponse,
    ApiResponse as AnnouncementApiResponse
} from './announcementService';
export {
    getAnnouncements,
    getAnnouncementById,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    publishAnnouncement,
    cancelAnnouncement,
    getAnnouncementAnalytics,
    bulkPublishAnnouncements,
    bulkDeleteAnnouncements,
    getAnnouncementStats
} from './announcementService';

// Export performance monitoring service
export {
    getSystemOverview,
    getPerformanceMetrics,
    getActivitySummary,
    getSystemLogs,
    getBackupPerformance
} from './performanceService';
export type {
    SystemOverview as PerformanceSystemOverview,
    PerformanceMetrics,
    ActivitySummary as PerformanceActivitySummary,
    SystemLog as PerformanceSystemLog,
    BackupPerformance,
    PerformanceFilters,
    ApiResponse as PerformanceApiResponse
} from './performanceService';

// Export backup service
export * from './backupService';

// Common types that are shared across services
export type { ApiResponse } from './userService';
export type { SystemLog as SystemServiceLog } from './systemService';