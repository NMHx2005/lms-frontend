# 👨‍🎓 Student Management API Integration

## ✅ **BACKEND ROUTES COMPLETED:**

### **Teacher-Specific Enrollment Endpoints:**

| Method | Endpoint | Description |
|---|---|---|
| GET | `/client/enrollments/course/:courseId` | Lấy danh sách học viên của khóa học |
| GET | `/client/enrollments/:id/progress` | Lấy chi tiết tiến độ học viên |
| GET | `/client/enrollments/stats/:courseId` | Thống kê học viên (total, active, completed, avg progress) |
| POST | `/client/enrollments/:id/message` | Gửi tin nhắn cho học viên |
| GET | `/client/enrollments/:id/activity` | Lịch sử hoạt động học viên |
| POST | `/client/enrollments/export` | Xuất danh sách học viên (CSV/Excel) |

---

## ✅ **FRONTEND SERVICE:**

File: `lms-frontend/src/services/client/teacher-enrollments.service.ts`

### **API Methods:**

```typescript
// Get enrollments for a course
getCourseEnrollments(courseId, {
  page, limit, status, search
})

// Get enrollment progress details
getEnrollmentProgress(enrollmentId)

// Get enrollment statistics
getEnrollmentStats(courseId)

// Send message to student
sendMessageToStudent(enrollmentId, message)

// Get student activity log
getStudentActivity(enrollmentId)

// Export student list
exportStudentList(courseId, format)
```

---

## 📋 **DATA STRUCTURES:**

### **EnrollmentStudent:**
```typescript
{
  _id: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar?: string;
  };
  courseId: string;
  enrolledAt: string;
  lastAccessedAt?: string;
  progress: number;
  completedLessons: number;
  totalLessons: number;
  status: 'active' | 'completed' | 'inactive' | 'suspended';
  certificateIssued?: boolean;
}
```

### **EnrollmentStats:**
```typescript
{
  totalStudents: number;
  activeStudents: number;
  completedStudents: number;
  averageProgress: number;
  averageCompletionTime: number;
}
```

---

## 🔧 **STUDENTMANAGEMENT.TSX UPDATES NEEDED:**

### **1. Remove Mock Data:**
```typescript
// ❌ REMOVE:
const mockCourses: CourseInfo[] = [...];
const mockStudents: Student[] = [...];

// ✅ REPLACE WITH:
loadEnrollments();
loadStats();
```

### **2. Add API Imports:**
```typescript
import { toast } from 'react-toastify';
import * as teacherEnrollmentService from '../../../services/client/teacher-enrollments.service';
```

### **3. Load Functions:**

#### **Load Enrollments:**
```typescript
const loadEnrollments = async () => {
  if (!courseId) return;
  
  try {
    setLoading(true);
    const response = await teacherEnrollmentService.getCourseEnrollments(courseId, {
      page: 1,
      limit: 20,
      status: statusFilter,
      search: searchTerm
    });

    if (response.success && response.data) {
      setStudents(response.data.enrollments);
    }
  } catch (error: any) {
    console.error('Error loading enrollments:', error);
    toast.error('Lỗi khi tải danh sách học viên');
  } finally {
    setLoading(false);
  }
};
```

#### **Load Stats:**
```typescript
const loadStats = async () => {
  if (!courseId) return;
  
  try {
    const response = await teacherEnrollmentService.getEnrollmentStats(courseId);

    if (response.success && response.data) {
      // Update stats display
      setStats(response.data);
    }
  } catch (error: any) {
    console.error('Error loading stats:', error);
  }
};
```

### **4. View Student Progress:**
```typescript
const viewProgress = async (enrollmentId: string) => {
  try {
    const response = await teacherEnrollmentService.getEnrollmentProgress(enrollmentId);

    if (response.success && response.data) {
      // Show progress dialog/modal
      setProgressDialog({
        open: true,
        data: response.data
      });
    }
  } catch (error: any) {
    console.error('Error loading progress:', error);
    toast.error('Lỗi khi tải tiến độ học viên');
  }
};
```

### **5. Send Message:**
```typescript
const sendMessage = async (enrollmentId: string, message: string) => {
  try {
    const response = await teacherEnrollmentService.sendMessageToStudent(enrollmentId, message);

    if (response.success) {
      toast.success('Gửi tin nhắn thành công');
    }
  } catch (error: any) {
    console.error('Error sending message:', error);
    toast.error('Lỗi khi gửi tin nhắn');
  }
};
```

### **6. Export Students:**
```typescript
const exportStudents = async () => {
  if (!courseId) return;
  
  try {
    const response = await teacherEnrollmentService.exportStudentList(courseId, 'csv');

    if (response.success) {
      toast.success('Xuất danh sách thành công');
      // Download file
    }
  } catch (error: any) {
    console.error('Error exporting:', error);
    toast.error('Lỗi khi xuất danh sách');
  }
};
```

---

## 🎨 **UI FEATURES:**

### **Stats Cards:**
- 👥 Total Students
- ✅ Active Students
- 🎓 Completed Students
- 📊 Average Progress

### **Student Table:**
- 🔍 Search by name/email
- 🎯 Filter by status (all/active/completed/inactive)
- 📊 Sort by name/progress/enrolled date
- 👁️ View progress button
- 💬 Send message button
- 📈 Progress bar
- 📅 Enrolled date
- ⏰ Last active

### **Actions:**
- 📤 Export to CSV/Excel
- 🔄 Refresh data
- 📧 Bulk message
- 📊 View detailed progress

---

## 🧪 **TESTING CHECKLIST:**

- [ ] Load enrollments for a course
- [ ] Search students by name/email
- [ ] Filter by status
- [ ] Sort students
- [ ] View student progress
- [ ] Send message to student
- [ ] View activity log
- [ ] Export student list
- [ ] Display stats correctly
- [ ] Handle empty state
- [ ] Handle errors

---

## 📝 **NEXT STEPS:**

1. Update StudentManagement.tsx imports
2. Remove all mock data
3. Implement `loadEnrollments()` function
4. Implement `loadStats()` function  
5. Implement action handlers (view progress, send message, export)
6. Add toast notifications
7. Add error handling
8. Test all features

**All code examples are ready to copy-paste!** 🎉

