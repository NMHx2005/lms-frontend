import React, { useState, useEffect, useRef } from 'react';
import { Assignment } from './types';
import './AssignmentSubmit.css';

interface AssignmentSubmitProps {
  assignment: Assignment;
}

const AssignmentSubmit: React.FC<AssignmentSubmitProps> = ({ assignment }) => {
  const [submissionType, setSubmissionType] = useState<'file' | 'quiz' | 'text'>(assignment.type);
  const [files, setFiles] = useState<File[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<string[]>([]);
  const [textSubmission, setTextSubmission] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize quiz answers based on assignment questions
  useEffect(() => {
    if (assignment.quizQuestions) {
      setQuizAnswers(new Array(assignment.quizQuestions.length).fill(''));
    }
  }, [assignment.quizQuestions]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    setSubmitError(null);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleQuizAnswerChange = (index: number, value: string) => {
    const newAnswers = [...quizAnswers];
    newAnswers[index] = value;
    setQuizAnswers(newAnswers);
  };

  const validateSubmission = (): boolean => {
    if (submissionType === 'file' && files.length === 0) {
      setSubmitError('Vui lòng chọn ít nhất một file để nộp');
      return false;
    }
    
    if (submissionType === 'quiz') {
      if (!assignment.quizQuestions || assignment.quizQuestions.length === 0) {
        setSubmitError('Không có câu hỏi quiz nào để trả lời');
        return false;
      }
      
      const requiredQuestions = assignment.quizQuestions.filter(q => q.required);
      const unansweredQuestions = requiredQuestions.filter((_, index) => 
        !quizAnswers[index] || quizAnswers[index].trim() === ''
      );
      
      if (unansweredQuestions.length > 0) {
        setSubmitError(`Vui lòng trả lời ${unansweredQuestions.length} câu hỏi bắt buộc`);
        return false;
      }
    }
    
    if (submissionType === 'text' && textSubmission.trim() === '') {
      setSubmitError('Vui lòng nhập nội dung bài làm');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateSubmission()) return;
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success - in real app, this would submit to backend
      console.log('Submission successful:', {
        type: submissionType,
        files,
        quizAnswers,
        textSubmission,
        comment
      });
      
      // Reset form
      setFiles([]);
      setQuizAnswers(assignment.quizQuestions ? new Array(assignment.quizQuestions.length).fill('') : []);
      setTextSubmission('');
      setComment('');
      
      // Show success message (you could use toast notification here)
      alert('Nộp bài thành công!');
      
    } catch (error) {
      setSubmitError('Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isOverdue = new Date() > new Date(assignment.dueDate);
  const timeRemaining = new Date(assignment.dueDate).getTime() - new Date().getTime();
  const daysRemaining = Math.ceil(timeRemaining / (1000 * 60 * 60 * 24));

  return (
    <div className="assignment-submit">
      <div className="assignment-submit__header">
        <h2 className="assignment-submit__title">Nộp bài tập</h2>
        <div className="assignment-submit__deadline">
          <span className="assignment-submit__deadline-label">Hạn nộp:</span>
          <span className={`assignment-submit__deadline-date ${isOverdue ? 'assignment-submit__deadline-date--expired' : ''}`}>
            {new Date(assignment.dueDate).toLocaleDateString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
          {!isOverdue && (
            <span className="assignment-submit__deadline-remaining">
              Còn {daysRemaining} ngày
            </span>
          )}
          {isOverdue && (
            <span className="assignment-submit__deadline-overdue">
              Đã quá hạn {Math.abs(daysRemaining)} ngày
            </span>
          )}
        </div>
      </div>

      <div className="assignment-submit__content">
        <div className="assignment-submit__section">
          <h3 className="assignment-submit__section-title">Chọn loại nộp bài</h3>
          <div className="assignment-submit__type-selector">
            <label className="assignment-submit__type-option">
              <input
                type="radio"
                name="submissionType"
                value="file"
                checked={submissionType === 'file'}
                onChange={(e) => setSubmissionType(e.target.value as 'file')}
              />
              <span className="assignment-submit__type-label">
                <span className="assignment-submit__type-icon">📁</span>
                Nộp file
              </span>
            </label>
            
            <label className="assignment-submit__type-option">
              <input
                type="radio"
                name="submissionType"
                value="quiz"
                checked={submissionType === 'quiz'}
                onChange={(e) => setSubmissionType(e.target.value as 'quiz')}
              />
              <span className="assignment-submit__type-label">
                <span className="assignment-submit__type-icon">❓</span>
                Trắc nghiệm
              </span>
            </label>
            
            <label className="assignment-submit__type-option">
              <input
                type="radio"
                name="submissionType"
                value="text"
                checked={submissionType === 'text'}
                onChange={(e) => setSubmissionType(e.target.value as 'text')}
              />
              <span className="assignment-submit__type-label">
                <span className="assignment-submit__type-icon">📝</span>
                Văn bản
              </span>
            </label>
          </div>
        </div>

        {submissionType === 'file' && (
          <div className="assignment-submit__section">
            <h3 className="assignment-submit__section-title">Upload file</h3>
            <div className="assignment-submit__file-upload">
              <div 
                className="assignment-submit__dropzone"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const droppedFiles = Array.from(e.dataTransfer.files);
                  setFiles(prev => [...prev, ...droppedFiles]);
                }}
              >
                <div className="assignment-submit__dropzone-icon">📁</div>
                <div className="assignment-submit__dropzone-text">
                  <strong>Click để chọn file</strong> hoặc kéo thả file vào đây
                </div>
                <div className="assignment-submit__dropzone-hint">
                  Hỗ trợ: PDF, DOC, ZIP, RAR, và các file code
                </div>
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileChange}
                className="assignment-submit__file-input"
                accept=".pdf,.doc,.docx,.zip,.rar,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css"
              />
            </div>

            {files.length > 0 && (
              <div className="assignment-submit__file-list">
                <h4 className="assignment-submit__file-list-title">Files đã chọn:</h4>
                {files.map((file, index) => (
                  <div key={index} className="assignment-submit__file-item">
                    <div className="assignment-submit__file-info">
                      <span className="assignment-submit__file-icon">📎</span>
                      <div className="assignment-submit__file-details">
                        <span className="assignment-submit__file-name">{file.name}</span>
                        <span className="assignment-submit__file-size">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="assignment-submit__file-remove"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {submissionType === 'quiz' && (
          <div className="assignment-submit__section">
            <h3 className="assignment-submit__section-title">Trả lời câu hỏi</h3>
            <div className="assignment-submit__quiz-questions">
              {assignment.quizQuestions?.map((question, index) => (
                <div key={question.id} className="assignment-submit__quiz-question">
                  <label className="assignment-submit__question-label">
                    Câu {index + 1}: {question.question}
                  </label>
                  {question.type === 'multiple-choice' && question.options && (
                    <div className="assignment-submit__question-options">
                      {question.options.map((option, optIndex) => (
                        <label key={optIndex} className="assignment-submit__question-option">
                          <input
                            type="radio"
                            name={`quiz-${question.id}`}
                            value={option}
                            checked={quizAnswers[index] === option}
                            onChange={(e) => handleQuizAnswerChange(index, e.target.value)}
                            className="assignment-submit__question-input"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  )}
                  {question.type === 'text' && (
                    <textarea
                      value={quizAnswers[index]}
                      onChange={(e) => handleQuizAnswerChange(index, e.target.value)}
                      className="assignment-submit__question-input"
                      placeholder="Nhập câu trả lời của bạn..."
                      rows={4}
                    />
                  )}
                  {question.type === 'file' && (
                    <input
                      type="file"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleQuizAnswerChange(index, file.name);
                        }
                      }}
                      className="assignment-submit__question-input"
                      accept=".pdf,.doc,.docx,.zip,.rar,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.html,.css"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {submissionType === 'text' && (
          <div className="assignment-submit__section">
            <h3 className="assignment-submit__section-title">Nội dung bài làm</h3>
            <div className="assignment-submit__text-editor">
              <textarea
                value={textSubmission}
                onChange={(e) => setTextSubmission(e.target.value)}
                className="assignment-submit__text-input"
                placeholder="Nhập nội dung bài làm của bạn..."
                rows={12}
              />
              <div className="assignment-submit__text-hint">
                Bạn có thể sử dụng Markdown để format text
              </div>
            </div>
          </div>
        )}

        <div className="assignment-submit__section">
          <h3 className="assignment-submit__section-title">Ghi chú (tùy chọn)</h3>
          <div className="assignment-submit__comment">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="assignment-submit__comment-input"
              placeholder="Thêm ghi chú hoặc giải thích cho bài làm của bạn..."
              rows={3}
            />
          </div>
        </div>

        {submitError && (
          <div className="assignment-submit__error">
            <span className="assignment-submit__error-icon">⚠️</span>
            <span className="assignment-submit__error-text">{submitError}</span>
          </div>
        )}

        <div className="assignment-submit__actions">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="assignment-submit__submit-btn"
          >
            {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
          </button>
          <button
            type="button"
            className="assignment-submit__cancel-btn"
            onClick={() => {
              setFiles([]);
              setQuizAnswers(assignment.quizQuestions ? new Array(assignment.quizQuestions.length).fill('') : []);
              setTextSubmission('');
              setComment('');
              setSubmitError(null);
            }}
          >
            Làm lại
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmit;
