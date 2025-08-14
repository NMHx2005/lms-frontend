import React, { useState } from 'react';
import { Submission } from './types';
import './SubmissionHistory.css';

interface SubmissionHistoryProps {
  submissions: Submission[];
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ submissions }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'graded' | 'late'>('all');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return { text: 'Chờ chấm', class: 'submission-history__status--pending' };
      case 'graded':
        return { text: 'Đã chấm', class: 'submission-history__status--graded' };
      case 'late':
        return { text: 'Nộp muộn', class: 'submission-history__status--late' };
      default:
        return { text: 'Không xác định', class: 'submission-history__status--unknown' };
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'submission-history__score--excellent';
    if (score >= 80) return 'submission-history__score--good';
    if (score >= 70) return 'submission-history__score--average';
    if (score >= 60) return 'submission-history__score--pass';
    return 'submission-history__score--fail';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

    if (diffInDays > 0) return `${diffInDays} ngày trước`;
    if (diffInHours > 0) return `${diffInHours} giờ trước`;
    if (diffInMinutes > 0) return `${diffInMinutes} phút trước`;
    return 'Vừa xong';
  };

  const getFileIcon = (type: string): string => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('image')) return '🖼️';
    if (type.includes('video')) return '🎥';
    if (type.includes('audio')) return '🎵';
    if (type.includes('zip') || type.includes('rar')) return '📦';
    if (type.includes('word') || type.includes('document')) return '📝';
    if (type.includes('excel') || type.includes('spreadsheet')) return '📊';
    if (type.includes('powerpoint') || type.includes('presentation')) return '📊';
    return '📎';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter(submission => filterStatus === 'all' || submission.status === filterStatus)
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
        case 'score':
          if (!a.score && !b.score) return 0;
          if (!a.score) return 1;
          if (!b.score) return -1;
          return b.score - a.score;
        case 'status':
          const statusOrder = { pending: 0, graded: 1, late: 2 };
          return statusOrder[a.status] - statusOrder[b.status];
        default:
          return 0;
      }
    });

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    graded: submissions.filter(s => s.status === 'graded').length,
    late: submissions.filter(s => s.status === 'late').length,
    averageScore: submissions
      .filter(s => s.score !== undefined)
      .reduce((acc, s) => acc + (s.score || 0), 0) / 
      submissions.filter(s => s.score !== undefined).length || 0
  };

  if (submissions.length === 0) {
    return (
      <div className="submission-history">
        <div className="submission-history__empty">
          <div className="submission-history__empty-icon">📚</div>
          <h3 className="submission-history__empty-title">Chưa có bài nộp nào</h3>
          <p className="submission-history__empty-text">
            Bạn chưa nộp bài tập này. Hãy chuyển sang tab "Nộp bài" để bắt đầu làm bài.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="submission-history">
      <div className="submission-history__header">
        <h2 className="submission-history__title">Lịch sử nộp bài</h2>
        <div className="submission-history__stats">
          <div className="submission-history__stat">
            <span className="submission-history__stat-label">Tổng số:</span>
            <span className="submission-history__stat-value">{stats.total}</span>
          </div>
          <div className="submission-history__stat">
            <span className="submission-history__stat-label">Chờ chấm:</span>
            <span className="submission-history__stat-value">{stats.pending}</span>
          </div>
          <div className="submission-history__stat">
            <span className="submission-history__stat-label">Đã chấm:</span>
            <span className="submission-history__stat-value">{stats.graded}</span>
          </div>
          <div className="submission-history__stat">
            <span className="submission-history__stat-label">Nộp muộn:</span>
            <span className="submission-history__stat-value">{stats.late}</span>
          </div>
          {stats.averageScore > 0 && (
            <div className="submission-history__stat">
              <span className="submission-history__stat-label">Điểm TB:</span>
              <span className="submission-history__stat-value">
                {stats.averageScore.toFixed(1)}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="submission-history__controls">
        <div className="submission-history__filter">
          <label className="submission-history__filter-label">Lọc theo trạng thái:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="submission-history__filter-select"
          >
            <option value="all">Tất cả</option>
            <option value="pending">Chờ chấm</option>
            <option value="graded">Đã chấm</option>
            <option value="late">Nộp muộn</option>
          </select>
        </div>

        <div className="submission-history__sort">
          <label className="submission-history__sort-label">Sắp xếp theo:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="submission-history__sort-select"
          >
            <option value="date">Ngày nộp</option>
            <option value="score">Điểm số</option>
            <option value="status">Trạng thái</option>
          </select>
        </div>
      </div>

      <div className="submission-history__list">
        {filteredSubmissions.map((submission) => (
          <div key={submission.id} className="submission-history__item">
            <div className="submission-history__item-header">
              <div className="submission-history__item-info">
                <div className="submission-history__item-meta">
                  <span className="submission-history__item-date">
                    {formatDate(submission.submittedAt)}
                  </span>
                  <span className="submission-history__item-time">
                    ({formatTimeAgo(submission.submittedAt)})
                  </span>
                  <span className="submission-history__item-type">
                    {submission.type === 'file' ? '📁 File' : 
                     submission.type === 'quiz' ? '❓ Quiz' : '📝 Văn bản'}
                  </span>
                </div>
                
                <div className="submission-history__item-status">
                  {(() => {
                    const status = getStatusBadge(submission.status);
                    return (
                      <span className={`submission-history__status-badge ${status.class}`}>
                        {status.text}
                      </span>
                    );
                  })()}
                </div>

                {submission.score !== undefined && (
                  <div className="submission-history__item-score">
                    <span className={`submission-history__score ${getScoreColor(submission.score)}`}>
                      {submission.score} điểm
                    </span>
                  </div>
                )}
              </div>

              <div className="submission-history__item-actions">
                <button
                  onClick={() => setSelectedSubmission(
                    selectedSubmission === submission.id ? null : submission.id
                  )}
                  className="submission-history__toggle-btn"
                >
                  {selectedSubmission === submission.id ? 'Thu gọn' : 'Xem chi tiết'}
                </button>
              </div>
            </div>

            {selectedSubmission === submission.id && (
              <div className="submission-history__item-details">
                {submission.files && submission.files.length > 0 && (
                  <div className="submission-history__detail-section">
                    <h4 className="submission-history__detail-title">Files đã nộp:</h4>
                    <div className="submission-history__files">
                      {submission.files.map((file, index) => (
                        <div key={index} className="submission-history__file">
                          <span className="submission-history__file-icon">
                            {getFileIcon(file.type)}
                          </span>
                          <div className="submission-history__file-info">
                            <span className="submission-history__file-name">{file.name}</span>
                            <span className="submission-history__file-size">
                              {formatFileSize(file.size)}
                            </span>
                          </div>
                          <a 
                            href={file.url} 
                            className="submission-history__file-download"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Tải xuống
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {submission.quizAnswers && submission.quizAnswers.length > 0 && (
                  <div className="submission-history__detail-section">
                    <h4 className="submission-history__detail-title">Câu trả lời:</h4>
                    <div className="submission-history__answers">
                      {submission.quizAnswers.map((answer, index) => (
                        <div key={index} className="submission-history__answer">
                          <span className="submission-history__answer-number">Câu {index + 1}:</span>
                          <p className="submission-history__answer-text">{answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {submission.textSubmission && (
                  <div className="submission-history__detail-section">
                    <h4 className="submission-history__detail-title">Nội dung bài làm:</h4>
                    <div className="submission-history__text-content">
                      {submission.textSubmission}
                    </div>
                  </div>
                )}

                {submission.comment && (
                  <div className="submission-history__detail-section">
                    <h4 className="submission-history__detail-title">Ghi chú:</h4>
                    <div className="submission-history__comment">
                      {submission.comment}
                    </div>
                  </div>
                )}

                {submission.feedback && (
                  <div className="submission-history__detail-section">
                    <h4 className="submission-history__detail-title">Phản hồi từ giảng viên:</h4>
                    <div className="submission-history__feedback">
                      <div className="submission-history__feedback-content">
                        {submission.feedback}
                      </div>
                      {submission.gradedAt && submission.gradedBy && (
                        <div className="submission-history__feedback-meta">
                          <span className="submission-history__feedback-grader">
                            Chấm bởi: {submission.gradedBy}
                          </span>
                          <span className="submission-history__feedback-date">
                            {formatDate(submission.gradedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="submission-history__summary">
        <div className="submission-history__summary-item">
          <span className="submission-history__summary-label">Tổng cộng:</span>
          <span className="submission-history__summary-value">
            {filteredSubmissions.length} bài nộp
          </span>
        </div>
        {stats.averageScore > 0 && (
          <div className="submission-history__summary-item">
            <span className="submission-history__summary-label">Điểm trung bình:</span>
            <span className="submission-history__summary-value">
              {stats.averageScore.toFixed(1)} điểm
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionHistory;
