import React, { useState, useEffect } from 'react';
import './LearningContent.css';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'file' | 'link';
  content: string;
  duration: string;
  isCompleted: boolean;
}

interface LearningContentProps {
  lesson: Lesson;
  onComplete: (lessonId: string) => void;
  onProgressUpdate: (lessonId: string, progress: number) => void;
}

const LearningContent: React.FC<LearningContentProps> = ({
  lesson,
  onComplete,
  onProgressUpdate
}) => {
  const [videoProgress, setVideoProgress] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    // Reset progress when lesson changes
    setVideoProgress(0);
    setIsVideoPlaying(false);
  }, [lesson.id]);

  // const handleVideoProgress = (progress: number) => {
  //   setVideoProgress(progress);
  //   onProgressUpdate(lesson.id, progress);
    
  //   // Mark as completed when video is 90% watched
  //   if (progress >= 90 && !lesson.isCompleted) {
  //     onComplete(lesson.id);
  //   }
  // };

  const handleComplete = () => {
    if (!lesson.isCompleted) {
      onComplete(lesson.id);
    }
  };

  const renderVideoContent = () => (
    <div className="learning-content__video-container">
      <div className="learning-content__video-placeholder">
        <div className="learning-content__video-placeholder-icon">🎥</div>
        <h3>Video: {lesson.title}</h3>
        <p>Thời lượng: {lesson.duration}</p>
        <div className="learning-content__video-controls">
          <button
            className="learning-content__video-btn learning-content__video-btn--play"
            onClick={() => setIsVideoPlaying(!isVideoPlaying)}
          >
            {isVideoPlaying ? '⏸️ Tạm dừng' : '▶️ Phát'}
          </button>
          <button
            className="learning-content__video-btn learning-content__video-btn--complete"
            onClick={handleComplete}
            disabled={lesson.isCompleted}
          >
            {lesson.isCompleted ? '✅ Đã hoàn thành' : '✓ Đánh dấu hoàn thành'}
          </button>
        </div>
        <div className="learning-content__video-progress">
          <div className="learning-content__video-progress-bar">
            <div 
              className="learning-content__video-progress-fill"
              style={{ width: `${videoProgress}%` }}
            ></div>
          </div>
          <span className="learning-content__video-progress-text">
            {Math.round(videoProgress)}% đã xem
          </span>
        </div>
      </div>
    </div>
  );

  const renderTextContent = () => (
    <div className="learning-content__text-container">
      <div className="learning-content__text-header">
        <h3>{lesson.title}</h3>
        <div className="learning-content__text-meta">
          <span>📖 Bài đọc</span>
          <span>⏱️ {lesson.duration}</span>
        </div>
      </div>
      <div className="learning-content__text-content">
        <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
      </div>
      <div className="learning-content__text-actions">
        <button
          className="learning-content__text-btn learning-content__text-btn--complete"
          onClick={handleComplete}
          disabled={lesson.isCompleted}
        >
          {lesson.isCompleted ? '✅ Đã hoàn thành' : '✓ Đánh dấu hoàn thành'}
        </button>
      </div>
    </div>
  );

  const renderFileContent = () => (
    <div className="learning-content__file-container">
      <div className="learning-content__file-header">
        <h3>{lesson.title}</h3>
        <div className="learning-content__file-meta">
          <span>📄 Tài liệu</span>
          <span>⏱️ {lesson.duration}</span>
        </div>
      </div>
      <div className="learning-content__file-preview">
        <div className="learning-content__file-icon">📄</div>
        <p>Tài liệu: {lesson.content}</p>
        <button className="learning-content__file-download">
          📥 Tải xuống
        </button>
      </div>
      <div className="learning-content__file-actions">
        <button
          className="learning-content__file-btn learning-content__file-btn--complete"
          onClick={handleComplete}
          disabled={lesson.isCompleted}
        >
          {lesson.isCompleted ? '✅ Đã hoàn thành' : '✓ Đánh dấu hoàn thành'}
        </button>
      </div>
    </div>
  );

  const renderLinkContent = () => (
    <div className="learning-content__link-container">
      <div className="learning-content__link-header">
        <h3>{lesson.title}</h3>
        <div className="learning-content__link-meta">
          <span>🔗 Liên kết</span>
          <span>⏱️ {lesson.duration}</span>
        </div>
      </div>
      <div className="learning-content__link-content">
        <div className="learning-content__link-icon">🔗</div>
        <p>Liên kết: {lesson.content}</p>
        <a 
          href={lesson.content} 
          target="_blank" 
          rel="noopener noreferrer"
          className="learning-content__link-visit"
        >
          🌐 Truy cập liên kết
        </a>
      </div>
      <div className="learning-content__link-actions">
        <button
          className="learning-content__link-btn learning-content__link-btn--complete"
          onClick={handleComplete}
          disabled={lesson.isCompleted}
        >
          {lesson.isCompleted ? '✅ Đã hoàn thành' : '✓ Đánh dấu hoàn thành'}
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (lesson.type) {
      case 'video':
        return renderVideoContent();
      case 'text':
        return renderTextContent();
      case 'file':
        return renderFileContent();
      case 'link':
        return renderLinkContent();
      default:
        return <div>Loại nội dung không được hỗ trợ</div>;
    }
  };

  return (
    <div className="learning-content">
      <div className="learning-content__header">
        <div className="learning-content__breadcrumb">
          <span>Khóa học</span>
          <span>›</span>
          <span>{lesson.title}</span>
        </div>
        <div className="learning-content__actions">
          <button
            className="learning-content__action-btn learning-content__action-btn--notes"
            onClick={() => setShowNotes(!showNotes)}
          >
            📝 Ghi chú
          </button>
          <button className="learning-content__action-btn learning-content__action-btn--help">
            ❓ Trợ giúp
          </button>
        </div>
      </div>

      <div className="learning-content__main">
        {renderContent()}
      </div>

      {showNotes && (
        <div className="learning-content__notes">
          <div className="learning-content__notes-header">
            <h4>📝 Ghi chú của bạn</h4>
            <button
              className="learning-content__notes-close"
              onClick={() => setShowNotes(false)}
            >
              ✕
            </button>
          </div>
          <textarea
            className="learning-content__notes-textarea"
            placeholder="Viết ghi chú của bạn về bài học này..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={6}
          />
          <div className="learning-content__notes-actions">
            <button className="learning-content__notes-save">
              💾 Lưu ghi chú
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningContent;
