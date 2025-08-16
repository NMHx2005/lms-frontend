import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarEvent, CalendarCourse } from '../../../types/index';
import './Calendar.css';

const Calendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [courses, setCourses] = useState<CalendarCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [filterCourse, setFilterCourse] = useState('');

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockCourses: CalendarCourse[] = [
        {
          _id: 'course1',
          title: 'React Advanced Patterns',
          color: '#3498db',
          lessons: [
            { _id: 'l1', title: 'Component Composition', duration: 45, type: 'video' },
            { _id: 'l2', title: 'State Management', duration: 60, type: 'video' },
            { _id: 'l3', title: 'Custom Hooks', duration: 30, type: 'video' }
          ]
        },
        {
          _id: 'course2',
          title: 'Node.js Backend Development',
          color: '#e74c3c',
          lessons: [
            { _id: 'l4', title: 'Express.js Basics', duration: 50, type: 'video' },
            { _id: 'l5', title: 'Database Integration', duration: 75, type: 'video' }
          ]
        },
        {
          _id: 'course3',
          title: 'UI/UX Design Fundamentals',
          color: '#2ecc71',
          lessons: [
            { _id: 'l6', title: 'Design Principles', duration: 40, type: 'video' },
            { _id: 'l7', title: 'Prototyping', duration: 55, type: 'video' }
          ]
        }
      ];

      const mockEvents: CalendarEvent[] = [
        {
          _id: '1',
          title: 'Component Composition',
          type: 'lesson',
          startDate: '2024-01-20T09:00:00Z',
          endDate: '2024-01-20T09:45:00Z',
          allDay: false,
          courseId: 'course1',
          courseTitle: 'React Advanced Patterns',
          description: 'Học về component composition patterns',
          priority: 'medium',
          isCompleted: false,
          color: '#3498db'
        },
        {
          _id: '2',
          title: 'Build Todo App',
          type: 'assignment',
          startDate: '2024-01-22T23:59:00Z',
          allDay: false,
          courseId: 'course1',
          courseTitle: 'React Advanced Patterns',
          description: 'Deadline nộp bài tập Todo App',
          priority: 'high',
          isCompleted: false,
          color: '#e74c3c'
        },
        {
          _id: '3',
          title: 'Express.js Basics',
          type: 'lesson',
          startDate: '2024-01-21T14:00:00Z',
          endDate: '2024-01-21T14:50:00Z',
          allDay: false,
          courseId: 'course2',
          courseTitle: 'Node.js Backend Development',
          description: 'Học về Express.js framework',
          priority: 'medium',
          isCompleted: false,
          color: '#e74c3c'
        },
        {
          _id: '4',
          title: 'API Documentation',
          type: 'assignment',
          startDate: '2024-01-25T23:59:00Z',
          allDay: false,
          courseId: 'course2',
          courseTitle: 'Node.js Backend Development',
          description: 'Nộp tài liệu API',
          priority: 'medium',
          isCompleted: false,
          color: '#e74c3c'
        },
        {
          _id: '5',
          title: 'Design Principles',
          type: 'lesson',
          startDate: '2024-01-23T10:00:00Z',
          endDate: '2024-01-23T10:40:00Z',
          allDay: false,
          courseId: 'course3',
          courseTitle: 'UI/UX Design Fundamentals',
          description: 'Học về các nguyên tắc thiết kế',
          priority: 'low',
          isCompleted: false,
          color: '#2ecc71'
        }
      ];

      setCourses(mockCourses);
      setEvents(mockEvents);
      setLoading(false);
    }, 1000);
  }, []);

  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    while (currentDate <= lastDay || days.length < 42) {
      days.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.startDate);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getWeekDays = (date: Date) => {
    const weekStart = new Date(date);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(weekStart);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setShowEventForm(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    // Handle event click - could open event details modal
    console.log('Event clicked:', event);
  };

  const handlePrevMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const filteredEvents = filterCourse 
    ? events.filter(event => event.courseId === filterCourse)
    : events;

  if (loading) {
    return (
      <div className="calendar-page">
        <div className="calendar-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải lịch học...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <h1>Lịch học 📅</h1>
        <p>Quản lý lịch học và deadline của bạn</p>
      </div>

      {/* Calendar Controls */}
      <div className="calendar-controls">
        <div className="view-controls">
          <button 
            className={`view-btn ${viewMode === 'month' ? 'active' : ''}`}
            onClick={() => setViewMode('month')}
          >
            Tháng
          </button>
          <button 
            className={`view-btn ${viewMode === 'week' ? 'active' : ''}`}
            onClick={() => setViewMode('week')}
          >
            Tuần
          </button>
          <button 
            className={`view-btn ${viewMode === 'day' ? 'active' : ''}`}
            onClick={() => setViewMode('day')}
          >
            Ngày
          </button>
        </div>

        <div className="navigation-controls">
          <button onClick={handlePrevMonth} className="nav-btn">‹</button>
          <button onClick={handleToday} className="today-btn">Hôm nay</button>
          <button onClick={handleNextMonth} className="nav-btn">›</button>
        </div>

        <div className="filter-controls">
          <select 
            value={filterCourse} 
            onChange={(e) => setFilterCourse(e.target.value)}
            className="course-filter"
          >
            <option value="">Tất cả khóa học</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Current Month/Year Display */}
      <div className="current-period">
        <h2>
          {currentDate.toLocaleDateString('vi-VN', { 
            month: 'long', 
            year: 'numeric' 
          })}
        </h2>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-container">
        {viewMode === 'month' && (
          <div className="month-view">
            {/* Weekday Headers */}
            <div className="weekday-headers">
              {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map(day => (
                <div key={day} className="weekday-header">{day}</div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="calendar-grid">
              {getMonthDays(currentDate).map((date, index) => {
                const dayEvents = getEventsForDate(date);
                const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                const isToday = date.toDateString() === new Date().toDateString();
                
                return (
                  <div 
                    key={index} 
                    className={`calendar-day ${!isCurrentMonth ? 'other-month' : ''} ${isToday ? 'today' : ''}`}
                    onClick={() => handleDateClick(date)}
                  >
                    <div className="day-number">{date.getDate()}</div>
                    <div className="day-events">
                      {dayEvents.slice(0, 3).map(event => (
                        <div
                          key={event._id}
                          className={`event-dot ${event.type} ${event.priority}`}
                          style={{ backgroundColor: event.color }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEventClick(event);
                          }}
                          title={event.title}
                        />
                      ))}
                      {dayEvents.length > 3 && (
                        <div className="more-events">+{dayEvents.length - 3}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'week' && (
          <div className="week-view">
            <div className="weekday-headers">
              {getWeekDays(currentDate).map(date => (
                <div key={date.toISOString()} className="weekday-header">
                  <div className="weekday-name">
                    {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                  </div>
                  <div className="weekday-date">{date.getDate()}</div>
                </div>
              ))}
            </div>
            
            <div className="week-grid">
              {getWeekDays(currentDate).map(date => {
                const dayEvents = getEventsForDate(date);
                return (
                  <div key={date.toISOString()} className="week-day">
                    {dayEvents.map(event => (
                      <div
                        key={event._id}
                        className={`week-event ${event.type}`}
                        style={{ backgroundColor: event.color }}
                        onClick={() => handleEventClick(event)}
                      >
                        <div className="event-time">
                          {formatTime(event.startDate)}
                        </div>
                        <div className="event-title">{event.title}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {viewMode === 'day' && (
          <div className="day-view">
            <div className="day-header">
              <h3>{formatDate(currentDate)}</h3>
            </div>
            
            <div className="day-events-list">
              {getEventsForDate(currentDate).map(event => (
                <div
                  key={event._id}
                  className={`day-event ${event.type} ${event.priority}`}
                  style={{ borderLeftColor: event.color }}
                >
                  <div className="event-time">
                    {formatTime(event.startDate)}
                  </div>
                  <div className="event-content">
                    <h4 className="event-title">{event.title}</h4>
                    <p className="event-course">{event.courseTitle}</p>
                    {event.description && (
                      <p className="event-description">{event.description}</p>
                    )}
                  </div>
                  <div className="event-actions">
                    <button className="complete-btn">
                      {event.isCompleted ? '✓' : '○'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="upcoming-events">
        <h3>Sự kiện sắp tới</h3>
        <div className="events-list">
          {filteredEvents
            .filter(event => new Date(event.startDate) > new Date())
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 5)
            .map(event => (
              <div
                key={event._id}
                className={`upcoming-event ${event.type} ${event.priority}`}
                style={{ borderLeftColor: event.color }}
              >
                <div className="event-date">
                  {formatDate(new Date(event.startDate))}
                </div>
                <div className="event-content">
                  <h4>{event.title}</h4>
                  <p>{event.courseTitle}</p>
                </div>
                <div className="event-actions">
                  <Link to={`/courses/${event.courseId}`} className="view-course-btn">
                    Xem khóa học
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          onClick={() => setShowEventForm(true)}
          className="add-event-btn"
        >
          ➕ Thêm sự kiện
        </button>
        <Link to="/dashboard/assignments" className="view-assignments-btn">
          📝 Xem bài tập
        </Link>
        <Link to="/dashboard/courses" className="view-courses-btn">
          📚 Khóa học của tôi
        </Link>
      </div>
    </div>
  );
};

export default Calendar;
