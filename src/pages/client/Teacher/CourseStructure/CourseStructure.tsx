import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './CourseStructure.css';

interface Section {
  _id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
}

interface Lesson {
  _id: string;
  title: string;
  type: 'video' | 'text' | 'file' | 'link';
  duration: number;
  order: number;
  isPublished: boolean;
  content?: string;
  videoUrl?: string;
  fileUrl?: string;
  linkUrl?: string;
}

interface CourseStructure {
  _id: string;
  title: string;
  sections: Section[];
}

const CourseStructure: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [course, setCourse] = useState<CourseStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(false);
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null);
  const [newSection, setNewSection] = useState({ title: '', description: '' });
  const [newLesson, setNewLesson] = useState<{
    title: string;
    type: 'video' | 'text' | 'file' | 'link';
    content: string;
    videoUrl: string;
    fileUrl: string;
    linkUrl: string;
  }>({
    title: '',
    type: 'video',
    content: '',
    videoUrl: '',
    fileUrl: '',
    linkUrl: ''
  });

  useEffect(() => {
    // Simulate API call to get course structure
    setTimeout(() => {
      const mockCourse: CourseStructure = {
        _id: id || '1',
        title: 'React Advanced Patterns',
        sections: [
          {
            _id: 's1',
            title: 'Giới thiệu và Cài đặt',
            description: 'Tổng quan về khóa học và hướng dẫn cài đặt môi trường',
            order: 1,
            lessons: [
              {
                _id: 'l1',
                title: 'Chào mừng đến với khóa học',
                type: 'video',
                duration: 300,
                order: 1,
                isPublished: true,
                videoUrl: 'https://example.com/video1.mp4'
              },
              {
                _id: 'l2',
                title: 'Cài đặt môi trường phát triển',
                type: 'text',
                duration: 180,
                order: 2,
                isPublished: true,
                content: 'Hướng dẫn chi tiết cài đặt Node.js, npm và các công cụ cần thiết...'
              }
            ]
          },
          {
            _id: 's2',
            title: 'React Hooks Nâng cao',
            description: 'Tìm hiểu sâu về React Hooks và custom hooks',
            order: 2,
            lessons: [
              {
                _id: 'l3',
                title: 'useState và useEffect',
                type: 'video',
                duration: 600,
                order: 1,
                isPublished: true,
                videoUrl: 'https://example.com/video2.mp4'
              },
              {
                _id: 'l4',
                title: 'Custom Hooks',
                type: 'video',
                duration: 450,
                order: 2,
                isPublished: false,
                videoUrl: 'https://example.com/video3.mp4'
              }
            ]
          }
        ]
      };
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleSectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSection.title.trim()) return;

    const newSectionData: Section = {
      _id: `s${Date.now()}`,
      title: newSection.title,
      description: newSection.description,
      order: (course?.sections.length || 0) + 1,
      lessons: []
    };

    setCourse(prev => prev ? {
      ...prev,
      sections: [...prev.sections, newSectionData]
    } : null);

    setNewSection({ title: '', description: '' });
    setShowAddSection(false);
  };

  const handleLessonSubmit = (e: React.FormEvent, sectionId: string) => {
    e.preventDefault();
    if (!newLesson.title.trim()) return;

    const section = course?.sections.find(s => s._id === sectionId);
    if (!section) return;

    const newLessonData: Lesson = {
      _id: `l${Date.now()}`,
      title: newLesson.title,
      type: newLesson.type,
      duration: 0,
      order: section.lessons.length + 1,
      isPublished: false,
      content: newLesson.content,
      videoUrl: newLesson.videoUrl,
      fileUrl: newLesson.fileUrl,
      linkUrl: newLesson.linkUrl
    };

    setCourse(prev => prev ? {
      ...prev,
      sections: prev.sections.map(s => 
        s._id === sectionId 
          ? { ...s, lessons: [...s.lessons, newLessonData] }
          : s
      )
    } : null);

    setNewLesson({
      title: '',
      type: 'video',
      content: '',
      videoUrl: '',
      fileUrl: '',
      linkUrl: ''
    });
    setShowAddLesson(null);
  };

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    setCourse(prev => prev ? {
      ...prev,
      sections: prev.sections.map(s => 
        s._id === sectionId ? { ...s, ...updates } : s
      )
    } : null);
    setEditingSection(null);
  };

  const updateLesson = (sectionId: string, lessonId: string, updates: Partial<Lesson>) => {
    setCourse(prev => prev ? {
      ...prev,
      sections: prev.sections.map(s => 
        s._id === sectionId 
          ? {
              ...s,
              lessons: s.lessons.map(l => 
                l._id === lessonId ? { ...l, ...updates } : l
              )
            }
          : s
      )
    } : null);
    setEditingLesson(null);
  };

  const deleteSection = (sectionId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa section này?')) {
      setCourse(prev => prev ? {
        ...prev,
        sections: prev.sections.filter(s => s._id !== sectionId)
      } : null);
    }
  };

  const deleteLesson = (sectionId: string, lessonId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa lesson này?')) {
      setCourse(prev => prev ? {
        ...prev,
        sections: prev.sections.map(s => 
          s._id === sectionId 
            ? { ...s, lessons: s.lessons.filter(l => l._id !== lessonId) }
            : s
        )
      } : null);
    }
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    setCourse(prev => {
      if (!prev) return null;
      
      const sections = [...prev.sections];
      const currentIndex = sections.findIndex(s => s._id === sectionId);
      
      if (direction === 'up' && currentIndex > 0) {
        [sections[currentIndex], sections[currentIndex - 1]] = [sections[currentIndex - 1], sections[currentIndex]];
      } else if (direction === 'down' && currentIndex < sections.length - 1) {
        [sections[currentIndex], sections[currentIndex + 1]] = [sections[currentIndex + 1], sections[currentIndex]];
      }
      
      return { ...prev, sections };
    });
  };

  const moveLesson = (sectionId: string, lessonId: string, direction: 'up' | 'down') => {
    setCourse(prev => {
      if (!prev) return null;
      
      const sections = prev.sections.map(s => {
        if (s._id !== sectionId) return s;
        
        const lessons = [...s.lessons];
        const currentIndex = lessons.findIndex(l => l._id === lessonId);
        
        if (direction === 'up' && currentIndex > 0) {
          [lessons[currentIndex], lessons[currentIndex - 1]] = [lessons[currentIndex - 1], lessons[currentIndex]];
        } else if (direction === 'down' && currentIndex < lessons.length - 1) {
          [lessons[currentIndex], lessons[currentIndex + 1]] = [lessons[currentIndex + 1], lessons[currentIndex]];
        }
        
        return { ...s, lessons };
      });
      
      return { ...prev, sections };
    });
  };

  const getLessonTypeIcon = (type: string) => {
    const icons = {
      video: '🎥',
      text: '📝',
      file: '📁',
      link: '🔗'
    };
    return icons[type as keyof typeof icons] || '📄';
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="teacher-dashboard">
        <div className="teacher-dashboard__header">
          <div className="teacher-dashboard__breadcrumbs">
            <span>Teacher Dashboard</span>
            <span>/</span>
            <span>Course Studio</span>
            <span>/</span>
            <span>Cấu trúc khóa học</span>
          </div>
          <h1 className="teacher-dashboard__title">Cấu trúc khóa học</h1>
        </div>
        <div className="teacher-dashboard__content">
          <div className="dashboard__loading">
            <div className="dashboard__loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="teacher-dashboard">
      <div className="teacher-dashboard__header">
        <div className="teacher-dashboard__breadcrumbs">
          <span>Teacher Dashboard</span>
          <span>/</span>
          <span>Course Studio</span>
          <span>/</span>
          <span>Cấu trúc khóa học</span>
        </div>
        <h1 className="teacher-dashboard__title">Cấu trúc khóa học: {course.title}</h1>
      </div>

      <div className="teacher-dashboard__content">
        {/* Course Overview */}
        <div className="course-structure__overview">
          <div className="overview-stats">
            <div className="stat-item">
              <span className="stat-icon">📚</span>
              <span className="stat-value">{course.sections.length}</span>
              <span className="stat-label">Sections</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">🎯</span>
              <span className="stat-value">
                {course.sections.reduce((total, s) => total + s.lessons.length, 0)}
              </span>
              <span className="stat-label">Lessons</span>
            </div>
            <div className="stat-item">
              <span className="stat-icon">⏱️</span>
              <span className="stat-value">
                {formatDuration(course.sections.reduce((total, s) => 
                  total + s.lessons.reduce((sum, l) => sum + l.duration, 0), 0
                ))}
              </span>
              <span className="stat-label">Tổng thời gian</span>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="course-structure__sections">
          {course.sections.map((section, sectionIndex) => (
            <div key={section._id} className="section-card">
              <div className="section-header">
                <div className="section-info">
                  <div className="section-order">{section.order}</div>
                  <div className="section-content">
                    {editingSection === section._id ? (
                      <div className="section-edit-form">
                        <input
                          type="text"
                          value={section.title}
                          onChange={(e) => updateSection(section._id, { title: e.target.value })}
                          className="section-title-input"
                        />
                        <textarea
                          value={section.description}
                          onChange={(e) => updateSection(section._id, { description: e.target.value })}
                          className="section-description-input"
                          rows={2}
                        />
                        <div className="section-edit-actions">
                          <button
                            onClick={() => setEditingSection(null)}
                            className="teacher-dashboard__btn teacher-dashboard__btn--outline"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => setEditingSection(null)}
                            className="teacher-dashboard__btn teacher-dashboard__btn--primary"
                          >
                            Lưu
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="section-title">{section.title}</h3>
                        <p className="section-description">{section.description}</p>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="section-actions">
                  <button
                    onClick={() => moveSection(section._id, 'up')}
                    disabled={sectionIndex === 0}
                    className="action-btn move-btn"
                    title="Di chuyển lên"
                  >
                    ⬆️
                  </button>
                  <button
                    onClick={() => moveSection(section._id, 'down')}
                    disabled={sectionIndex === course.sections.length - 1}
                    className="action-btn move-btn"
                    title="Di chuyển xuống"
                  >
                    ⬇️
                  </button>
                  <button
                    onClick={() => setEditingSection(section._id)}
                    className="action-btn edit-btn"
                    title="Chỉnh sửa"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => deleteSection(section._id)}
                    className="action-btn delete-btn"
                    title="Xóa"
                  >
                    🗑️
                  </button>
                  <button
                    onClick={() => setActiveSection(activeSection === section._id ? null : section._id)}
                    className="action-btn toggle-btn"
                    title={activeSection === section._id ? 'Thu gọn' : 'Mở rộng'}
                  >
                    {activeSection === section._id ? '🔽' : '▶️'}
                  </button>
                </div>
              </div>

              {/* Lessons */}
              {activeSection === section._id && (
                <div className="section-lessons">
                  <div className="lessons-header">
                    <h4>Lessons ({section.lessons.length})</h4>
                    <button
                      onClick={() => setShowAddLesson(showAddLesson === section._id ? null : section._id)}
                      className="teacher-dashboard__btn teacher-dashboard__btn--primary"
                    >
                      ➕ Thêm Lesson
                    </button>
                  </div>

                  {/* Add Lesson Form */}
                  {showAddLesson === section._id && (
                    <form 
                      className="add-lesson-form"
                      onSubmit={(e) => handleLessonSubmit(e, section._id)}
                    >
                      <div className="form-row">
                        <div className="form-group">
                          <label>Tiêu đề lesson</label>
                          <input
                            type="text"
                            value={newLesson.title}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="Nhập tiêu đề lesson"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Loại lesson</label>
                          <select
                            value={newLesson.type}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, type: e.target.value as 'video' | 'text' | 'file' | 'link' }))}
                          >
                            <option value="video">Video</option>
                            <option value="text">Văn bản</option>
                            <option value="file">File</option>
                            <option value="link">Link</option>
                          </select>
                        </div>
                      </div>
                      
                      {newLesson.type === 'text' && (
                        <div className="form-group">
                          <label>Nội dung</label>
                          <textarea
                            value={newLesson.content}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, content: e.target.value }))}
                            placeholder="Nhập nội dung lesson"
                            rows={4}
                          />
                        </div>
                      )}
                      
                      {newLesson.type === 'video' && (
                        <div className="form-group">
                          <label>URL Video</label>
                          <input
                            type="url"
                            value={newLesson.videoUrl}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, videoUrl: e.target.value }))}
                            placeholder="https://example.com/video.mp4"
                          />
                        </div>
                      )}
                      
                      {newLesson.type === 'file' && (
                        <div className="form-group">
                          <label>URL File</label>
                          <input
                            type="url"
                            value={newLesson.fileUrl}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, fileUrl: e.target.value }))}
                            placeholder="https://example.com/file.pdf"
                          />
                        </div>
                      )}
                      
                      {newLesson.type === 'link' && (
                        <div className="form-group">
                          <label>URL Link</label>
                          <input
                            type="url"
                            value={newLesson.linkUrl}
                            onChange={(e) => setNewLesson(prev => ({ ...prev, linkUrl: e.target.value }))}
                            placeholder="https://example.com"
                          />
                        </div>
                      )}

                      <div className="form-actions">
                        <button
                          type="button"
                          onClick={() => setShowAddLesson(null)}
                          className="teacher-dashboard__btn teacher-dashboard__btn--outline"
                        >
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="teacher-dashboard__btn teacher-dashboard__btn--primary"
                        >
                          Thêm Lesson
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Lessons List */}
                  <div className="lessons-list">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lesson._id} className="lesson-item">
                        <div className="lesson-info">
                          <div className="lesson-order">{lesson.order}</div>
                          <div className="lesson-content">
                            {editingLesson === lesson._id ? (
                              <div className="lesson-edit-form">
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(section._id, lesson._id, { title: e.target.value })}
                                  className="lesson-title-input"
                                />
                                <div className="lesson-edit-actions">
                                  <button
                                    onClick={() => setEditingLesson(null)}
                                    className="teacher-dashboard__btn teacher-dashboard__btn--outline"
                                  >
                                    Hủy
                                  </button>
                                  <button
                                    onClick={() => setEditingLesson(null)}
                                    className="teacher-dashboard__btn teacher-dashboard__btn--primary"
                                  >
                                    Lưu
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <div className="lesson-header">
                                  <span className="lesson-type-icon">
                                    {getLessonTypeIcon(lesson.type)}
                                  </span>
                                  <h5 className="lesson-title">{lesson.title}</h5>
                                  <span className="lesson-duration">
                                    {formatDuration(lesson.duration)}
                                  </span>
                                  <span className={`lesson-status ${lesson.isPublished ? 'published' : 'draft'}`}>
                                    {lesson.isPublished ? '✅ Đã xuất bản' : '📝 Bản nháp'}
                                  </span>
                                </div>
                                <div className="lesson-meta">
                                  <span className="lesson-type">{lesson.type}</span>
                                  {lesson.content && <span className="lesson-preview">{lesson.content.substring(0, 100)}...</span>}
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                        
                        <div className="lesson-actions">
                          <button
                            onClick={() => moveLesson(section._id, lesson._id, 'up')}
                            disabled={lessonIndex === 0}
                            className="action-btn move-btn"
                            title="Di chuyển lên"
                          >
                            ⬆️
                          </button>
                          <button
                            onClick={() => moveLesson(section._id, lesson._id, 'down')}
                            disabled={lessonIndex === section.lessons.length - 1}
                            className="action-btn move-btn"
                            title="Di chuyển xuống"
                          >
                            ⬇️
                          </button>
                          <button
                            onClick={() => setEditingLesson(lesson._id)}
                            className="action-btn edit-btn"
                            title="Chỉnh sửa"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => deleteLesson(section._id, lesson._id)}
                            className="action-btn delete-btn"
                            title="Xóa"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add Section */}
        <div className="add-section-section">
          {showAddSection ? (
            <form className="add-section-form" onSubmit={handleSectionSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Tiêu đề section</label>
                  <input
                    type="text"
                    value={newSection.title}
                    onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề section"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mô tả</label>
                  <textarea
                    value={newSection.description}
                    onChange={(e) => setNewSection(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Mô tả ngắn gọn về section"
                    rows={2}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowAddSection(false)}
                  className="teacher-dashboard__btn teacher-dashboard__btn--outline"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="teacher-dashboard__btn teacher-dashboard__btn--primary"
                >
                  Thêm Section
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowAddSection(true)}
              className="add-section-btn"
            >
              ➕ Thêm Section mới
            </button>
          )}
        </div>

        {/* Save Changes */}
        <div className="save-changes-section">
          <button
            onClick={() => {
              setSaving(true);
              setTimeout(() => {
                setSaving(false);
                alert('Cấu trúc khóa học đã được lưu thành công!');
              }, 2000);
            }}
            disabled={saving}
            className="teacher-dashboard__btn teacher-dashboard__btn--primary save-btn"
          >
            {saving ? '💾 Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseStructure;
