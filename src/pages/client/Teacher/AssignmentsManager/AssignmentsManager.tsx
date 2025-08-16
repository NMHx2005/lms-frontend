import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './AssignmentsManager.css';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  isPublished: boolean;
  studentCount: number;
}

interface Assignment {
  _id: string;
  title: string;
  description: string;
  type: 'file' | 'quiz';
  dueDate: string;
  maxScore: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  submissionsCount: number;
  averageScore: number;
  courseId: string; // Thêm courseId
  // File assignment specific
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  // Quiz assignment specific
  questions?: QuizQuestion[];
  timeLimit?: number; // in minutes
}

interface QuizQuestion {
  _id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

interface Lesson {
  _id: string;
  title: string;
  courseTitle: string;
  sectionTitle: string;
}

const AssignmentsManager: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<string | null>(null);
  const [previewAssignment, setPreviewAssignment] = useState<string | null>(null);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    description: '',
    type: 'file' as 'file' | 'quiz',
    dueDate: '',
    maxScore: 100,
    fileUrl: '',
    fileName: '',
    timeLimit: 30,
    questions: [] as QuizQuestion[]
  });

  useEffect(() => {
    // Simulate API call to get teacher's courses
    setTimeout(() => {
      const mockCourses: Course[] = [
        {
          _id: 'course1',
          title: 'React Advanced Patterns',
          description: 'Học React từ cơ bản đến nâng cao',
          thumbnail: '/images/react-course.jpg',
          isPublished: true,
          studentCount: 45
        },
        {
          _id: 'course2',
          title: 'Node.js Backend Development',
          description: 'Xây dựng backend với Node.js và Express',
          thumbnail: '/images/nodejs-course.jpg',
          isPublished: true,
          studentCount: 32
        },
        {
          _id: 'course3',
          title: 'Python Data Science',
          description: 'Phân tích dữ liệu với Python',
          thumbnail: '/images/python-course.jpg',
          isPublished: false,
          studentCount: 28
        }
      ];

      setCourses(mockCourses);
      if (mockCourses.length > 0) {
        setSelectedCourseId(mockCourses[0]._id);
        setSelectedCourse(mockCourses[0]);
      }
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      // Simulate API call to get lesson and assignments for selected course
      setLoading(true);
      setTimeout(() => {
        const mockLesson: Lesson = {
          _id: lessonId || '1',
          title: 'React Hooks Fundamentals',
          courseTitle: selectedCourse?.title || '',
          sectionTitle: 'React Hooks Nâng cao'
        };

        const mockAssignments: Assignment[] = [
          {
            _id: 'a1',
            title: 'Bài tập thực hành useState',
            description: 'Tạo một ứng dụng counter sử dụng useState hook với các tính năng tăng, giảm và reset.',
            type: 'file',
            dueDate: '2024-02-01T23:59:00Z',
            maxScore: 100,
            isPublished: true,
            createdAt: '2024-01-15T00:00:00Z',
            updatedAt: '2024-01-15T00:00:00Z',
            submissionsCount: 15,
            averageScore: 87.5,
            courseId: selectedCourseId,
            fileUrl: 'https://example.com/assignment1.pdf',
            fileName: 'useState_Practice.pdf',
            fileSize: 2048576
          },
          {
            _id: 'a2',
            title: 'Quiz kiểm tra kiến thức Hooks',
            description: 'Bài quiz kiểm tra hiểu biết về React Hooks cơ bản.',
            type: 'quiz',
            dueDate: '2024-02-05T23:59:00Z',
            maxScore: 50,
            isPublished: true,
            createdAt: '2024-01-16T00:00:00Z',
            updatedAt: '2024-01-16T00:00:00Z',
            submissionsCount: 12,
            averageScore: 42.3,
            courseId: selectedCourseId,
            timeLimit: 45,
            questions: [
              {
                _id: 'q1',
                question: 'useState hook được sử dụng để làm gì?',
                type: 'multiple_choice',
                options: [
                  'Quản lý side effects',
                  'Quản lý state trong functional component',
                  'Tối ưu hiệu suất',
                  'Xử lý lifecycle'
                ],
                correctAnswer: 'Quản lý state trong functional component',
                points: 10
              },
              {
                _id: 'q2',
                question: 'useEffect hook chạy sau mỗi lần render.',
                type: 'true_false',
                correctAnswer: 'true',
                points: 5
              }
            ]
          }
        ];

        setLesson(mockLesson);
        setAssignments(mockAssignments);
        setLoading(false);
      }, 800);
    }
  }, [selectedCourseId, lessonId]);

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    const course = courses.find(c => c._id === courseId);
    setSelectedCourse(course || null);
    setAssignments([]);
    setLesson(null);
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAssignment.title.trim() || !selectedCourseId) return;

    const assignmentData: Assignment = {
      _id: `a${Date.now()}`,
      title: newAssignment.title,
      description: newAssignment.description,
      type: newAssignment.type,
      dueDate: newAssignment.dueDate,
      maxScore: newAssignment.maxScore,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      submissionsCount: 0,
      averageScore: 0,
      courseId: selectedCourseId,
      fileUrl: newAssignment.fileUrl,
      fileName: newAssignment.fileName,
      fileSize: 0,
      timeLimit: newAssignment.timeLimit,
      questions: newAssignment.questions
    };

    setAssignments(prev => [...prev, assignmentData]);
    setNewAssignment({
      title: '',
      description: '',
      type: 'file',
      dueDate: '',
      maxScore: 100,
      fileUrl: '',
      fileName: '',
      timeLimit: 30,
      questions: []
    });
    setShowAddAssignment(false);
  };

  const deleteAssignment = (assignmentId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
      setAssignments(prev => prev.filter(a => a._id !== assignmentId));
    }
  };

  const toggleAssignmentStatus = (assignmentId: string) => {
    setAssignments(prev => prev.map(a =>
      a._id === assignmentId
        ? { ...a, isPublished: !a.isPublished, updatedAt: new Date().toISOString() }
        : a
    ));
  };

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      _id: `q${Date.now()}`,
      question: '',
      type: 'multiple_choice',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 10
    };

    setNewAssignment(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionIndex: number, updates: Partial<QuizQuestion>) => {
    setNewAssignment(prev => ({
      ...prev,
      questions: prev.questions.map((q, index) =>
        index === questionIndex ? { ...q, ...updates } : q
      )
    }));
  };

  const removeQuestion = (questionIndex: number) => {
    setNewAssignment(prev => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex)
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAssignmentTypeIcon = (type: string) => {
    return type === 'file' ? '��' : '❓';
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
            <span>Quản lý bài tập</span>
          </div>
          <h1 className="teacher-dashboard__title">Quản lý bài tập</h1>
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

  if (courses.length === 0) {
    return (
      <div className="teacher-dashboard">
        <div className="teacher-dashboard__header">
          <div className="teacher-dashboard__breadcrumbs">
            <span>Teacher Dashboard</span>
            <span>/</span>
            <span>Course Studio</span>
            <span>/</span>
            <span>Quản lý bài tập</span>
          </div>
          <h1 className="teacher-dashboard__title">Quản lý bài tập</h1>
        </div>
        <div className="teacher-dashboard__content">
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Bạn chưa có khóa học nào</h3>
            <p>Tạo khóa học đầu tiên để bắt đầu quản lý bài tập.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <div className="teacher-dashboard__header">
        <div className="teacher-dashboard__breadcrumbs">
          <span>Teacher Dashboard</span>
          <span>/</span>
          <span>Course Studio</span>
          <span>/</span>
          <span>Quản lý bài tập</span>
        </div>
        <h1 className="teacher-dashboard__title">Quản lý bài tập</h1>
      </div>

      <div className="teacher-dashboard__content">
        {/* Course Selection */}
        <div className="course-selection-card">
          <h3>🎯 Chọn khóa học</h3>
          <div className="course-selector">
            <select
              value={selectedCourseId}
              onChange={(e) => handleCourseChange(e.target.value)}
              className="course-select"
            >
              {courses.map(course => (
                <option key={course._id} value={course._id}>
                  {course.title} {!course.isPublished && '(Bản nháp)'}
                </option>
              ))}
            </select>
            {selectedCourse && (
              <div className="selected-course-info">
                <div className="course-thumbnail ">
                  <img src={selectedCourse.thumbnail} alt={selectedCourse.title} />
                </div>
                <div className="course-details">
                  <h4>{selectedCourse.title}</h4>
                  <p>{selectedCourse.description}</p>
                  <div className="course-stats">
                    <span className="stat">�� {selectedCourse.studentCount} học viên</span>
                    <span className={`status ${selectedCourse.isPublished ? 'published' : 'draft'}`}>
                      {selectedCourse.isPublished ? '✅ Đã xuất bản' : '📝 Bản nháp'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedCourse && (
          <>
            {/* Lesson Info */}
            {lesson && (
              <div className="lesson-info-card">
                <div className="lesson-info__header">
                  <h3>�� {lesson.title}</h3>
                  <p className="lesson-info__course">{lesson.courseTitle} • {lesson.sectionTitle}</p>
                </div>
                <div className="lesson-info__stats">
                  <div className="stat-item">
                    <span className="stat-icon">📝</span>
                    <span className="stat-value">{assignments.length}</span>
                    <span className="stat-label">Bài tập</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">👥</span>
                    <span className="stat-value">
                      {assignments.reduce((total, a) => total + a.submissionsCount, 0)}
                    </span>
                    <span className="stat-label">Lượt nộp</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-icon">📊</span>
                    <span className="stat-value">
                      {assignments.length > 0
                        ? Math.round(assignments.reduce((total, a) => total + a.averageScore, 0) / assignments.length)
                        : 0
                      }%
                    </span>
                    <span className="stat-label">Điểm TB</span>
                  </div>
                </div>
              </div>
            )}

            {/* Header Actions */}
            <div className="assignments-header">
              <h3>Danh sách bài tập</h3>
              <button
                onClick={() => setShowAddAssignment(true)}
                className="teacher-dashboard__btn teacher-dashboard__btn--primary"
              >
                ➕ Tạo bài tập mới
              </button>
            </div>

            {/* Add Assignment Form */}
            {showAddAssignment && (
              <div className="add-assignment-form">
                <form onSubmit={handleAssignmentSubmit}>
                  <div className="form-header">
                    <h4>Tạo bài tập mới cho khóa học: {selectedCourse.title}</h4>
                    <button
                      type="button"
                      onClick={() => setShowAddAssignment(false)}
                      className="close-btn"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Tiêu đề bài tập *</label>
                      <input
                        type="text"
                        value={newAssignment.title}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Nhập tiêu đề bài tập"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Loại bài tập *</label>
                      <select
                        value={newAssignment.type}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, type: e.target.value as 'file' | 'quiz' }))}
                      >
                        <option value="file">Nộp file</option>
                        <option value="quiz">Bài quiz</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Mô tả</label>
                    <textarea
                      value={newAssignment.description}
                      onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Mô tả chi tiết về bài tập"
                      rows={3}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Hạn nộp</label>
                      <input
                        type="datetime-local"
                        value={newAssignment.dueDate}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))}
                      />
                    </div>
                    <div className="form-group">
                      <label>Điểm tối đa</label>
                      <input
                        type="number"
                        value={newAssignment.maxScore}
                        onChange={(e) => setNewAssignment(prev => ({ ...prev, maxScore: parseInt(e.target.value) }))}
                        min="1"
                        max="1000"
                      />
                    </div>
                  </div>

                  {newAssignment.type === 'file' && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>URL file bài tập</label>
                        <input
                          type="url"
                          value={newAssignment.fileUrl}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, fileUrl: e.target.value }))}
                          placeholder="https://example.com/assignment.pdf"
                        />
                      </div>
                      <div className="form-group">
                        <label>Tên file</label>
                        <input
                          type="text"
                          value={newAssignment.fileName}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, fileName: e.target.value }))}
                          placeholder="assignment.pdf"
                        />
                      </div>
                    </div>
                  )}

                  {newAssignment.type === 'quiz' && (
                    <div className="quiz-settings">
                      <div className="form-group">
                        <label>Thời gian làm bài (phút)</label>
                        <input
                          type="number"
                          value={newAssignment.timeLimit}
                          onChange={(e) => setNewAssignment(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                          min="1"
                          max="300"
                        />
                      </div>

                      <div className="questions-section">
                        <div className="questions-header">
                          <h5>Câu hỏi ({newAssignment.questions.length})</h5>
                          <button
                            type="button"
                            onClick={addQuestion}
                            className="add-question-btn"
                          >
                            ➕ Thêm câu hỏi
                          </button>
                        </div>

                        {newAssignment.questions.map((question, index) => (
                          <div key={question._id} className="question-item">
                            <div className="question-header">
                              <span className="question-number">Câu {index + 1}</span>
                              <button
                                type="button"
                                onClick={() => removeQuestion(index)}
                                className="remove-question-btn"
                              >
                                🗑️
                              </button>
                            </div>

                            <div className="form-group">
                              <label>Câu hỏi</label>
                              <textarea
                                value={question.question}
                                onChange={(e) => updateQuestion(index, { question: e.target.value })}
                                placeholder="Nhập câu hỏi"
                                rows={2}
                              />
                            </div>

                            <div className="form-row">
                              <div className="form-group">
                                <label>Loại câu hỏi</label>
                                <select
                                  value={question.type}
                                  onChange={(e) => updateQuestion(index, { type: e.target.value as any })}>
                                  <option value="multiple_choice">Trắc nghiệm</option>
                                  <option value="true_false">Đúng/Sai</option>
                                  <option value="short_answer">Tự luận ngắn</option>
                                </select>
                              </div>
                              <div className="form-group">
                                <label>Điểm</label>
                                <input
                                  type="number"
                                  value={question.points}
                                  onChange={(e) => updateQuestion(index, { points: parseInt(e.target.value) })}
                                  min="1"
                                  max="100"
                                />
                              </div>
                            </div>

                            {question.type === 'multiple_choice' && (
                              <div className="options-section">
                                <label>Lựa chọn</label>
                                {question.options?.map((option, optionIndex) => (
                                  <div key={optionIndex} className="option-input">
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) => {
                                        const newOptions = [...(question.options || [])];
                                        newOptions[optionIndex] = e.target.value;
                                        updateQuestion(index, { options: newOptions });
                                      }}
                                      placeholder={`Lựa chọn ${optionIndex + 1}`}
                                    />
                                    <input
                                      type="radio"
                                      name={`correct_${index}`}
                                      checked={question.correctAnswer === option}
                                      onChange={() => updateQuestion(index, { correctAnswer: option })}
                                    />
                                  </div>
                                ))}
                              </div>
                            )}

                            {question.type === 'true_false' && (
                              <div className="true-false-section">
                                <label>Đáp án đúng</label>
                                <div className="radio-group">
                                  <label>
                                    <input
                                      type="radio"
                                      name={`correct_${index}`}
                                      value="true"
                                      checked={question.correctAnswer === 'true'}
                                      onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                                    />
                                    Đúng
                                  </label>
                                  <label>
                                    <input
                                      type="radio"
                                      name={`correct_${index}`}
                                      value="false"
                                      checked={question.correctAnswer === 'false'}
                                      onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                                    />
                                    Sai
                                  </label>
                                </div>
                              </div>
                            )}

                            {question.type === 'short_answer' && (
                              <div className="form-group">
                                <label>Đáp án mẫu</label>
                                <input
                                  type="text"
                                  value={question.correctAnswer as string}
                                  onChange={(e) => updateQuestion(index, { correctAnswer: e.target.value })}
                                  placeholder="Đáp án mẫu"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <button
                      type="button"
                      onClick={() => setShowAddAssignment(false)}
                      className="teacher-dashboard__btn teacher-dashboard__btn--outline"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="teacher-dashboard__btn teacher-dashboard__btn--primary"
                    >
                      Tạo bài tập
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Assignments List */}
            <div className="assignments-list">
              {assignments.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>Chưa có bài tập nào</h3>
                  <p>Tạo bài tập đầu tiên để học viên có thể thực hành và kiểm tra kiến thức.</p>
                </div>
              ) : (
                assignments.map((assignment) => (
                  <div key={assignment._id} className="assignment-card">
                    <div className="assignment-header">
                      <div className="assignment-info">
                        <div className="assignment-type-icon">
                          {getAssignmentTypeIcon(assignment.type)}
                        </div>
                        <div className="assignment-content">
                          <h4 className="assignment-title">{assignment.title}</h4>
                          <p className="assignment-description">{assignment.description}</p>
                          <div className="assignment-meta">
                            <span className="meta-item">
                              <span className="meta-icon">📅</span>
                              Hạn nộp: {formatDate(assignment.dueDate)}
                            </span>
                            <span className="meta-item">
                              <span className="meta-icon">🎯</span>
                              Điểm tối đa: {assignment.maxScore}
                            </span>
                            <span className="meta-item">
                              <span className="meta-icon">👥</span>
                              {assignment.submissionsCount} lượt nộp
                            </span>
                            {assignment.submissionsCount > 0 && (
                              <span className="meta-item">
                                <span className="meta-icon">📊</span>
                                Điểm TB: {assignment.averageScore.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="assignment-status">
                        <span className={`status-badge ${assignment.isPublished ? 'published' : 'draft'}`}>
                          {assignment.isPublished ? '✅ Đã xuất bản' : '📝 Bản nháp'}
                        </span>
                      </div>
                    </div>

                    <div className="assignment-details">
                      {assignment.type === 'file' && assignment.fileUrl && (
                        <div className="file-info">
                          <span className="file-icon">📁</span>
                          <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                            {assignment.fileName || 'Tải file bài tập'}
                          </a>
                          {assignment.fileSize && (
                            <span className="file-size">({formatFileSize(assignment.fileSize)})</span>
                          )}
                        </div>
                      )}

                      {assignment.type === 'quiz' && assignment.questions && (
                        <div className="quiz-info">
                          <span className="quiz-icon">❓</span>
                          <span className="quiz-details">
                            {assignment.questions.length} câu hỏi
                            {assignment.timeLimit && ` • ${assignment.timeLimit} phút`}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="assignment-actions">
                      <button
                        onClick={() => setPreviewAssignment(previewAssignment === assignment._id ? null : assignment._id)}
                        className="teacher-dashboard__btn teacher-dashboard__btn--outline"
                      >
                        {previewAssignment === assignment._id ? '🔽 Ẩn xem trước' : '👁️ Xem trước'}
                      </button>
                      <button
                        onClick={() => setEditingAssignment(editingAssignment === assignment._id ? null : assignment._id)}
                        className="teacher-dashboard__btn teacher-dashboard__btn--secondary"
                      >
                        ✏️ Chỉnh sửa
                      </button>
                      <button
                        onClick={() => toggleAssignmentStatus(assignment._id)}
                        className={`teacher-dashboard__btn ${assignment.isPublished
                            ? 'teacher-dashboard__btn--outline'
                            : 'teacher-dashboard__btn--primary'
                          }`}
                      >
                        {assignment.isPublished ? '�� Bỏ xuất bản' : '🚀 Xuất bản'}
                      </button>
                      <button
                        onClick={() => deleteAssignment(assignment._id)}
                        className="teacher-dashboard__btn teacher-dashboard__btn--outline delete-btn"
                      >
                        🗑️ Xóa
                      </button>
                    </div>

                    {/* Preview Assignment */}
                    {previewAssignment === assignment._id && (
                      <div className="assignment-preview">
                        <h5>Xem trước bài tập</h5>
                        {assignment.type === 'quiz' && assignment.questions ? (
                          <div className="quiz-preview">
                            {assignment.questions.map((question, index) => (
                              <div key={question._id} className="preview-question">
                                <div className="question-header">
                                  <span className="question-number">Câu {index + 1}</span>
                                  <span className="question-points">({question.points} điểm)</span>
                                </div>
                                <p className="question-text">{question.question}</p>

                                {question.type === 'multiple_choice' && question.options && (
                                  <div className="options-preview">
                                    {question.options.map((option, optionIndex) => (
                                      <div key={optionIndex} className="option-preview">
                                        <input
                                          type="radio"
                                          name={`preview_${question._id}`}
                                          disabled
                                        />
                                        <span>{option}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {question.type === 'true_false' && (
                                  <div className="true-false-preview">
                                    <label>
                                      <input type="radio" name={`preview_${question._id}`} disabled />
                                      Đúng
                                    </label>
                                    <label>
                                      <input type="radio" name={`preview_${question._id}`} disabled />
                                      Sai
                                    </label>
                                  </div>
                                )}

                                {question.type === 'short_answer' && (
                                  <div className="short-answer-preview">
                                    <input
                                      type="text"
                                      placeholder="Nhập câu trả lời"
                                      disabled
                                      className="answer-input"
                                    />
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="file-preview">
                            <p>�� Bài tập yêu cầu nộp file</p>
                            {assignment.fileUrl && (
                              <a href={assignment.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                                Xem file bài tập
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentsManager;