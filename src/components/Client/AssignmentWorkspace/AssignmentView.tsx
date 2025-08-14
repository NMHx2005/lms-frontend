import React from 'react';
import { Assignment } from './types';
import './AssignmentView.css';

interface AssignmentViewProps {
  assignment: Assignment;
}

const AssignmentView: React.FC<AssignmentViewProps> = ({ assignment }) => {
  const getStatusBadge = () => {
    const now = new Date();
    const dueDate = new Date(assignment.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (timeDiff < 0) {
      return { text: 'Đã hết hạn', class: 'assignment-view__status--expired' };
    } else if (daysDiff <= 1) {
      return { text: 'Sắp hết hạn', class: 'assignment-view__status--urgent' };
    } else if (daysDiff <= 3) {
      return { text: 'Cần nộp sớm', class: 'assignment-view__status--warning' };
    } else {
      return { text: 'Còn thời gian', class: 'assignment-view__status--normal' };
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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

  const statusBadge = getStatusBadge();
  const dueDate = new Date(assignment.dueDate);
  const now = new Date();
  const timeRemaining = dueDate.getTime() - now.getTime();
  const isExpired = timeRemaining < 0;

  return (
    <div className="assignment-view">
      <div className="assignment-view__header">
        <div className="assignment-view__status">
          <span className={`assignment-view__status-badge ${statusBadge.class}`}>
            {statusBadge.text}
          </span>
          <div className="assignment-view__deadline">
            <span className="assignment-view__deadline-label">Hạn nộp:</span>
            <span className={`assignment-view__deadline-date ${isExpired ? 'assignment-view__deadline-date--expired' : ''}`}>
              {dueDate.toLocaleDateString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
            {!isExpired && (
              <span className="assignment-view__deadline-remaining">
                Còn {Math.ceil(timeRemaining / (1000 * 3600 * 24))} ngày
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="assignment-view__content">
        <div className="assignment-view__section">
          <h2 className="assignment-view__section-title">Mô tả bài tập</h2>
          <div className="assignment-view__section-content">
            <p className="assignment-view__description">{assignment.description}</p>
          </div>
        </div>

        <div className="assignment-view__section">
          <h2 className="assignment-view__section-title">Hướng dẫn thực hiện</h2>
          <div className="assignment-view__section-content">
            <div className="assignment-view__instructions">
              {assignment.instructions.split('\n').map((instruction, index) => (
                <div key={index} className="assignment-view__instruction-item">
                  <span className="assignment-view__instruction-number">{index + 1}.</span>
                  <span className="assignment-view__instruction-text">{instruction}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="assignment-view__section">
          <h2 className="assignment-view__section-title">Tài liệu đính kèm</h2>
          <div className="assignment-view__section-content">
            <div className="assignment-view__attachments">
              {assignment.attachments.map((attachment, index) => (
                <div key={index} className="assignment-view__attachment">
                  <div className="assignment-view__attachment-icon">
                    {getFileIcon(attachment.type)}
                  </div>
                  <div className="assignment-view__attachment-info">
                    <div className="assignment-view__attachment-name">{attachment.name}</div>
                    <div className="assignment-view__attachment-meta">
                      <span className="assignment-view__attachment-size">
                        {formatFileSize(attachment.size)}
                      </span>
                      <span className="assignment-view__attachment-type">
                        {attachment.type.split('/')[1]?.toUpperCase() || 'FILE'}
                      </span>
                    </div>
                  </div>
                  <a 
                    href={attachment.url} 
                    className="assignment-view__attachment-download"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Tải xuống
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="assignment-view__section">
          <h2 className="assignment-view__section-title">Tiêu chí chấm điểm</h2>
          <div className="assignment-view__section-content">
            <div className="assignment-view__criteria">
              {assignment.gradingCriteria.map((criterion, index) => (
                <div key={index} className="assignment-view__criterion">
                  <span className="assignment-view__criterion-text">{criterion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="assignment-view__section">
          <h2 className="assignment-view__section-title">Lưu ý quan trọng</h2>
          <div className="assignment-view__section-content">
            <div className="assignment-view__notes">
              {assignment.importantNotes.map((note, index) => (
                <div key={index} className="assignment-view__note">
                  <span className="assignment-view__note-icon">⚠️</span>
                  <span className="assignment-view__note-text">{note}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="assignment-view__actions">
        <button className="assignment-view__action-btn assignment-view__action-btn--primary">
          Bắt đầu làm bài
        </button>
        <button className="assignment-view__action-btn assignment-view__action-btn--secondary">
          Tải tài liệu
        </button>
      </div>
    </div>
  );
};

export default AssignmentView;
