// import React, { useState } from 'react';
import './LearningSidebar.css';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'file' | 'link';
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

interface LearningSidebarProps {
  courseId: string;
  currentLessonId: string;
  onLessonSelect: (lessonId: string) => void;
  sections: Section[];
  onSectionToggle: (sectionId: string) => void;
}

const LearningSidebar: React.FC<LearningSidebarProps> = ({
  // courseId,
  currentLessonId,
  onLessonSelect,
  sections,
  onSectionToggle
}) => {
  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return '🎥';
      case 'text':
        return '📖';
      case 'file':
        return '📄';
      case 'link':
        return '🔗';
      default:
        return '📚';
    }
  };

  const getProgressPercentage = () => {
    const totalLessons = sections.reduce((acc, section) => acc + section.lessons.length, 0);
    const completedLessons = sections.reduce((acc, section) => 
      acc + section.lessons.filter(lesson => lesson.isCompleted).length, 0
    );
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  return (
    <div className="learning-sidebar">
      <div className="learning-sidebar__header">
        <h3 className="learning-sidebar__title">Nội dung khóa học</h3>
        <div className="learning-sidebar__progress">
          <div className="learning-sidebar__progress-bar">
            <div 
              className="learning-sidebar__progress-fill" 
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="learning-sidebar__progress-text">
            {getProgressPercentage()}% hoàn thành
          </span>
        </div>
      </div>

      <div className="learning-sidebar__content">
        {sections.map((section) => (
          <div key={section.id} className="learning-sidebar__section">
            <button
              className="learning-sidebar__section-header"
              onClick={() => onSectionToggle(section.id)}
            >
              <span className="learning-sidebar__section-title">{section.title}</span>
              <span className="learning-sidebar__section-toggle">
                {section.isExpanded ? '▼' : '▶'}
              </span>
            </button>
            
            {section.isExpanded && (
              <div className="learning-sidebar__lessons">
                {section.lessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    className={`learning-sidebar__lesson ${
                      currentLessonId === lesson.id ? 'learning-sidebar__lesson--active' : ''
                    } ${lesson.isCompleted ? 'learning-sidebar__lesson--completed' : ''} ${
                      lesson.isLocked ? 'learning-sidebar__lesson--locked' : ''
                    }`}
                    onClick={() => !lesson.isLocked && onLessonSelect(lesson.id)}
                    disabled={lesson.isLocked}
                  >
                    <div className="learning-sidebar__lesson-icon">
                      {getLessonIcon(lesson.type)}
                    </div>
                    <div className="learning-sidebar__lesson-info">
                      <span className="learning-sidebar__lesson-title">{lesson.title}</span>
                      <span className="learning-sidebar__lesson-duration">{lesson.duration}</span>
                    </div>
                    <div className="learning-sidebar__lesson-status">
                      {lesson.isCompleted && <span className="learning-sidebar__lesson-check">✓</span>}
                      {lesson.isLocked && <span className="learning-sidebar__lesson-lock">🔒</span>}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="learning-sidebar__footer">
        <div className="learning-sidebar__stats">
          <div className="learning-sidebar__stat">
            <span className="learning-sidebar__stat-label">Tổng bài học:</span>
            <span className="learning-sidebar__stat-value">
              {sections.reduce((acc, section) => acc + section.lessons.length, 0)}
            </span>
          </div>
          <div className="learning-sidebar__stat">
            <span className="learning-sidebar__stat-label">Đã hoàn thành:</span>
            <span className="learning-sidebar__stat-value">
              {sections.reduce((acc, section) => 
                acc + section.lessons.filter(lesson => lesson.isCompleted).length, 0
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningSidebar;
