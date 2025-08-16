import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SubmissionsGrading.css';

interface Assignment {
  _id: string;
  title: string;
  description: string;
  type: 'file' | 'quiz';
  maxScore: number;
  dueDate: string;
  questions?: QuizQuestion[];
}

interface QuizQuestion {
  _id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

interface Submission {
  _id: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  studentAvatar: string;
  submittedAt: string;
  status: 'submitted' | 'graded' | 'late';
  score: number;
  maxScore: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  // File submission specific
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  // Quiz submission specific
  answers?: QuizAnswer[];
  timeSpent?: number; // in minutes
}

interface QuizAnswer {
  questionId: string;
  answer: string | string[];
  isCorrect?: boolean;
  points?: number;
}

const SubmissionsGrading: React.FC = () => {
  const { id: assignmentId } = useParams<{ id: string }>();
  // const navigate = useNavigate();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [gradingMode, setGradingMode] = useState<'list' | 'grading'>('list');
  const [currentGrading, setCurrentGrading] = useState<{
    submissionId: string;
    score: number;
    feedback: string;
  }>({
    submissionId: '',
    score: 0,
    feedback: ''
  });

  useEffect(() => {
    // Simulate API call to get assignment and submissions data
    setTimeout(() => {
      const mockAssignment: Assignment = {
        _id: assignmentId || '1',
        title: 'Bài tập thực hành useState',
        description: 'Tạo một ứng dụng counter sử dụng useState hook với các tính năng tăng, giảm và reset.',
        type: 'file',
        maxScore: 100,
        dueDate: '2024-02-01T23:59:00Z',
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
      };

      const mockSubmissions: Submission[] = [
        {
          _id: 's1',
          studentId: 'st1',
          studentName: 'Nguyễn Văn A',
          studentEmail: 'nguyenvana@example.com',
          studentAvatar: '/images/default-avatar.png',
          submittedAt: '2024-01-30T14:30:00Z',
          status: 'submitted',
          score: 0,
          maxScore: 100,
          fileUrl: 'https://example.com/submission1.zip',
          fileName: 'counter-app.zip',
          fileSize: 1048576
        },
        {
          _id: 's2',
          studentId: 'st2',
          studentName: 'Trần Thị B',
          studentEmail: 'tranthib@example.com',
          studentAvatar: '/images/default-avatar.png',
          submittedAt: '2024-01-31T09:15:00Z',
          status: 'graded',
          score: 85,
          maxScore: 100,
          feedback: 'Bài làm tốt, code rõ ràng và có comment. Cần cải thiện về responsive design.',
          gradedBy: 'Hieu Doan',
          gradedAt: '2024-02-01T10:00:00Z',
          fileUrl: 'https://example.com/submission2.zip',
          fileName: 'react-counter.zip',
          fileSize: 2097152
        },
        {
          _id: 's3',
          studentId: 'st3',
          studentName: 'Lê Văn C',
          studentEmail: 'levanc@example.com',
          studentAvatar: '/images/default-avatar.png',
          submittedAt: '2024-02-02T16:45:00Z',
          status: 'late',
          score: 0,
          maxScore: 100,
          fileUrl: 'https://example.com/submission3.zip',
          fileName: 'my-counter.zip',
          fileSize: 1572864
        }
      ];

      setAssignment(mockAssignment);
      setSubmissions(mockSubmissions);
      setLoading(false);
    }, 1000);
  }, [assignmentId]);

  const handleGradeSubmission = (submissionId: string) => {
    const submission = submissions.find(s => s._id === submissionId);
    if (submission) {
      setCurrentGrading({
        submissionId,
        score: submission.score,
        feedback: submission.feedback || ''
      });
      setSelectedSubmission(submissionId);
      setGradingMode('grading');
    }
  };

  const handleSaveGrade = () => {
    if (currentGrading.score < 0 || currentGrading.score > assignment!.maxScore) {
      alert('Điểm phải từ 0 đến ' + assignment!.maxScore);
      return;
    }

    setSubmissions(prev => prev.map(s => 
      s._id === currentGrading.submissionId 
        ? {
            ...s,
            score: currentGrading.score,
            feedback: currentGrading.feedback,
            status: 'graded' as const,
            gradedBy: 'Hieu Doan',
            gradedAt: new Date().toISOString()
          }
        : s
    ));

    setGradingMode('list');
    setSelectedSubmission(null);
    setCurrentGrading({
      submissionId: '',
      score: 0,
      feedback: ''
    });
  };

  const handleBackToList = () => {
    setGradingMode('list');
    setSelectedSubmission(null);
    setCurrentGrading({
      submissionId: '',
      score: 0,
      feedback: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      submitted: { label: 'Chờ chấm', class: 'status-badge--submitted' },
      graded: { label: 'Đã chấm', class: 'status-badge--graded' },
      late: { label: 'Nộp muộn', class: 'status-badge--late' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    );
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

  const getSubmissionStats = () => {
    const total = submissions.length;
    const submitted = submissions.filter(s => s.status === 'submitted').length;
    const graded = submissions.filter(s => s.status === 'graded').length;
    const late = submissions.filter(s => s.status === 'late').length;
    const averageScore = graded > 0 
      ? submissions
          .filter(s => s.status === 'graded')
          .reduce((sum, s) => sum + s.score, 0) / graded
      : 0;

    return { total, submitted, graded, late, averageScore };
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
            <span>Chấm điểm bài tập</span>
          </div>
          <h1 className="teacher-dashboard__title">Chấm điểm bài tập</h1>
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

  if (!assignment) return null;

  const stats = getSubmissionStats();

  if (gradingMode === 'grading' && selectedSubmission) {
    const submission = submissions.find(s => s._id === selectedSubmission);
    if (!submission) return null;

    return (
      <div className="teacher-dashboard">
        <div className="teacher-dashboard__header">
          <div className="teacher-dashboard__breadcrumbs">
            <span>Teacher Dashboard</span>
            <span>/</span>
            <span>Course Studio</span>
            <span>/</span>
            <span>Chấm điểm bài tập</span>
          </div>
          <h1 className="teacher-dashboard__title">Chấm điểm bài tập: {assignment.title}</h1>
        </div>

        <div className="teacher-dashboard__content">
          {/* Grading Header */}
          <div className="grading-header">
            <button
              onClick={handleBackToList}
              className="teacher-dashboard__btn teacher-dashboard__btn--outline"
            >
              ↩️ Quay lại danh sách
            </button>
            <h3>Chấm điểm bài nộp của {submission.studentName}</h3>
          </div>

          <div className="grading-content">
            {/* Student Info */}
            <div className="student-info-card">
              <div className="student-avatar">
                <img src={submission.studentAvatar} alt={submission.studentName} />
              </div>
              <div className="student-details">
                <h4>{submission.studentName}</h4>
                <p>{submission.studentEmail}</p>
                <div className="submission-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📅</span>
                    Nộp: {formatDate(submission.submittedAt)}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">⏰</span>
                    Trạng thái: {getStatusBadge(submission.status)}
                  </span>
                  {submission.timeSpent && (
                    <span className="meta-item">
                      <span className="meta-icon">⏱️</span>
                      Thời gian làm: {submission.timeSpent} phút
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Assignment Content */}
            <div className="assignment-content-card">
              <h4>Nội dung bài tập</h4>
              <p>{assignment.description}</p>
              
              {assignment.type === 'file' && submission.fileUrl && (
                <div className="submission-file">
                  <h5>File bài nộp</h5>
                  <div className="file-info">
                    <span className="file-icon">📁</span>
                    <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                      {submission.fileName || 'Tải file bài nộp'}
                    </a>
                    {submission.fileSize && (
                      <span className="file-size">({formatFileSize(submission.fileSize)})</span>
                    )}
                  </div>
                </div>
              )}

              {assignment.type === 'quiz' && submission.answers && (
                <div className="submission-answers">
                  <h5>Đáp án của học viên</h5>
                  {submission.answers.map((answer, index) => {
                    const question = assignment.questions?.find(q => q._id === answer.questionId);
                    if (!question) return null;

                    return (
                      <div key={answer.questionId} className="answer-item">
                        <div className="question-header">
                          <span className="question-number">Câu {index + 1}</span>
                          <span className="question-points">({question.points} điểm)</span>
                        </div>
                        <p className="question-text">{question.question}</p>
                        
                        <div className="student-answer">
                          <strong>Đáp án của học viên:</strong>
                          <span className="answer-text">
                            {Array.isArray(answer.answer) ? answer.answer.join(', ') : answer.answer}
                          </span>
                        </div>

                        <div className="correct-answer">
                          <strong>Đáp án đúng:</strong>
                          <span className="answer-text correct">
                            {Array.isArray(question.correctAnswer) 
                              ? question.correctAnswer.join(', ') 
                              : question.correctAnswer
                            }
                          </span>
                        </div>

                        <div className="answer-feedback">
                          <label>Điểm cho câu này:</label>
                          <input
                            type="number"
                            min="0"
                            max={question.points}
                            value={answer.points || 0}
                            onChange={(e) => {
                              const newAnswers = [...(submission.answers || [])];
                              const answerIndex = newAnswers.findIndex(a => a.questionId === answer.questionId);
                              if (answerIndex !== -1) {
                                newAnswers[answerIndex] = {
                                  ...newAnswers[answerIndex],
                                  points: parseInt(e.target.value) || 0
                                };
                              }
                              // Update submission in state
                              setSubmissions(prev => prev.map(s => 
                                s._id === submission._id 
                                  ? { ...s, answers: newAnswers }
                                  : s
                              ));
                            }}
                            className="points-input"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grading Form */}
            <div className="grading-form-card">
              <h4>Chấm điểm</h4>
              
              <div className="grading-form">
                <div className="form-group">
                  <label>Điểm số</label>
                  <div className="score-input-group">
                    <input
                      type="number"
                      min="0"
                      max={assignment.maxScore}
                      value={currentGrading.score}
                      onChange={(e) => setCurrentGrading(prev => ({
                        ...prev,
                        score: parseInt(e.target.value) || 0
                      }))}
                      className="score-input"
                    />
                    <span className="score-max">/ {assignment.maxScore}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Nhận xét và góp ý</label>
                  <textarea
                    value={currentGrading.feedback}
                    onChange={(e) => setCurrentGrading(prev => ({
                      ...prev,
                      feedback: e.target.value
                    }))}
                    placeholder="Nhập nhận xét và góp ý cho học viên..."
                    rows={4}
                    className="feedback-input"
                  />
                </div>

                <div className="grading-actions">
                  <button
                    onClick={handleBackToList}
                    className="teacher-dashboard__btn teacher-dashboard__btn--outline"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveGrade}
                    className="teacher-dashboard__btn teacher-dashboard__btn--primary"
                  >
                    💾 Lưu điểm và nhận xét
                  </button>
                </div>
              </div>
            </div>
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
          <span>Chấm điểm bài tập</span>
        </div>
        <h1 className="teacher-dashboard__title">Chấm điểm bài tập: {assignment.title}</h1>
      </div>

      <div className="teacher-dashboard__content">
        {/* Assignment Info */}
        <div className="assignment-info-card">
          <div className="assignment-header">
            <h3>📝 {assignment.title}</h3>
            <p className="assignment-description">{assignment.description}</p>
          </div>
          <div className="assignment-meta">
            <span className="meta-item">
              <span className="meta-icon">🎯</span>
              Điểm tối đa: {assignment.maxScore}
            </span>
            <span className="meta-item">
              <span className="meta-icon">📅</span>
              Hạn nộp: {formatDate(assignment.dueDate)}
            </span>
            <span className="meta-item">
              <span className="meta-icon">📁</span>
              Loại: {assignment.type === 'file' ? 'Nộp file' : 'Bài quiz'}
            </span>
          </div>
        </div>

        {/* Submissions Stats */}
        <div className="submissions-stats">
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Tổng bài nộp</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⏳</span>
            <span className="stat-value">{stats.submitted}</span>
            <span className="stat-label">Chờ chấm</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">✅</span>
            <span className="stat-value">{stats.graded}</span>
            <span className="stat-label">Đã chấm</span>
          </div>
          <div className="stat-item">
            <span className="stat-icon">⏰</span>
            <span className="stat-value">{stats.late}</span>
            <span className="stat-label">Nộp muộn</span>
          </div>
          {stats.graded > 0 && (
            <div className="stat-item">
              <span className="stat-icon">📈</span>
              <span className="stat-value">{stats.averageScore.toFixed(1)}</span>
              <span className="stat-label">Điểm TB</span>
            </div>
          )}
        </div>

        {/* Submissions List */}
        <div className="submissions-list">
          <div className="list-header">
            <h3>Danh sách bài nộp ({submissions.length})</h3>
            <div className="list-filters">
              <select className="status-filter">
                <option value="all">Tất cả trạng thái</option>
                <option value="submitted">Chờ chấm</option>
                <option value="graded">Đã chấm</option>
                <option value="late">Nộp muộn</option>
              </select>
            </div>
          </div>

          {submissions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📝</div>
              <h3>Chưa có bài nộp nào</h3>
              <p>Học viên chưa nộp bài tập này.</p>
            </div>
          ) : (
            <div className="submissions-grid">
              {submissions.map((submission) => (
                <div key={submission._id} className="submission-card">
                  <div className="submission-header">
                    <div className="student-info">
                      <div className="student-avatar">
                        <img src={submission.studentAvatar} alt={submission.studentName} />
                      </div>
                      <div className="student-details">
                        <h4 className="student-name">{submission.studentName}</h4>
                        <p className="student-email">{submission.studentEmail}</p>
                      </div>
                    </div>
                    <div className="submission-status">
                      {getStatusBadge(submission.status)}
                    </div>
                  </div>

                  <div className="submission-content">
                    <div className="submission-meta">
                      <span className="meta-item">
                        <span className="meta-icon">📅</span>
                        Nộp: {formatDate(submission.submittedAt)}
                      </span>
                      {submission.timeSpent && (
                        <span className="meta-item">
                          <span className="meta-icon">⏱️</span>
                          Thời gian: {submission.timeSpent} phút
                        </span>
                      )}
                    </div>

                    {submission.fileUrl && (
                      <div className="submission-file">
                        <span className="file-icon">📁</span>
                        <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="file-link">
                          {submission.fileName || 'Tải file bài nộp'}
                        </a>
                        {submission.fileSize && (
                          <span className="file-size">({formatFileSize(submission.fileSize)})</span>
                        )}
                      </div>
                    )}

                    {submission.status === 'graded' && (
                      <div className="grading-result">
                        <div className="score-display">
                          <span className="score-label">Điểm:</span>
                          <span className="score-value">
                            {submission.score} / {submission.maxScore}
                          </span>
                        </div>
                        {submission.feedback && (
                          <div className="feedback-preview">
                            <span className="feedback-label">Nhận xét:</span>
                            <p className="feedback-text">{submission.feedback}</p>
                          </div>
                        )}
                        <div className="grading-info">
                          <span className="graded-by">Chấm bởi: {submission.gradedBy}</span>
                          <span className="graded-at">Lúc: {formatDate(submission.gradedAt!)}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="submission-actions">
                    {submission.status === 'submitted' || submission.status === 'late' ? (
                      <button
                        onClick={() => handleGradeSubmission(submission._id)}
                        className="teacher-dashboard__btn teacher-dashboard__btn--primary"
                      >
                        ✏️ Chấm điểm
                      </button>
                    ) : (
                      <button
                        onClick={() => handleGradeSubmission(submission._id)}
                        className="teacher-dashboard__btn teacher-dashboard__btn--secondary"
                      >
                        ✏️ Chỉnh sửa điểm
                      </button>
                    )}
                    <button
                      onClick={() => window.open(submission.fileUrl, '_blank')}
                      className="teacher-dashboard__btn teacher-dashboard__btn--outline"
                    >
                      👁️ Xem bài nộp
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SubmissionsGrading;
