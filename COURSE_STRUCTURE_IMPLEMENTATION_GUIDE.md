# 🔧 CourseStructure Implementation Guide

## 📝 **CÁC FUNCTIONS CẦN THAY THẾ:**

### **1. updateSection** - Update section via API

```typescript
const updateSection = async (sectionId: string, updates: Partial<Section>) => {
  try {
    setSaving(true);
    const response = await sectionService.updateSection(sectionId, updates);
    
    if (response.success) {
      toast.success('Cập nhật chương thành công');
      setEditingSection(null);
      await loadCourseStructure();
    }
  } catch (error: any) {
    console.error('Error updating section:', error);
    toast.error(error.response?.data?.message || 'Lỗi khi cập nhật chương');
  } finally {
    setSaving(false);
  }
};
```

### **2. updateLesson** - Update lesson via API

```typescript
const updateLesson = async (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
  try {
    setSaving(true);
    const response = await lessonService.updateLesson(lessonId, updates);
    
    if (response.success) {
      toast.success('Cập nhật bài học thành công');
      setEditingLesson(null);
      await loadCourseStructure();
    }
  } catch (error: any) {
    console.error('Error updating lesson:', error);
    toast.error(error.response?.data?.message || 'Lỗi khi cập nhật bài học');
  } finally {
    setSaving(false);
  }
};
```

### **3. deleteSection** - Delete section via API

```typescript
const deleteSection = async (sectionId: string) => {
  if (!window.confirm('Bạn có chắc chắn muốn xóa chương này? Tất cả bài học trong chương cũng sẽ bị xóa.')) {
    return;
  }

  try {
    setSaving(true);
    const response = await sectionService.deleteSection(sectionId);
    
    if (response.success) {
      toast.success('Xóa chương thành công');
      await loadCourseStructure();
    }
  } catch (error: any) {
    console.error('Error deleting section:', error);
    toast.error(error.response?.data?.message || 'Lỗi khi xóa chương');
  } finally {
    setSaving(false);
  }
};
```

### **4. deleteLesson** - Delete lesson via API

```typescript
const deleteLesson = async (sectionId: string, lessonId: string) => {
  if (!window.confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
    return;
  }

  try {
    setSaving(true);
    const response = await lessonService.deleteLesson(lessonId);
    
    if (response.success) {
      toast.success('Xóa bài học thành công');
      await loadCourseStructure();
    }
  } catch (error: any) {
    console.error('Error deleting lesson:', error);
    toast.error(error.response?.data?.message || 'Lỗi khi xóa bài học');
  } finally {
    setSaving(false);
  }
};
```

### **5. moveSection** - Reorder sections via API

```typescript
const moveSection = async (sectionId: string, direction: 'up' | 'down') => {
  if (!course || !id) return;

  const sections = [...course.sections];
  const currentIndex = sections.findIndex(s => s._id === sectionId);

  if (direction === 'up' && currentIndex === 0) return;
  if (direction === 'down' && currentIndex === sections.length - 1) return;

  // Swap positions
  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];

  // Update order numbers
  const reorderedSections = sections.map((section, index) => ({
    sectionId: section._id,
    newOrder: index + 1
  }));

  try {
    setSaving(true);
    const response = await sectionService.reorderSections(id, reorderedSections);
    
    if (response.success) {
      toast.success('Sắp xếp lại chương thành công');
      await loadCourseStructure();
    }
  } catch (error: any) {
    console.error('Error reordering sections:', error);
    toast.error(error.response?.data?.message || 'Lỗi khi sắp xếp lại chương');
  } finally {
    setSaving(false);
  }
};
```

### **6. moveLesson** - Reorder lessons via API

