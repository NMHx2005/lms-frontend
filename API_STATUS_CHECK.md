# 🔍 API Status Check - Student Dashboard Pages

## Date: 2025-10-11

---

## 📊 SUMMARY

### Backend Status:
| Feature | Routes | Controller | Service | Model | Status |
|---------|--------|------------|---------|-------|--------|
| Bills | ✅ Partial | ❌ No | ❌ No | ✅ Bill.ts | 🟡 60% |
| Progress | ✅ Scattered | ❌ No | ❌ No | ✅ LessonProgress.ts | 🟡 40% |
| Notifications | ❌ No | ❌ No | ❌ No | ✅ Notification.ts | 🔴 20% |
| Refunds | ✅ Partial | ❌ No | ❌ No | ✅ Refund.ts | 🟡 50% |
| Ratings | ✅ Yes | ✅ Yes | ✅ Yes | ✅ CourseReview.ts | 🟢 90% |
| Certificates | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Certificate.ts | 🟢 100% |

---

## 1️⃣ BILLS (Hóa đơn)

### ✅ Backend có sẵn:
**Routes:** `lms-backend/src/client/routes/payment.routes.ts`
```typescript
✅ GET /api/client/payments/history - Lấy bills (pagination + filter)
✅ GET /api/client/payments/bills/:id - Chi tiết bill
✅ POST /api/client/payments/course/:courseId - Tạo payment
✅ POST /api/client/payments/refund - Request refund
```

**Model:** `lms-backend/src/shared/models/core/Bill.ts` ✅

### ❌ Backend thiếu:
```
- GET /api/client/payments/stats - Thống kê
- POST /api/client/payments/bills/:id/retry - Retry failed payment
- GET /api/client/payments/bills/:id/invoice - Download PDF invoice
```

### 🎯 PROMPT để extend:
```
Extend payment routes trong file lms-backend/src/client/routes/payment.routes.ts:

Thêm các endpoints:
- GET /api/client/payments/stats - Aggregate total spent, pending amount, bill counts
- POST /api/client/payments/bills/:id/retry - Retry failed payment
- GET /api/client/payments/bills/:id/invoice - Generate và download PDF invoice

Tạo frontend service: lms-frontend/src/services/client/payment.service.ts

Tích hợp vào: lms-frontend/src/pages/client/Dashboard/Bills/Bills.tsx (xóa mock data)
```

---

## 2️⃣ PROGRESS (Tiến độ học tập)

### ✅ Backend có sẵn:
**Enrollment Routes:** `lms-backend/src/client/routes/enrollment.routes.ts`
```typescript
✅ GET /api/client/enrollments - Enrollments với progress field
✅ GET /api/client/enrollments/:id/progress - Progress detail
```

**Certificate Routes:** `lms-backend/src/client/routes/certificate.routes.ts`
```typescript
✅ GET /api/client/certificates - Certificates list
✅ GET /api/client/certificates/statistics - Stats
```

**User Routes:** `lms-backend/src/client/routes/user.routes.ts`
```typescript
✅ GET /api/client/users/stats - Learning stats
```

**Models:**
- ✅ Enrollment.ts (có progress field)
- ✅ LessonProgress.ts
- ✅ Certificate.ts

### ❌ Backend thiếu:
```
- Endpoint tổng hợp: GET /api/client/progress/overview
  (Aggregate từ: Enrollments + Certificates + User stats)
```

### 🎯 PROMPT để làm:
```
Tích hợp API cho trang Progress (/dashboard/progress):

Backend đã có:
- enrollment.routes.ts → enrollments data
- certificate.routes.ts → certificates 
- user.routes.ts /stats → learning stats

Cần làm:
1. Frontend: Tạo lms-frontend/src/services/client/progress.service.ts
   - Gọi 3 APIs trên để aggregate data
   - Format data cho UI

2. Frontend: Update lms-frontend/src/pages/client/Dashboard/Progress/Progress.tsx
   - Xóa mock data
   - Dùng progress.service để load data
   - Hiển thị: totalCourses, completedCourses, certificates, progress %

Không cần tạo routes mới, dùng existing APIs.
```

---

## 3️⃣ NOTIFICATIONS (Thông báo)

### ✅ Backend có sẵn:
**Model:** `lms-backend/src/shared/models/extended/Notification.ts` ✅

### ❌ Backend thiếu hoàn toàn:
```
- Routes: None
- Controller: None
- Service: None
```

### 🎯 PROMPT để tạo:
```
Tạo mới hệ thống Notifications cho client:

Backend (TẠO MỚI):
1. Routes: lms-backend/src/client/routes/notification.routes.ts
   - GET /api/client/notifications - List (filter: all/unread/type)
   - PATCH /api/client/notifications/:id/read - Mark as read
   - PATCH /api/client/notifications/mark-all-read - Mark all read
   - DELETE /api/client/notifications/:id - Delete
   - GET /api/client/notifications/unread-count - Count unread

2. Controller: lms-backend/src/client/controllers/notification.controller.ts
3. Service: lms-backend/src/client/services/notification.service.ts

Frontend:
1. Service: lms-frontend/src/services/client/notification.service.ts
2. Update: lms-frontend/src/pages/client/Dashboard/Notifications/Notifications.tsx (xóa mock)

Model đã có: Notification.ts
```

---

## 4️⃣ REFUNDS (Hoàn tiền)

### ✅ Backend có sẵn:
**Routes:** `lms-backend/src/client/routes/payment.routes.ts`
```typescript
✅ POST /api/client/payments/refund - Request refund
```

**Models:**
- ✅ Refund.ts
- ✅ RefundRequest.ts

