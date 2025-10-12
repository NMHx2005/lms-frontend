import React from 'react';
import './LearningSidebar.css';

interface Lesson {
  id: string;
  _id?: string;
  title: string;
  type: 'video' | 'text' | 'file' | 'link' | 'quiz' | 'assignment';
  duration?: number;
  estimatedTime?: number;
  isCompleted?: boolean;
  isLocked?: boolean;
  order?: number;
}

interface Section {
  id: string;
  _id?: string;
  title: string;
  description?: string;
  lessons: Lesson[];
  isExpanded: boolean;
  order?: number;
}

interface LearningSidebarProps {
  courseId: string;
  currentLessonId: string;
  onLessonSelect: (lessonId: string) => void;
  sections: Section[];
  onSectionToggle: (sectionId: string) => void;
}

const LearningSidebar: React.FC<LearningSidebarProps> = ({
  currentLessonId,
  onLessonSelect,
  sections,
  onSectionToggle
}) => {
  const getProgressPercentage = () => {
    const totalLessons = sections.reduce((acc, section) => acc + section.lessons.length, 0);
    const completedLessons = sections.reduce((acc, section) =>
      acc + section.lessons.filter(lesson => lesson.isCompleted).length, 0
    );
    return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  };

  const formatDuration = (minutes?: number) => {
    if (!minutes) return '0 phút';
    if (minutes < 60) return `${minutes} phút`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <div className="udemy-sidebar">
      <div className="udemy-sidebar__header">
        <h3 className="udemy-sidebar__title">Nội dung khóa học</h3>
        <div className="udemy-sidebar__progress">
          <div className="udemy-sidebar__progress-bar">
            <div
              className="udemy-sidebar__progress-fill"
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>
          <span className="udemy-sidebar__progress-text">
            {getProgressPercentage()}% hoàn thành
          </span>
        </div>
      </div>

      <div className="udemy-sidebar__content">
        {sections.map((section, sectionIndex) => (
          <div key={section.id || section._id} className="udemy-sidebar__section">
            <button
              className="udemy-sidebar__section-header"
              onClick={() => onSectionToggle(section.id || section._id || '')}
            >
              <span className="udemy-sidebar__section-title">
                Phần {sectionIndex + 1}: {section.title}
              </span>
              <span className="udemy-sidebar__section-toggle">
                {section.isExpanded ? '−' : '+'}
              </span>
            </button>

            {section.isExpanded && (
              <div className="udemy-sidebar__lessons">
                {section.lessons.map((lesson, lessonIndex) => {
                  const lessonId = lesson.id || lesson._id || '';
                  const duration = lesson.duration || lesson.estimatedTime || 0;

                  return (
                    <button
                      key={lessonId}
                      className={`udemy-sidebar__lesson ${currentLessonId === lessonId ? 'udemy-sidebar__lesson--active' : ''
                        } ${lesson.isCompleted ? 'udemy-sidebar__lesson--completed' : ''}`}
                      onClick={() => onLessonSelect(lessonId)}
                    >
                      <div className="udemy-sidebar__lesson-content">
                        <div className="udemy-sidebar__lesson-title">
                          {lessonIndex + 1}. {lesson.title}
                        </div>
                        <div className="udemy-sidebar__lesson-meta">
                          <span className="udemy-sidebar__lesson-duration">
                            {formatDuration(duration)}
                          </span>
                          {lesson.isCompleted && (
                            <span className="udemy-sidebar__lesson-completed">Hoàn thành</span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="udemy-sidebar__footer">
        <div className="udemy-sidebar__stats">
          <div className="udemy-sidebar__stat">
            <span className="udemy-sidebar__stat-label">Tổng bài học:</span>
            <span className="udemy-sidebar__stat-value">
              {sections.reduce((acc, section) => acc + section.lessons.length, 0)}
            </span>
          </div>
          <div className="udemy-sidebar__stat">
            <span className="udemy-sidebar__stat-label">Đã hoàn thành:</span>
            <span className="udemy-sidebar__stat-value">
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
