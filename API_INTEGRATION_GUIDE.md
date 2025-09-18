# API Integration Guide

## Tổng quan

Frontend đã được tích hợp với backend LMS API thông qua các service layers. Tài liệu này hướng dẫn cách sử dụng và mở rộng API integration.

## Cấu trúc API Service

### 1. User Management API
- **File**: `src/services/admin/userService.ts`
- **Endpoints**: Tất cả user-related APIs từ backend
- **Features**:
  - Pagination và filtering
  - Bulk operations
  - Real-time error handling
  - Auto token refresh

### 2. API Configuration
- **File**: `src/config/api.ts`
- **Chức năng**: Cấu hình API URLs và constants

## Cách sử dụng

### 1. Import Service
```typescript
import { UserService } from '../services/admin';
```

### 2. Gọi API
```typescript
// Lấy danh sách users
const response = await UserService.getUsers({
  page: 1,
  limit: 10,
  search: 'john',
  roles: ['student'],
  isActive: true
});

if (response.success) {
  console.log(response.data.users);
  console.log(response.data.pagination);
}
```

### 3. Error Handling
```typescript
try {
  const response = await UserService.getUsers();
  // Handle success
} catch (error) {
  console.error('API Error:', error.response?.data?.error);
  // Handle error
}
```

## Authentication

### JWT Token Management
- **Access Token**: Lưu trong localStorage với key `accessToken`
- **Refresh Token**: Lưu trong localStorage với key `refreshToken`
- **Auto Refresh**: Tự động refresh token khi access token hết hạn
- **Auto Redirect**: Redirect về login khi refresh token hết hạn

### Token Interceptors
- **Request Interceptor**: Tự động thêm Bearer token vào headers
- **Response Interceptor**: Tự động xử lý 401 errors và refresh token

## Environment Variables

Tạo file `.env.local` trong thư mục root:

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_JWT_SECRET=your-jwt-secret-here
VITE_APP_NAME=LMS Frontend
VITE_APP_VERSION=1.0.0
```

## API Endpoints đã tích hợp

### User Management
- `GET /api/admin/users` - Lấy danh sách users
- `GET /api/admin/users/stats` - Thống kê users
- `GET /api/admin/users/search` - Tìm kiếm users
- `POST /api/admin/users` - Tạo user mới
- `GET /api/admin/users/:id` - Lấy user theo ID
- `PUT /api/admin/users/:id` - Cập nhật user
- `DELETE /api/admin/users/:id` - Xóa user
- `PATCH /api/admin/users/:id/activate` - Kích hoạt user
- `PATCH /api/admin/users/:id/deactivate` - Vô hiệu hóa user
- `PATCH /api/admin/users/bulk-status` - Cập nhật trạng thái hàng loạt
- `PATCH /api/admin/users/bulk-roles` - Cập nhật roles hàng loạt

## Mở rộng API Services

### 1. Tạo Service mới
```typescript
// src/services/admin/courseService.ts
import { apiClient } from '../base/apiClient';

export class CourseService {
  static async getCourses(filters: CourseFilters) {
    const response = await apiClient.get('/courses', { params: filters });
    return response.data;
  }
}
```

### 2. Export từ index
```typescript
// src/services/admin/index.ts
export { CourseService } from './courseService';
```

## Best Practices

### 1. Error Handling
- Luôn check `response.success` trước khi sử dụng data
- Sử dụng try-catch cho async operations
- Hiển thị error messages cho user

### 2. Loading States
- Sử dụng loading state cho UX tốt hơn
- Disable buttons khi đang loading
- Hiển thị skeleton/placeholder

### 3. Caching
- Implement caching cho data không thay đổi thường xuyên
- Sử dụng React Query hoặc SWR cho advanced caching

### 4. Type Safety
- Định nghĩa interfaces cho tất cả API responses
- Sử dụng TypeScript strict mode
- Validate data từ API

## Troubleshooting

### 1. CORS Issues
- Đảm bảo backend đã cấu hình CORS đúng
- Check API_BASE_URL trong config

### 2. Authentication Issues
- Check localStorage có tokens không
- Verify token format và expiry
- Check network tab trong DevTools

### 3. API Errors
- Check backend logs
- Verify API endpoints
- Check request/response format

## Next Steps

1. **Tích hợp thêm APIs**: Course, Analytics, etc.
2. **Implement caching**: React Query/SWR
3. **Add offline support**: Service Workers
4. **Performance optimization**: Lazy loading, pagination
5. **Testing**: Unit tests cho services