```typescript
const moveLesson = async (sectionId: string, lessonId: string, direction: 'up' | 'down') => {
  const section = course?.sections.find(s => s._id === sectionId);
  if (!section) return;

  const lessons = [...section.lessons];
  const currentIndex = lessons.findIndex(l => l._id === lessonId);

  if (direction === 'up' && currentIndex === 0) return;
  if (direction === 'down' && currentIndex === lessons.length - 1) return;

  // Swap positions
  const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
  [lessons[currentIndex], lessons[newIndex]] = [lessons[newIndex], lessons[currentIndex]];

  // Update order numbers
  const reorderedLessons = lessons.map((lesson, index) => ({
    lessonId: lesson._id,
    newOrder: index + 1
  }));

  try {
    setSaving(true);
    const response = await lessonService.reorderLessons(sectionId, reorderedLessons);
    
    if (response.success) {
      toast.success('Sắp xếp lại bài học thành công');
      await loadCourseStructure();
    }
  } catch (error: any) {
    console.error('Error reordering lessons:', error);
    toast.error(error.response?.data?.message || 'Lỗi khi sắp xếp lại bài học');
  } finally {
    setSaving(false);
  }
};
```

---

## 📤 **UPLOAD HANDLERS:**

### **1. Upload Video for Lesson**

```typescript
const handleVideoUpload = async (file: File, lessonId: string) => {
  try {
    setSaving(true);
    toast.info('Đang tải video lên...');
    
    const response = await sharedUploadService.uploadSingleVideo(file);
    
    if (response.success && response.data) {
      // Update lesson with video URL
      await lessonService.updateLesson(lessonId, {
        videoUrl: response.data.url,
        duration: response.data.duration || 0
      });
      
      toast.success('Tải video lên thành công');
      await loadCourseStructure();
    }
  } catch (error: any) {
    console.error('Error uploading video:', error);
    toast.error(error.response?.data?.message || 'Lỗi khi tải video lên');
  } finally {
    setSaving(false);
  }
};
```

### **2. Upload Document for Lesson**

```typescript
const handleDocumentUpload = async (file: File, lessonId: string) => {
  try {
    setSaving(true);
    toast.info('Đang tải tài liệu lên...');
    
    const response = await sharedUploadService.uploadSingleDocument(file);
    
    if (response.success && response.data) {
      // Add as attachment
      await lessonService.addAttachment(lessonId, {
        name: file.name,
        url: response.data.url,
        type: file.type,
        size: file.size
      });
      
      toast.success('Tải tài liệu lên thành công');
      await loadCourseStructure();
    }
  } catch (error: any) {
    console.error('Error uploading document:', error);
    toast.error(error.response?.data?.message || 'Lỗi khi tải tài liệu lên');
  } finally {
    setSaving(false);
  }
};
```

---

## 🎨 **UI ENHANCEMENTS:**

### **1. Add Loading Overlay**

```typescript
{saving && (
  <Box
    sx={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      bgcolor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}
  >
    <CircularProgress />
  </Box>
)}
```

### **2. Add Empty State**

```typescript
{!loading && course?.sections.length === 0 && (
  <Box sx={{ textAlign: 'center', py: 8 }}>
    <SchoolIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
    <Typography variant="h6" color="text.secondary" gutterBottom>
      Chưa có chương nào
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
      Bắt đầu bằng cách tạo chương đầu tiên cho khóa học
    </Typography>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      onClick={() => setShowAddSection(true)}
    >
      Tạo chương đầu tiên
    </Button>
  </Box>
)}
```

---

## ✅ **TESTING STEPS:**

### **1. Test Section Operations:**
```bash
1. Load course structure → Should show all sections
2. Create new section → Should appear in list
3. Update section title → Should update immediately
4. Move section up/down → Should reorder correctly
5. Delete section → Should remove from list
```

### **2. Test Lesson Operations:**
```bash
1. Create new lesson → Should appear in section
2. Update lesson details → Should update immediately
3. Upload video → Should update videoUrl
4. Upload document → Should add to attachments
5. Move lesson up/down → Should reorder correctly
6. Delete lesson → Should remove from section
```

### **3. Test Error Handling:**
```bash
1. Try to create section without title → Should show error
2. Try to delete section with lessons → Should show warning
3. Try to upload invalid file → Should show error
4. Test network error scenarios → Should show error toast
```

---

## 📋 **FINAL CHECKLIST:**

- [ ] All mock data removed
- [ ] All functions use real API calls
- [ ] Loading states implemented
- [ ] Error handling added
- [ ] Success/error toasts shown
- [ ] Confirmation dialogs for delete
- [ ] Upload handlers implemented
- [ ] Empty states added
- [ ] All CRUD operations tested
- [ ] Reordering works correctly


