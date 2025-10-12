# 🔌 API Integration TODO List

## 📅 Created: 2025-10-11

---

## ✅ COMPLETED Pages (Already integrated)

### Teacher Pages
- ✅ Analytics Dashboard (`/teacher/analytics`)
- ✅ Course Analytics (`/teacher/analytics/courses`)
- ✅ Course Analytics Detail (`/teacher/analytics/course/:id`)
- ✅ Student Analytics (`/teacher/analytics/students`)
- ✅ Communication Center (`/teacher/messages`)
- ✅ Earnings (`/teacher/earnings`)
- ✅ Course Studio (`/teacher/courses`)
- ✅ Course Editor (`/teacher/courses/:id/edit`)
- ✅ Course Structure (`/teacher/courses/:id/structure`)
- ✅ Course Reviews (`/teacher/reviews`)
- ✅ Teacher Profile Manage (`/teacher/advanced/profile`)
- ✅ Student Management (partial)
- ✅ Assignments Manager (partial)
- ✅ Submissions Grading (partial)

---

## 🔴 PENDING Pages (Need API Integration)

### 🎓 Student Dashboard Pages

#### 1. **Bills** (`/dashboard/bills`)
**File:** `lms-frontend/src/pages/client/Dashboard/Bills/Bills.tsx`
**Status:** ❌ Using MOCK data
**Backend Routes:** `lms-backend/src/client/routes/payment.routes.ts` (PARTIAL)

**Already exists:**
```
✅ GET /api/client/payments/history - Lấy bills (có pagination, filter)
✅ GET /api/client/payments/bills/:id - Chi tiết bill
```

**Need to ADD to payment.routes.ts:**
```
❌ GET /api/client/payments/stats - Thống kê bills
❌ POST /api/client/payments/bills/:id/retry - Retry payment
❌ GET /api/client/payments/bills/:id/download - Download invoice PDF
```

**Frontend service:**
- ❌ lms-frontend/src/services/client/payment.service.ts (cần tạo hoặc check existing)
```

---

#### 2. **Progress** (`/dashboard/progress`)
**File:** `lms-frontend/src/pages/client/Dashboard/Progress/Progress.tsx`
**Status:** ❌ Using MOCK data
**Backend Routes:** None

**Need to create:**
```
Client Routes: lms-backend/src/client/routes/progress.routes.ts

APIs needed:
- GET /api/client/progress/overview - Tổng quan tiến độ học tập
- GET /api/client/progress/courses - Tiến độ từng khóa học
- GET /api/client/progress/certificates - Danh sách chứng chỉ
- GET /api/client/progress/stats - Thống kê (lessons completed, time spent)

Service: lms-backend/src/client/services/progress.service.ts
Controller: lms-backend/src/client/controllers/progress.controller.ts
```

---

#### 3. **Notifications** (`/dashboard/notifications`)
**File:** `lms-frontend/src/pages/client/Dashboard/Notifications/Notifications.tsx`
**Status:** ❌ Using MOCK data
**Backend Routes:** None

**Need to create:**
```
Client Routes: lms-backend/src/client/routes/notification.routes.ts

APIs needed:
- GET /api/client/notifications - Lấy notifications
- PATCH /api/client/notifications/:id/read - Đánh dấu đã đọc
- DELETE /api/client/notifications/:id - Xóa notification
- PATCH /api/client/notifications/read-all - Đánh dấu tất cả đã đọc
- GET /api/client/notifications/unread-count - Số notification chưa đọc
- PUT /api/client/notifications/settings - Cài đặt notifications

Service: lms-backend/src/client/services/notification.service.ts
Controller: lms-backend/src/client/controllers/notification.controller.ts
```

---

#### 4. **Ratings** (`/dashboard/ratings`)
**File:** `lms-frontend/src/pages/client/Dashboard/Ratings/Ratings.tsx`
**Status:** ❌ Using MOCK data
**Backend Routes:** `client/routes/course-rating.routes.ts` (exists but may need extension)

**Need to check/extend:**
```
APIs needed:
- GET /api/client/ratings/my-ratings - Ratings đã viết
- PUT /api/client/ratings/:id - Edit rating
- DELETE /api/client/ratings/:id - Delete rating
- GET /api/client/ratings/pending - Courses chưa đánh giá

Service: Extend lms-backend/src/client/services/course-rating.service.ts (if exists)
```

---

#### 5. **Refunds** (`/dashboard/refunds`)
**File:** `lms-frontend/src/pages/client/Dashboard/Refunds/Refunds.tsx`
**Status:** ❌ Using MOCK data
**Backend Routes:** None (Admin has refund center)

**Need to create:**
```
Client Routes: lms-backend/src/client/routes/refund.routes.ts

APIs needed:
- POST /api/client/refunds/request - Yêu cầu hoàn tiền
- GET /api/client/refunds - Danh sách refund requests
- GET /api/client/refunds/:id - Chi tiết refund
- DELETE /api/client/refunds/:id - Hủy refund request
- GET /api/client/refunds/eligible-courses - Courses đủ điều kiện refund

