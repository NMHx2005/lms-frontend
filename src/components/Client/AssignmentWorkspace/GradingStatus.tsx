import React, { useState } from 'react';
import { Submission } from './types';
import './GradingStatus.css';

interface GradingStatusProps {
  submissions: Submission[];
  maxScore: number;
}

const GradingStatus: React.FC<GradingStatusProps> = ({ submissions, maxScore }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const getStatusIcon = (status: string): string => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'graded':
        return '✅';
      case 'late':
        return '⏰';
      default:
        return '❓';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
        return 'grading-status__status--pending';
      case 'graded':
        return 'grading-status__status--graded';
      case 'late':
        return 'grading-status__status--late';
      default:
        return 'grading-status__status--unknown';
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'grading-status__score--excellent';
    if (score >= 80) return 'grading-status__score--good';
    if (score >= 70) return 'grading-status__score--average';
    if (score >= 60) return 'grading-status__score--pass';
    return 'grading-status__score--fail';
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

  const calculateAverageScore = (): number => {
    const gradedSubmissions = submissions.filter(s => s.score !== undefined);
    if (gradedSubmissions.length === 0) return 0;
    return gradedSubmissions.reduce((acc, s) => acc + (s.score || 0), 0) / gradedSubmissions.length;
  };

  const getHighestScore = (): number => {
    const scores = submissions.filter(s => s.score !== undefined).map(s => s.score || 0);
    return scores.length > 0 ? Math.max(...scores) : 0;
  };

  const getLowestScore = (): number => {
    const scores = submissions.filter(s => s.score !== undefined).map(s => s.score || 0);
    return scores.length > 0 ? Math.min(...scores) : 0;
  };

  const getProgressPercentage = (): number => {
    const totalSubmissions = submissions.length;
    const gradedSubmissions = submissions.filter(s => s.status === 'graded').length;
    return totalSubmissions > 0 ? (gradedSubmissions / totalSubmissions) * 100 : 0;
  };

  const stats = {
    total: submissions.length,
    pending: submissions.filter(s => s.status === 'pending').length,
    graded: submissions.filter(s => s.status === 'graded').length,
    late: submissions.filter(s => s.status === 'late').length,
    averageScore: calculateAverageScore(),
    highestScore: getHighestScore(),
    lowestScore: getLowestScore(),
    progressPercentage: getProgressPercentage()
  };

  if (submissions.length === 0) {
    return (
      <div className="grading-status">
        <div className="grading-status__empty">
          <div className="grading-status__empty-icon">📊</div>
          <h3 className="grading-status__empty-title">Chưa có bài nộp nào</h3>
          <p className="grading-status__empty-text">
            Bạn chưa nộp bài tập này. Hãy chuyển sang tab "Nộp bài" để bắt đầu làm bài.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grading-status">
      <div className="grading-status__header">
        <h2 className="grading-status__title">Trạng thái chấm điểm</h2>
        <div className="grading-status__overview">
          <div className="grading-status__overview-item">
            <span className="grading-status__overview-label">Tổng số bài:</span>
            <span className="grading-status__overview-value">{stats.total}</span>
          </div>
          <div className="grading-status__overview-item">
            <span className="grading-status__overview-label">Đã chấm:</span>
            <span className="grading-status__overview-value">{stats.graded}</span>
          </div>
          <div className="grading-status__overview-item">
            <span className="grading-status__overview-label">Chờ chấm:</span>
            <span className="grading-status__overview-value">{stats.pending}</span>
          </div>
          <div className="grading-status__overview-item">
            <span className="grading-status__overview-label">Nộp muộn:</span>
            <span className="grading-status__overview-value">{stats.late}</span>
          </div>
        </div>
      </div>

      <div className="grading-status__progress">
        <div className="grading-status__progress-header">
          <h3 className="grading-status__progress-title">Tiến độ chấm điểm</h3>
          <span className="grading-status__progress-percentage">
            {stats.progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="grading-status__progress-bar">
          <div 
            className="grading-status__progress-fill"
            style={{ width: `${stats.progressPercentage}%` }}
          ></div>
        </div>
        <div className="grading-status__progress-stats">
          <span className="grading-status__progress-stat">
            {stats.graded} / {stats.total} bài đã chấm
          </span>
        </div>
      </div>

      <div className="grading-status__scores">
        <h3 className="grading-status__scores-title">Tổng quan điểm số</h3>
        <div className="grading-status__score-cards">
          <div className="grading-status__score-card">
            <div className="grading-status__score-card-icon">🏆</div>
            <div className="grading-status__score-card-content">
              <span className="grading-status__score-card-label">Điểm cao nhất</span>
              <span className="grading-status__score-card-value">
                {stats.highestScore > 0 ? `${stats.highestScore} điểm` : 'Chưa có'}
              </span>
            </div>
          </div>
          
          <div className="grading-status__score-card">
            <div className="grading-status__score-card-icon">📊</div>
            <div className="grading-status__score-card-content">
              <span className="grading-status__score-card-label">Điểm trung bình</span>
              <span className="grading-status__score-card-value">
                {stats.averageScore > 0 ? `${stats.averageScore.toFixed(1)} điểm` : 'Chưa có'}
              </span>
            </div>
          </div>
          
          <div className="grading-status__score-card">
            <div className="grading-status__score-card-icon">📉</div>
            <div className="grading-status__score-card-content">
              <span className="grading-status__score-card-label">Điểm thấp nhất</span>
              <span className="grading-status__score-card-value">
                {stats.lowestScore > 0 ? `${stats.lowestScore} điểm` : 'Chưa có'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grading-status__breakdown">
        <h3 className="grading-status__breakdown-title">Phân tích trạng thái</h3>
        <div className="grading-status__breakdown-cards">
          <div className="grading-status__breakdown-card">
            <div className="grading-status__breakdown-card-header">
              <span className="grading-status__breakdown-card-icon">⏳</span>
              <span className="grading-status__breakdown-card-title">Chờ chấm</span>
            </div>
            <div className="grading-status__breakdown-card-value">{stats.pending}</div>
            <div className="grading-status__breakdown-card-percentage">
              {stats.total > 0 ? ((stats.pending / stats.total) * 100).toFixed(1) : 0}%
            </div>
          </div>
          
          <div className="grading-status__breakdown-card">
            <div className="grading-status__breakdown-card-header">
              <span className="grading-status__breakdown-card-icon">✅</span>
              <span className="grading-status__breakdown-card-title">Đã chấm</span>
            </div>
            <div className="grading-status__breakdown-card-value">{stats.graded}</div>
            <div className="grading-status__breakdown-card-percentage">
              {stats.total > 0 ? ((stats.graded / stats.total) * 100).toFixed(1) : 0}%
            </div>
          </div>
          
          <div className="grading-status__breakdown-card">
            <div className="grading-status__breakdown-card-header">
              <span className="grading-status__breakdown-card-icon">⏰</span>
              <span className="grading-status__breakdown-card-title">Nộp muộn</span>
            </div>
            <div className="grading-status__breakdown-card-value">{stats.late}</div>
            <div className="grading-status__breakdown-card-percentage">
              {stats.total > 0 ? ((stats.late / stats.total) * 100).toFixed(1) : 0}%
            </div>
          </div>
        </div>
      </div>

      <div className="grading-status__submissions">
        <h3 className="grading-status__submissions-title">Danh sách bài nộp</h3>
        <div className="grading-status__submissions-list">
          {submissions.map((submission) => (
            <div key={submission.id} className="grading-status__submission">
              <div className="grading-status__submission-header">
                <div className="grading-status__submission-info">
                  <div className="grading-status__submission-meta">
                    <span className="grading-status__submission-date">
                      {formatDate(submission.submittedAt)}
                    </span>
                    <span className="grading-status__submission-type">
                      {submission.type === 'file' ? '📁 File' : 
                       submission.type === 'quiz' ? '❓ Quiz' : '📝 Văn bản'}
                    </span>
                  </div>
                  
                  <div className="grading-status__submission-status">
                    <span className={`grading-status__status-badge ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)} {submission.status === 'pending' ? 'Chờ chấm' : 
                       submission.status === 'graded' ? 'Đã chấm' : 'Nộp muộn'}
                    </span>
                  </div>

                  {submission.score !== undefined && (
                    <div className="grading-status__submission-score">
                      <span className={`grading-status__score ${getScoreColor(submission.score)}`}>
                        {submission.score} / {maxScore} điểm
                      </span>
                    </div>
                  )}
                </div>

                <div className="grading-status__submission-actions">
                  <button
                    onClick={() => setSelectedSubmission(
                      selectedSubmission === submission.id ? null : submission.id
                    )}
                    className="grading-status__toggle-btn"
                  >
                    {selectedSubmission === submission.id ? 'Thu gọn' : 'Xem chi tiết'}
                  </button>
                </div>
              </div>

              {selectedSubmission === submission.id && (
                <div className="grading-status__submission-details">
                  {submission.feedback && (
                    <div className="grading-status__feedback-section">
                      <h4 className="grading-status__feedback-title">Phản hồi từ giảng viên:</h4>
                      <div className="grading-status__feedback-content">
                        {submission.feedback}
                      </div>
                      {submission.gradedAt && submission.gradedBy && (
                        <div className="grading-status__feedback-meta">
                          <span className="grading-status__feedback-grader">
                            Chấm bởi: {submission.gradedBy}
                          </span>
                          <span className="grading-status__feedback-date">
                            {formatDate(submission.gradedAt)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {submission.status === 'pending' && (
                    <div className="grading-status__pending-notice">
                      <div className="grading-status__pending-icon">⏳</div>
                      <div className="grading-status__pending-content">
                        <h4 className="grading-status__pending-title">Đang chờ chấm điểm</h4>
                        <p className="grading-status__pending-text">
                          Bài nộp của bạn đang được giảng viên chấm điểm. Vui lòng chờ trong thời gian sớm nhất!
                        </p>
                      </div>
                    </div>
                  )}

                  {submission.status === 'late' && (
                    <div className="grading-status__late-notice">
                      <div className="grading-status__late-icon">⏰</div>
                      <div className="grading-status__late-content">
                        <h4 className="grading-status__late-title">Bài nộp muộn</h4>
                        <p className="grading-status__late-text">
                          Bài nộp này được gửi sau hạn chót. Có thể bị trừ điểm theo quy định của khóa học.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grading-status__summary">
        <div className="grading-status__summary-item">
          <span className="grading-status__summary-label">Tổng cộng:</span>
          <span className="grading-status__summary-value">
            {submissions.length} bài nộp
          </span>
        </div>
        {stats.averageScore > 0 && (
          <div className="grading-status__summary-item">
            <span className="grading-status__summary-label">Điểm trung bình:</span>
            <span className="grading-status__summary-value">
              {stats.averageScore.toFixed(1)} điểm
            </span>
          </div>
        )}
        <div className="grading-status__summary-item">
          <span className="grading-status__summary-label">Tỷ lệ hoàn thành:</span>
          <span className="grading-status__summary-value">
            {stats.progressPercentage.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default GradingStatus;
