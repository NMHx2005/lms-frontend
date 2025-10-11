# 🏗️ Course Structure API Integration

## ✅ **HOÀN THÀNH:**

### **1. Service Files Created:**

#### **✅ `src/services/client/section.service.ts`**
- `getSectionsByCourse(courseId)` - GET /admin/sections/course/:courseId
- `getSectionById(sectionId)` - GET /admin/sections/:id
- `createSection(data)` - POST /admin/sections
- `updateSection(sectionId, data)` - PUT /admin/sections/:id
- `deleteSection(sectionId)` - DELETE /admin/sections/:id
- `reorderSections(courseId, sections)` - PATCH /admin/sections/course/:courseId/reorder
- `toggleSectionVisibility(sectionId)` - PATCH /admin/sections/:id/visibility
- `getSectionStats(courseId)` - GET /admin/sections/course/:courseId/stats

#### **✅ `src/services/client/lesson.service.ts`**
- `getLessonsBySection(sectionId)` - GET /admin/lessons/section/:sectionId
- `getLessonsByCourse(courseId)` - GET /admin/lessons/course/:courseId
- `getLessonById(lessonId)` - GET /admin/lessons/:id
- `createLesson(data)` - POST /admin/lessons
- `updateLesson(lessonId, data)` - PUT /admin/lessons/:id
- `deleteLesson(lessonId)` - DELETE /admin/lessons/:id
- `reorderLessons(sectionId, lessons)` - PATCH /admin/lessons/section/:sectionId/reorder
- `toggleLessonPreview(lessonId)` - PATCH /admin/lessons/:id/preview
- `toggleLessonRequired(lessonId)` - PATCH /admin/lessons/:id/required
- `addAttachment(lessonId, attachment)` - POST /admin/lessons/:id/attachments
- `removeAttachment(lessonId, attachmentIndex)` - DELETE /admin/lessons/:id/attachments/:attachmentIndex
- `moveLesson(lessonId, newSectionId)` - PATCH /admin/lessons/:id/move
- `getLessonStats(courseId)` - GET /admin/lessons/course/:courseId/stats

### **2. CourseStructure.tsx Updates:**

#### **✅ Imports Added:**
```typescript
import { toast } from 'react-toastify';
import * as sectionService from '../../../services/client/section.service';
import * as lessonService from '../../../services/client/lesson.service';
import { sharedUploadService } from '../../../services/shared/upload.service';
```

#### **✅ Mock Data Removed:**
- ❌ Removed `mockCourse` object with hardcoded sections/lessons
- ✅ Replaced with real API calls

#### **✅ Functions Updated:**
1. **`loadCourseStructure()`** - Load sections and lessons from API
2. **`handleSectionSubmit()`** - Create section via API
3. **`handleLessonSubmit()`** - Create lesson via API

---

## ⚠️ **CẦN HOÀN THÀNH:**

### **Functions cần update trong CourseStructure.tsx:**

1. **`updateSection(sectionId, updates)`** - Update section via API
2. **`updateLesson(sectionId, lessonId, updates)`** - Update lesson via API
3. **`deleteSection(sectionId)`** - Delete section via API
4. **`deleteLesson(sectionId, lessonId)`** - Delete lesson via API
5. **`moveSectionUp(sectionId)`** - Reorder sections via API
6. **`moveSectionDown(sectionId)`** - Reorder sections via API
7. **`moveLessonUp(sectionId, lessonId)`** - Reorder lessons via API
8. **`moveLessonDown(sectionId, lessonId)`** - Reorder lessons via API

### **Upload Functions cần implement:**
- Video upload for lessons
- Document upload for lesson attachments
- File management

---

## 📋 **BACKEND ENDPOINTS AVAILABLE:**

### **Section Endpoints:**
```
GET    /api/admin/sections/course/:courseId      - Get all sections
GET    /api/admin/sections/:id                   - Get section by ID
POST   /api/admin/sections                       - Create section
PUT    /api/admin/sections/:id                   - Update section
DELETE /api/admin/sections/:id                   - Delete section
PATCH  /api/admin/sections/course/:courseId/reorder - Reorder sections
PATCH  /api/admin/sections/:id/visibility        - Toggle visibility
GET    /api/admin/sections/course/:courseId/stats - Get stats
```

### **Lesson Endpoints:**
```
GET    /api/admin/lessons/section/:sectionId     - Get lessons by section
GET    /api/admin/lessons/course/:courseId       - Get lessons by course
GET    /api/admin/lessons/:id                    - Get lesson by ID
POST   /api/admin/lessons                        - Create lesson
PUT    /api/admin/lessons/:id                    - Update lesson
DELETE /api/admin/lessons/:id                    - Delete lesson
PATCH  /api/admin/lessons/section/:sectionId/reorder - Reorder lessons
PATCH  /api/admin/lessons/:id/preview            - Toggle preview
PATCH  /api/admin/lessons/:id/required           - Toggle required
POST   /api/admin/lessons/:id/attachments        - Add attachment
DELETE /api/admin/lessons/:id/attachments/:index - Remove attachment
PATCH  /api/admin/lessons/:id/move               - Move to different section
GET    /api/admin/lessons/course/:courseId/stats - Get stats
```

### **Upload Endpoints:**
```
POST   /api/upload/single/video                  - Upload video
POST   /api/upload/single/document               - Upload document
POST   /api/upload/course-materials              - Upload materials
DELETE /api/upload/file                          - Delete file
```

---

## 🧪 **TESTING CHECKLIST:**

### **Sections:**
- [ ] Load sections for a course
- [ ] Create new section
- [ ] Update section title/description
- [ ] Delete section
- [ ] Reorder sections (move up/down)
- [ ] Toggle section visibility

### **Lessons:**
- [ ] Load lessons for a section
- [ ] Create new lesson (video/text/file/link)
- [ ] Update lesson details
- [ ] Delete lesson
- [ ] Reorder lessons (move up/down)
- [ ] Move lesson to different section
- [ ] Toggle lesson preview
- [ ] Toggle lesson required status

### **Uploads:**
- [ ] Upload video for lesson
- [ ] Upload document for lesson
- [ ] Add attachment to lesson
- [ ] Remove attachment from lesson

---

## 📝 **NEXT STEPS:**

1. **Complete remaining function updates** in CourseStructure.tsx
2. **Implement upload handlers** for video and documents
3. **Add error handling** for all API calls
4. **Add loading states** for better UX
5. **Test all CRUD operations** thoroughly
6. **Add confirmation dialogs** for delete operations
7. **Implement drag-and-drop** for reordering (optional enhancement)

---

## 💡 **NOTES:**

- Teachers use **admin endpoints** for course management
- All endpoints require **authentication**
- Upload service is already available via `sharedUploadService`
- Toast notifications are used for user feedback
- Loading states prevent duplicate operations