Service: lms-backend/src/client/services/refund.service.ts
Controller: lms-backend/src/client/controllers/refund.controller.ts
```

---

### 📚 General Client Pages

#### 6. **Calendar** (`/calendar`)
**File:** `lms-frontend/src/pages/client/Calendar/Calendar.tsx`
**Status:** Check if has API
**Backend Routes:** None visible

**Need to create (if using mock):**
```
Client Routes: lms-backend/src/client/routes/calendar.routes.ts

APIs needed:
- GET /api/client/calendar/events - Lịch học, deadlines
- GET /api/client/calendar/upcoming - Sự kiện sắp tới
- POST /api/client/calendar/events - Tạo event cá nhân

Service: lms-backend/src/client/services/calendar.service.ts
```

---

#### 7. **Category Pages** (`/category/:slug`)
**File:** `lms-frontend/src/pages/client/CategoryPages/CategoryPages.tsx`
**Status:** Check if has API

**APIs needed:**
```
- GET /api/client/categories/:slug/courses - Courses theo category
- GET /api/client/categories/:slug - Category info
```

---

#### 8. **Instructor Profile** (`/instructor/:id`)
**File:** `lms-frontend/src/pages/client/InstructorProfile/InstructorProfile.tsx`
**Status:** Check if has API

**APIs needed:**
```
- GET /api/client/instructors/:id - Instructor public profile
- GET /api/client/instructors/:id/courses - Courses của instructor
- GET /api/client/instructors/:id/stats - Public stats
```

---

#### 9. **Learning/LearningPlayer** (`/learning/:courseId`)
**File:** `lms-frontend/src/pages/client/LearningPlayer/LearningPlayer.tsx`
**Status:** Check if has complete API

**Routes exist:** `client/routes/lesson.routes.ts`, `client/routes/enrollment.routes.ts`

**May need:**
```
- Track video progress
- Mark lesson complete
- Quiz submission
- Assignment submission
```

---

#### 10. **Assignment Workspace** (`/assignments/:id`)
**File:** `lms-frontend/src/pages/client/AssignmentWorkspace/AssignmentWorkspace.tsx`
**Status:** Check API

**Routes exist:** `client/routes/assignment.routes.ts`, `client/routes/course-submission.routes.ts`

---

#### 11. **Checkout** (`/checkout/:courseId`)
**File:** `lms-frontend/src/pages/client/Checkout/Checkout.tsx`
**Status:** Check API

**Routes exist:** `client/routes/payment.routes.ts`

---

### 👨‍🏫 Teacher Pages (Need completion)

#### 12. **Package Plans** (`/teacher/advanced/packages`)
**File:** `lms-frontend/src/pages/client/Teacher/Advanced/PackagePlans.tsx`
**Status:** Check API

**Routes exist:** `client/routes/teacher-package.routes.ts`

---

#### 13. **AI Tools Pages**
**Files:**
- `AITools.tsx`
- `AvatarTool.tsx`
- `ThumbnailTool.tsx`
- `ModerationTool.tsx`

**Routes exist:** `client/routes/ai-tools.routes.ts`

---

## 🎯 PROMPT TEMPLATES

### For Student Dashboard Pages:

```
Tích hợp API cho trang [PAGE_NAME] với các endpoint:
- GET /api/client/[resource] - [Description]
- POST /api/client/[resource] - [Description]
- PUT /api/client/[resource]/:id - [Description]
- DELETE /api/client/[resource]/:id - [Description]

File frontend: lms-frontend/src/pages/client/Dashboard/[PageName]/[PageName].tsx
File backend routes: lms-backend/src/client/routes/[resource].routes.ts
File backend controller: lms-backend/src/client/controllers/[resource].controller.ts
File backend service: lms-backend/src/client/services/[resource].service.ts
File frontend service: lms-frontend/src/services/client/[resource].service.ts

Xóa hết các mock data và dùng API thật nhé.
```

---

## 📊 PRIORITY ORDER

### High Priority (Student features):
1. ⭐⭐⭐ Bills (Payment history)
2. ⭐⭐⭐ Progress (Learning progress & certificates)
3. ⭐⭐⭐ Notifications
4. ⭐⭐ Refunds
5. ⭐⭐ Ratings (My reviews)

### Medium Priority:
6. ⭐ Calendar
7. ⭐ Category Pages
8. ⭐ Instructor Profile

### Low Priority (Already functional):
9. Learning/LearningPlayer (check completeness)
10. Assignment Workspace (check completeness)
11. Checkout (check completeness)

---

## 📝 NOTES

- All Teacher pages are mostly done
- Focus on Student Dashboard pages
- Admin pages are mostly complete
- Some pages may have partial API integration - need to verify

---

## 🚀 NEXT STEPS

1. Start with Bills page
2. Then Progress page
3. Then Notifications
4. Then Refunds
5. Review and test all integrations

