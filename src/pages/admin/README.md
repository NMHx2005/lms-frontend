# Admin Panel - Learning Management System

## Cấu trúc thư mục

```
lms-frontend/src/pages/admin/
├── AdminLogin/
│   ├── AdminLogin.tsx
│   ├── AdminLogin.css
│   └── index.tsx
├── AdminDashboard/
│   ├── AdminDashboard.tsx
│   ├── AdminDashboard.css
│   └── index.tsx
├── UserManagement/
│   ├── UserManagement.tsx
│   ├── UserManagement.css
│   └── index.tsx
├── CourseModeration/
│   ├── CourseModeration.tsx
│   ├── CourseModeration.css
│   └── index.tsx
├── CourseDirectory/
│   ├── CourseDirectory.tsx
│   ├── CourseDirectory.css
│   └── index.tsx
├── RefundCenter/
│   ├── RefundCenter.tsx
│   ├── RefundCenter.css
│   └── index.tsx
├── BillsPayments/
│   ├── BillsPayments.tsx
│   ├── BillsPayments.css
│   └── index.tsx
├── AIModeration/
│   ├── AIModeration.tsx
│   ├── AIModeration.css
│   └── index.tsx
├── Analytics/
│   ├── Analytics.tsx
│   ├── Analytics.css
│   └── index.tsx
├── SystemSettings/
│   ├── SystemSettings.tsx
│   ├── SystemSettings.css
│   └── index.tsx
├── PermissionsManagement/
│   ├── PermissionsManagement.tsx
│   ├── PermissionsManagement.css
│   └── index.tsx
├── AuditLogs/
│   ├── AuditLogs.tsx
│   ├── AuditLogs.css
│   └── index.tsx
├── CategoryManagement/
│   ├── CategoryManagement.tsx
│   ├── CategoryManagement.css
│   └── index.tsx
├── SupportCenter/
│   ├── SupportCenter.tsx
│   ├── SupportCenter.css
│   └── index.tsx
├── Announcements/
│   ├── Announcements.tsx
│   ├── Announcements.css
│   └── index.tsx
├── PerformanceMonitoring/
│   ├── PerformanceMonitoring.tsx
│   ├── PerformanceMonitoring.css
│   └── index.tsx
├── BackupRestore/
│   ├── BackupRestore.tsx
│   ├── BackupRestore.css
│   └── index.tsx
└── README.md
```

## Các trang đã hoàn thành

### Phase 1 - Core Admin (Đã hoàn thành)
#### 1. Admin Login (`/admin/login`)
- Trang đăng nhập dành riêng cho admin
- Demo credentials: admin@lms.com / admin123
- Thiết kế hiện đại, responsive
- Chuyển hướng đến `/admin` sau khi đăng nhập thành công

#### 2. Admin Dashboard (`/admin`)
- Dashboard tổng quan hệ thống
- Hiển thị thống kê: tổng user, khóa học, đăng ký, doanh thu
- Biểu đồ placeholder cho tăng trưởng và doanh thu
- Hành động nhanh và hoạt động gần đây
- Responsive design

#### 3. User Management (`/admin/users`)
- Quản lý tất cả user trong hệ thống
- Tìm kiếm và lọc theo vai trò, trạng thái
- Bulk actions: khóa/mở khóa/xóa nhiều user
- Hiển thị thông tin chi tiết: avatar, role, status, stats
- Responsive table design

#### 4. Course Moderation (`/admin/courses/review`)
- Duyệt và quản lý khóa học mới
- Thống kê: chờ duyệt, đã duyệt, đã từ chối
- Tìm kiếm và lọc theo trạng thái, danh mục, cấp độ
- Bulk actions: duyệt/từ chối nhiều khóa học
- Modal review với ghi chú
- Hiển thị thông tin chi tiết khóa học