### ❌ Backend thiếu:
```
- GET /api/client/refunds - List refund requests
- GET /api/client/refunds/:id - Refund detail
- DELETE /api/client/refunds/:id - Cancel request
- GET /api/client/refunds/eligible-courses - Eligible courses
```

### 🎯 PROMPT để extend:
```
Extend refund feature trong payment routes:

File: lms-backend/src/client/routes/payment.routes.ts

Thêm endpoints (sử dụng RefundRequest model):
- GET /api/client/payments/refunds - My refund requests
- GET /api/client/payments/refunds/:id - Refund detail
- DELETE /api/client/payments/refunds/:id - Cancel refund
- GET /api/client/payments/refunds/eligible-courses - Courses có thể refund

Frontend:
- Service: lms-frontend/src/services/client/refund.service.ts
- Update: lms-frontend/src/pages/client/Dashboard/Refunds/Refunds.tsx (xóa mock)

Models đã có: Refund.ts, RefundRequest.ts
```

---

## 5️⃣ RATINGS (My Reviews)

### ✅ Backend có sẵn:
**Routes:** `lms-backend/src/client/routes/course-rating.routes.ts` ✅
**Controller:** `lms-backend/src/client/controllers/course-rating.controller.ts` ✅
**Model:** `CourseReview.ts` ✅

### 🎯 PROMPT để check & integrate:
```
Kiểm tra và tích hợp API ratings:

Backend đã có đầy đủ:
- course-rating.routes.ts
- course-rating.controller.ts
- CourseReview model

Cần làm:
1. Đọc course-rating.routes.ts xem có endpoints:
   - GET my ratings
   - PUT/DELETE rating
   - GET pending reviews (courses chưa rate)

2. Tạo frontend service: lms-frontend/src/services/client/rating.service.ts (nếu chưa có)

3. Update: lms-frontend/src/pages/client/Dashboard/Ratings/Ratings.tsx (xóa mock data)

Kiểm tra xem backend routes đã đủ chưa, nếu thiếu thì thêm.
```

---

## 6️⃣ CALENDAR

### Backend Status:
❌ **Không có routes/controller/service**

### 🎯 PROMPT:
```
Tạo Calendar system (nếu cần):

Backend (TẠO MỚI):
- Routes: lms-backend/src/client/routes/calendar.routes.ts
- Controller: lms-backend/src/client/controllers/calendar.controller.ts
- Service: lms-backend/src/client/services/calendar.service.ts

APIs:
- GET /api/client/calendar/events - Events từ enrollments + deadlines
- GET /api/client/calendar/upcoming - Upcoming (7 ngày tới)

Frontend:
- Service: lms-frontend/src/services/client/calendar.service.ts
- Update: lms-frontend/src/pages/client/Calendar/Calendar.tsx

Hoặc SKIP nếu Calendar không quan trọng.
```

---

## 📋 RECOMMENDED PROMPTS (Thứ tự ưu tiên)

### PROMPT 1 - Bills (Extend existing):
```
Extend payment routes để hoàn thiện Bills page:

File: lms-backend/src/client/routes/payment.routes.ts (đã có /history và /bills/:id)

Thêm vào cuối file:
- GET /api/client/payments/stats - Aggregate bills stats
- POST /api/client/payments/bills/:id/retry - Retry failed payment  
- GET /api/client/payments/bills/:id/invoice - Download PDF

Tạo frontend service: lms-frontend/src/services/client/payment.service.ts

Tích hợp: lms-frontend/src/pages/client/Dashboard/Bills/Bills.tsx (xóa mock data)
```

### PROMPT 2 - Progress (Use existing):
```
Tích hợp Progress page dùng existing APIs:

Frontend tạo: lms-frontend/src/services/client/progress.service.ts

Aggregate data từ:
- GET /api/client/enrollments → totalCourses, progress
- GET /api/client/certificates → certificates
- GET /api/client/users/stats → overall stats

Update: lms-frontend/src/pages/client/Dashboard/Progress/Progress.tsx (xóa mock)
```

### PROMPT 3 - Notifications (Tạo mới):
```
Tạo Notifications system:

Backend:
- lms-backend/src/client/routes/notification.routes.ts (NEW)
- lms-backend/src/client/controllers/notification.controller.ts (NEW)
- lms-backend/src/client/services/notification.service.ts (NEW)

APIs: GET, PATCH read, DELETE, mark-all-read, unread-count

Frontend:
- lms-frontend/src/services/client/notification.service.ts
- Update: lms-frontend/src/pages/client/Dashboard/Notifications/Notifications.tsx (xóa mock)

Model: Notification.ts (đã có)
```

### PROMPT 4 - Refunds (Extend existing):
```
Extend refund feature:

File: lms-backend/src/client/routes/payment.routes.ts (đã có POST /refund)

Thêm: GET /refunds, GET /refunds/:id, DELETE /refunds/:id, GET /refunds/eligible

Frontend:
- lms-frontend/src/services/client/refund.service.ts
- Update: lms-frontend/src/pages/client/Dashboard/Refunds/Refunds.tsx (xóa mock)
```

### PROMPT 5 - Ratings (Check & integrate):
```
Kiểm tra course-rating.routes.ts xem có đủ endpoints chưa.
Nếu đủ, chỉ cần:
- Tạo frontend service
- Update Ratings.tsx xóa mock

Nếu thiếu, thêm endpoint GET my-ratings, PUT, DELETE.
```

---

## 💡 NOTES

- **Bills, Refunds**: Extend `payment.routes.ts` (đã có partial)
- **Progress**: Use existing APIs (enrollment + certificate + user stats)
- **Notifications**: Tạo mới hoàn toàn
- **Ratings**: Có thể đã đủ, cần check
- **Certificates**: DONE ✅

Copy từng prompt và bảo tôi làm nhé! 🚀

