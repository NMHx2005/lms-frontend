# LMS Types Documentation

## Tổng quan

File `src/types/index.ts` chứa tất cả các TypeScript interfaces và enums được sử dụng trong hệ thống LMS. Các types này được đồng bộ hoàn toàn với tài liệu database và SRS để đảm bảo tính nhất quán.

## Cấu trúc

### 1. Core Database Interfaces
Các interface cơ bản đồng bộ với `document_database/DATABASE_ENTITIES.md`:

- **User**: Quản lý tài khoản người dùng
- **Course**: Thông tin khóa học
- **Section**: Phần/chương của khóa học
- **Lesson**: Bài học thuộc section
- **Assignment**: Bài tập/bài kiểm tra
- **Submission**: Bài nộp của học viên
- **Enrollment**: Đăng ký khóa học + tiến độ
- **Bill**: Lịch sử thanh toán
- **RefundRequest**: Yêu cầu hoàn tiền
- **CourseRating**: Đánh giá khóa học

### 2. Extended Frontend Interfaces
Các interface mở rộng cho frontend:

- **CourseWithInstructor**: Khóa học với thông tin giảng viên
- **DashboardCourse**: Khóa học cho dashboard
- **DashboardStats**: Thống kê dashboard
- **CourseFilter**: Bộ lọc khóa học

### 3. Feature-Specific Interfaces
Các interface cho các tính năng cụ thể:

- **WishlistItem**: Mục yêu thích
- **StudyGroup**: Nhóm học tập
- **CalendarEvent**: Sự kiện lịch
- **AnalyticsData**: Dữ liệu phân tích

### 4. Authentication & API Interfaces
Các interface cho xác thực và API:

- **AuthState**: Trạng thái xác thực
- **LoginCredentials**: Thông tin đăng nhập
- **ApiResponse**: Phản hồi API chuẩn
- **ApiErrorResponse**: Phản hồi lỗi API

### 5. Enums
Các enum chuẩn:

- **UserRole**: Vai trò người dùng
- **CourseLevel**: Cấp độ khóa học
- **AssignmentType**: Loại bài tập
- **LessonType**: Loại bài học
- **BillStatus**: Trạng thái hóa đơn
- **RatingType**: Loại đánh giá

## Sử dụng

### Import trong components:
```typescript
import { User, Course, Assignment } from '../types/index';
```

### Import trong store:
```typescript
import { User, Course } from '../types/index';
```

### Import trong services:
```typescript
import { ApiResponse, ApiErrorResponse } from '../types/index';
```

## Quy tắc đồng bộ

1. **Không thay đổi** các interface core database
2. **Chỉ mở rộng** interface khi cần thiết
3. **Sử dụng** interface từ file này thay vì định nghĩa lại
4. **Cập nhật** tài liệu khi thay đổi interface

## Lưu ý

- Tất cả interfaces đều có `_id: string` (MongoDB ObjectId)
- Thời gian sử dụng `string` (ISO 8601 format)
- Boolean fields sử dụng tiền tố `is...` (ví dụ: `isActive`)
- Enum values sử dụng chữ thường (ví dụ: `'student'`, `'beginner'`)

## Liên kết tài liệu

- Database Structure: `document_database/DATABASE_STRUCTURE.md`
- Database Entities: `document_database/DATABASE_ENTITIES.md`
- SRS System: `document_lms/SRS_LMS_System.md`
- API Reference: `document_lms/API_REFERENCE.md`