### Phase 2 - Business Operations (Đã hoàn thành) ⭐
#### 5. Course Directory (`/admin/courses`)
- Quản lý toàn bộ khóa học trong hệ thống
- Thống kê: tổng khóa học, đã xuất bản, nổi bật, tổng doanh thu
- Tìm kiếm và lọc theo trạng thái, danh mục, cấp độ, nổi bật, giảng viên
- Bulk actions: xuất bản/tạm ngưng/lưu trữ/nổi bật
- Chế độ xem: bảng và lưới
- Sắp xếp theo nhiều tiêu chí
- Hiển thị thông tin chi tiết: giảng viên, học viên, đánh giá, doanh thu

#### 6. Refund Center (`/admin/refunds`)
- Quản lý yêu cầu hoàn tiền từ học viên
- Thống kê: chờ xử lý, đã duyệt, đã từ chối, tổng hoàn tiền
- Tìm kiếm và lọc theo trạng thái, phương thức hoàn tiền, khoảng thời gian
- Bulk actions: duyệt/từ chối nhiều yêu cầu
- Modal xử lý với ghi chú
- Hiển thị thông tin chi tiết: khóa học, học viên, giảng viên, lý do, timeline

#### 7. Bills & Payments (`/admin/bills`)
- Quản lý hóa đơn và theo dõi thanh toán
- Thống kê: tổng hóa đơn, đã thanh toán, chờ thanh toán, tổng thu
- Tìm kiếm và lọc theo trạng thái, phương thức thanh toán, khoảng thời gian
- Hiển thị thông tin chi tiết: học viên, khóa học, số tiền, thuế, tổng cộng
- Timeline: ngày tạo, hạn thanh toán, ngày thanh toán
- Actions: xem chi tiết, chỉnh sửa, nhắc nhở, xuất biên lai

### Phase 3 - Advanced Features (Đã hoàn thành)
#### 8. AI Moderation (`/admin/ai`)
- Quản lý nội dung tự động với AI
- Phát hiện và xử lý nội dung không phù hợp
- Thống kê: tổng nội dung đã xử lý, bị đánh dấu, tự động phê duyệt
- Tìm kiếm và lọc theo loại nội dung, mức rủi ro, trạng thái
- Bulk actions: phê duyệt/từ chối/đánh dấu nhiều nội dung
- Cài đặt AI: độ tin cậy, tự động từ chối, kích hoạt cho từng loại nội dung
- Hiển thị gợi ý AI và phân loại nội dung

#### 9. Analytics & Reports (`/admin/reports`)
- Báo cáo toàn diện về hiệu suất hệ thống LMS
- Thống kê chính: doanh thu, người dùng, khóa học, tương tác
- Biểu đồ xu hướng cho từng metric với chuyển đổi tab
- Top performers: khóa học, giảng viên, danh mục xuất sắc
- Thống kê chi tiết theo từng lĩnh vực
- Xuất báo cáo: PDF, Excel, CSV, tự động gửi email
- Responsive charts và data visualization

#### 10. System Settings (`/admin/settings`)
- Cấu hình toàn bộ hệ thống LMS
- Tabbed interface: Chung, Bảo mật, Email, Thanh toán, Lưu trữ
- Cài đặt chung: tên website, mô tả, liên hệ, múi giờ, ngôn ngữ
- Cài đặt bảo mật: mật khẩu, phiên, 2FA, SSL, login attempts
- Cài đặt email: SMTP, thông báo, test connection
- Cài đặt thanh toán: Stripe, PayPal, tiền tệ, thuế
- Cài đặt lưu trữ: file size, loại file, cloud storage (AWS S3)
- Auto-save với notification, reset changes

### Phase 4 - Security & Compliance (Đã hoàn thành)
#### 11. Permissions Management (`/admin/permissions`)
- Quản lý vai trò và quyền hạn chi tiết
- Tạo, chỉnh sửa, xóa vai trò tùy chỉnh
- Phân quyền theo từng chức năng cụ thể
- Gán vai trò cho người dùng
- Audit trail cho các thay đổi quyền
- Hỗ trợ vai trò hệ thống và tùy chỉnh

