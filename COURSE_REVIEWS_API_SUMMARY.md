# ⭐ Course Reviews API Integration - Summary

## ✅ **BACKEND ROUTES AVAILABLE:**

### **Course Rating Routes:**
- GET `/client/ratings/courses/:courseId/reviews` - Lấy tất cả reviews
- GET `/client/ratings/courses/:courseId/summary` - Thống kê rating
- POST `/client/ratings/courses/:courseId/reviews` - Tạo review (students)
- PUT `/client/ratings/reviews/:reviewId` - Cập nhật review
- DELETE `/client/ratings/reviews/:reviewId` - Xóa review

### **Teacher Response Routes:**
- GET `/client/teacher-response/my-courses-reviews` - Tất cả reviews của teacher
- GET `/client/teacher-response/pending-responses` - Reviews chưa trả lời
- POST `/client/teacher-response/reviews/:reviewId/response` - Trả lời review
- PUT `/client/teacher-response/reviews/:reviewId/response` - Cập nhật câu trả lời
- DELETE `/client/teacher-response/reviews/:reviewId/response` - Xóa câu trả lời
- GET `/client/teacher-response/statistics` - Thống kê responses

---

## 📋 **REQUIRED SERVICE FILE:**

**Create:** `lms-frontend/src/services/client/teacher-reviews.service.ts`

```typescript
import api from '../api';

export interface Review {
  _id: string;
  studentId: {
    _id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  courseId: string;
  rating: number;
  comment: string;
  createdAt: string;
  teacherResponse?: {
    response: string;
    respondedAt: Date;
  };
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

// Get course reviews
export const getCourseReviews = async (courseId: string) => {
  const response = await api.get(`/client/ratings/courses/${courseId}/reviews`);
  return response.data;
};

// Get rating stats
export const getRatingStats = async (courseId: string) => {
  const response = await api.get(`/client/ratings/courses/${courseId}/summary`);
  return response.data;
};

// Add teacher response
export const addTeacherResponse = async (reviewId: string, response: string) => {
  const res = await api.post(`/client/teacher-response/reviews/${reviewId}/response`, { response });
  return res.data;
};

// Update teacher response
export const updateTeacherResponse = async (reviewId: string, response: string) => {
  const res = await api.put(`/client/teacher-response/reviews/${reviewId}/response`, { response });
  return res.data;
};

// Delete teacher response
export const deleteTeacherResponse = async (reviewId: string) => {
  const res = await api.delete(`/client/teacher-response/reviews/${reviewId}/response`);
  return res.data;
};

// Get all reviews for teacher's courses
export const getMyCoursesReviews = async () => {
  const response = await api.get('/client/teacher-response/my-courses-reviews');
  return response.data;
};

// Get pending responses
export const getPendingResponses = async () => {
  const response = await api.get('/client/teacher-response/pending-responses');
  return response.data;
};
```

---

## 🔧 **COURSEREVIEW.TSX UPDATES:**

### **1. Remove Mock Data:**
Lines 92-140 - Remove mock courses and reviews

### **2. Add Imports:**
```typescript
import { toast } from 'react-toastify';
import { getTeacherCourses } from '@/services/client/teacher-courses.service';
import * as teacherReviewService from '@/services/client/teacher-reviews.service';
```

### **3. Load Courses:**
```typescript
const loadCourses = async () => {
  try {
    setLoading(true);
    const response = await getTeacherCourses({ page: 1, limit: 100 });
    
    if (response.success && response.data) {
      const coursesData = response.data.map(course => ({
        _id: course._id,
        title: course.title,
        thumbnail: course.thumbnail,
        totalReviews: 0, // Load separately
        averageRating: course.rating,
        status: course.status,
        field: course.domain,
        level: course.level,
        price: course.price,
        sections: course.sectionsCount,
        lessons: course.lessonsCount,
        rating: course.rating
      }));
      
      setCourses(coursesData);
    }
  } catch (error) {
    toast.error('Lỗi khi tải danh sách khóa học');
  } finally {
    setLoading(false);
  }
};
```

### **4. Load Reviews:**
```typescript
const loadReviews = async (courseId: string) => {
  try {
    setLoading(true);
    const response = await teacherReviewService.getCourseReviews(courseId);
    
    if (response.success && response.data) {
      const reviewsData = response.data.map(r => ({
        _id: r._id,
        studentId: r.studentId._id,
        studentName: `${r.studentId.firstName} ${r.studentId.lastName}`,
        studentAvatar: r.studentId.avatar,
        studentProgress: 0, // TODO: Load from enrollment
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
        status: 'approved', // All visible reviews are approved
        teacherResponse: r.teacherResponse?.response,
        responseDate: r.teacherResponse?.respondedAt
      }));
      
      setReviews(reviewsData);
    }
  } catch (error) {
    toast.error('Lỗi khi tải đánh giá');
  } finally {
    setLoading(false);
  }
};
```

### **5. Response Handlers:**
```typescript
const handleAddResponse = async () => {
  if (!selectedReview || !responseText) return;
  
  try {
    const response = await teacherReviewService.addTeacherResponse(
      selectedReview._id,
      responseText
    );
    
    if (response.success) {
      toast.success('Trả lời đánh giá thành công');
      setShowResponseModal(false);
      setResponseText('');
      loadReviews(selectedCourse!._id);
    }
  } catch (error) {
    toast.error('Lỗi khi trả lời đánh giá');
  }
};

const handleUpdateResponse = async () => {
  if (!selectedReview || !responseText) return;
  
  try {
    const response = await teacherReviewService.updateTeacherResponse(
      selectedReview._id,
      responseText
    );
    
    if (response.success) {
      toast.success('Cập nhật câu trả lời thành công');
      setShowResponseModal(false);
      loadReviews(selectedCourse!._id);
    }
  } catch (error) {
    toast.error('Lỗi khi cập nhật câu trả lời');
  }
};
```

---

## 📊 **UI FLOW:**

### **Course List View:**
1. Load tất cả courses của teacher
2. Hiển thị cards với: thumbnail, title, total reviews, average rating
3. Click vào course → Hiển thị reviews của course đó

### **Reviews View:**
1. Header: Course info, total reviews, average rating
2. Filters: Search, rating filter, sort
3. Review cards:
   - Student info (avatar, name, enrolled date)
   - Star rating (1-5)
   - Comment text
   - Teacher response (if exists)
   - Actions: Reply, Edit reply, Delete reply

### **Response Modal:**
- Textarea để nhập câu trả lời
- Save/Cancel buttons
- Toast notification

---

## 🎯 **IMPLEMENTATION STATUS:**

- ✅ Backend routes exist
- ✅ Service file structure defined
- ⏳ Frontend service file needs creation
- ⏳ CourseReviews.tsx needs API integration
- ⏳ Mock data needs removal

**Next:** Create service file and integrate into CourseReviews.tsx