#### 12. Audit Logs (`/admin/audit-logs`)
- Lịch sử đầy đủ tất cả thao tác admin
- Tracking user actions và system changes
- Lọc theo mức độ nghiêm trọng, danh mục, trạng thái
- Thông tin chi tiết: IP, user agent, metadata
- Compliance reporting và security monitoring
- Export logs cho phân tích

### Phase 5 - Content & Quality (Đã hoàn thành)
#### 13. Category Management (`/admin/category-management`)
- Quản lý danh mục khóa học với hierarchy
- Tạo, chỉnh sửa, xóa danh mục và subcategories
- SEO optimization: title, description, keywords
- Hỗ trợ hình ảnh danh mục
- Chế độ xem: danh sách và tree view
- Sắp xếp và thứ tự hiển thị

### Phase 6 - Support & Communication (Đã hoàn thành)
#### 14. Support Center (`/admin/support-center`)
- Quản lý ticket hỗ trợ từ người dùng
- Hệ thống priority và status tracking
- Gán ticket cho admin cụ thể
- FAQ management với categories
- Live chat monitoring (placeholder)
- Thống kê response time và resolution rate

#### 15. Announcements (`/admin/announcements`)
- Quản lý thông báo hệ thống
- Hỗ trợ nhiều loại: system, email, push
- Lập lịch thông báo và expiration
- Target audience: all, students, teachers, admins
- Tracking: read count, click count
- Bulk actions và template management

### Phase 7 - Performance & Monitoring (Đã hoàn thành)
#### 16. Performance Monitoring (`/admin/performance`)
- Giám sát hiệu suất server real-time
- Metrics: CPU, memory, disk, network, uptime
- Database performance: connections, query time, cache
- User experience analytics: page load, API response
- Alert system với threshold monitoring
- Auto-refresh và historical data

#### 17. Backup & Restore (`/admin/backup`)
- Quản lý backup database và file system
- Scheduled backups với retention policies
- Restore jobs với validation
- Compression và encryption support
- Disaster recovery planning
- Backup testing và monitoring

## Layout và Navigation

### AdminLayout Component
- Sidebar có thể thu gọn/mở rộng
- Navigation với các menu chính
- Badge hiển thị số lượng cần xử lý
- Responsive design
- Logout về trang login

### Sidebar Items (Cập nhật)
- Dashboard (`/admin`)
- Quản lý User (`/admin/users`)
- Duyệt khóa học (`/admin/courses/review`)
- **Quản lý khóa học (`/admin/courses`)** ⭐ Phase 2
- **Trung tâm hoàn tiền (`/admin/refunds`)** ⭐ Phase 2
- **Hóa đơn & Thanh toán (`/admin/bills`)** ⭐ Phase 2
- **AI Moderation (`/admin/ai`)** ⭐ Phase 3
- **Báo cáo & Analytics (`/admin/reports`)** ⭐ Phase 3
- **Cài đặt hệ thống (`/admin/settings`)** ⭐ Phase 3
- **Quản lý quyền (`/admin/permissions`)** ⭐ Phase 4
- **Audit Logs (`/admin/audit-logs`)** ⭐ Phase 4
- **Quản lý danh mục (`/admin/category-management`)** ⭐ Phase 5
- **Support Center (`/admin/support-center`)** ⭐ Phase 6
- **Thông báo (`/admin/announcements`)** ⭐ Phase 6
- **Giám sát hiệu suất (`/admin/performance`)** ⭐ Phase 7
- **Backup & Restore (`/admin/backup`)** ⭐ Phase 7

## Tính năng

### Authentication
- Protected routes với role Admin
- Redirect về login nếu chưa đăng nhập
- Session management với localStorage

### Responsive Design
- Mobile-first approach
- Breakpoints: 1024px, 768px, 480px
- Sidebar collapse trên mobile
- Table responsive với horizontal scroll

### UI/UX Features
- Loading states với spinner
- Hover effects và transitions
- Color-coded status badges
- Modal dialogs cho actions quan trọng
- Bulk operations với confirmation
- Advanced filtering và searching
- Multiple view modes (table/grid)

## Sử dụng

### Đăng nhập
1. Truy cập `/admin/login`
2. Sử dụng demo credentials: admin@lms.com / admin123
3. Được chuyển hướng đến `/admin`

### Navigation
- Sử dụng sidebar để di chuyển giữa các trang
- Active state hiển thị trang hiện tại
- Badge số lượng cần xử lý

### Phase 1 - Core Admin
- **User Management**: Quản lý user với bulk actions
- **Course Moderation**: Duyệt khóa học mới
- **Dashboard**: Tổng quan hệ thống

### Phase 2 - Business Operations
- **Course Directory**: Quản lý toàn bộ khóa học với advanced filtering
- **Refund Center**: Xử lý yêu cầu hoàn tiền với workflow approval
- **Bills & Payments**: Theo dõi hóa đơn và thanh toán

### Phase 3 - Advanced Features
- **AI Moderation**: Quản lý nội dung tự động với AI và machine learning
- **Analytics & Reports**: Báo cáo toàn diện với biểu đồ và thống kê
- **System Settings**: Cấu hình hệ thống toàn diện với tabbed interface

### Phase 4 - Security & Compliance
- **Permissions Management**: Quản lý vai trò và quyền hạn chi tiết
- **Audit Logs**: Lịch sử thao tác admin và compliance reporting

### Phase 5 - Content & Quality
- **Category Management**: Quản lý danh mục khóa học với SEO optimization

### Phase 6 - Support & Communication
- **Support Center**: Quản lý ticket hỗ trợ và FAQ
- **Announcements**: Thông báo hệ thống và email campaigns

### Phase 7 - Performance & Monitoring
- **Performance Monitoring**: Giám sát hiệu suất server và database
- **Backup & Restore**: Quản lý backup và disaster recovery

## Công nghệ sử dụng

- React 18 với TypeScript
- React Router DOM cho routing
- CSS Modules với BEM methodology
- Responsive design với media queries
- Mock data cho development
- Local storage cho session management

## Phát triển tiếp theo

### Phase 1-7 - Tất cả các trang admin ✅ HOÀN THÀNH
Tất cả 21 trang admin đã được hoàn thành và tích hợp đầy đủ vào hệ thống:

**Phase 1 - Core Admin (4 trang)**
- Admin Login, Dashboard, User Management, Course Moderation

**Phase 2 - Business Operations (3 trang)**
- Course Directory, Refund Center, Bills & Payments

**Phase 3 - Advanced Features (3 trang)**
- AI Moderation, Analytics & Reports, System Settings

**Phase 4 - Security & Compliance (2 trang)**
- Permissions Management, Audit Logs

**Phase 5 - Content & Quality (1 trang)**
- Category Management

**Phase 6 - Support & Communication (2 trang)**
- Support Center, Announcements

**Phase 7 - Performance & Monitoring (2 trang)**
- Performance Monitoring, Backup & Restore

### Tiếp theo
- Tích hợp với backend API thực tế
- Cải thiện error handling
- Thêm unit tests
- Tối ưu hóa performance
- Thêm tính năng real-time updates

## Ghi chú

- Tất cả dữ liệu hiện tại là mock data
- Cần tích hợp với backend API thực tế
- Authentication cần được implement đầy đủ
- Error handling cần được cải thiện
- Unit tests cần được thêm vào
- Phase 2 đã hoàn thành với 3 trang business operations chính
- Phase 3 đã hoàn thành với 3 trang advanced features chính
- Phase 4 đã hoàn thành với 2 trang security & compliance chính
- Phase 5 đã hoàn thành với 1 trang content & quality chính
- Phase 6 đã hoàn thành với 2 trang support & communication chính
- Phase 7 đã hoàn thành với 2 trang performance & monitoring chính
- Tổng cộng đã hoàn thành 21 trang admin chính
