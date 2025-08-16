import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './CommunicationCenter.css';

interface Message {
  _id: string;
  type: 'announcement' | 'personal' | 'course' | 'system';
  title: string;
  content: string;
  sender: {
    _id: string;
    name: string;
    avatar: string;
    role: 'teacher' | 'student' | 'admin';
  };
  recipients: {
    _id: string;
    name: string;
    email: string;
    courseId?: string;
  }[];
  courseId?: string;
  courseName?: string;
  status: 'draft' | 'sent' | 'read' | 'archived';
  createdAt: string;
  sentAt?: string;
  readAt?: string;
  attachments?: string[];
}

interface Course {
  _id: string;
  title: string;
  thumbnail: string;
  studentCount: number;
}

interface Student {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  courseId?: string;
  courseName?: string;
}

const CommunicationCenter: React.FC = () => {
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get('course');
  
  const [activeTab, setActiveTab] = useState<'compose' | 'sent' | 'received' | 'drafts' | 'templates'>('compose');
  const [messages, setMessages] = useState<Message[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Compose message state
  const [composeData, setComposeData] = useState({
    type: 'announcement' as const,
    title: '',
    content: '',
    courseId: courseId || '',
    recipientType: 'all' as 'all' | 'course' | 'specific',
    selectedStudents: [] as string[],
    scheduledSend: false,
    scheduledDate: '',
    attachments: [] as File[]
  });

  useEffect(() => {
    // Mock data - replace with API call
    setLoading(true);
    setTimeout(() => {
      const mockCourses: Course[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          thumbnail: '/images/course1.jpg',
          studentCount: 156
        },
        {
          _id: '2',
          title: 'Node.js Backend Development',
          thumbnail: '/images/course2.jpg',
          studentCount: 89
        },
        {
          _id: '3',
          title: 'UI/UX Design Fundamentals',
          thumbnail: '/images/course3.jpg',
          studentCount: 134
        }
      ];

      const mockStudents: Student[] = [
        {
          _id: '1',
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@email.com',
          avatar: '/images/avatar1.jpg',
          courseId: '1',
          courseName: 'React Advanced Patterns'
        },
        {
          _id: '2',
          name: 'Trần Thị B',
          email: 'tranthib@email.com',
          avatar: '/images/avatar2.jpg',
          courseId: '1',
          courseName: 'React Advanced Patterns'
        },
        {
          _id: '3',
          name: 'Lê Văn C',
          email: 'levanc@email.com',
          avatar: '/images/avatar3.jpg',
          courseId: '2',
          courseName: 'Node.js Backend Development'
        }
      ];

      const mockMessages: Message[] = [
        {
          _id: '1',
          type: 'announcement',
          title: 'Thông báo về bài tập mới',
          content: 'Các bạn hãy hoàn thành bài tập React Hooks trước ngày 25/06/2024 nhé!',
          sender: {
            _id: 'teacher1',
            name: 'Giảng viên Nguyễn',
            avatar: '/images/teacher1.jpg',
            role: 'teacher'
          },
          recipients: mockStudents,
          courseId: '1',
          courseName: 'React Advanced Patterns',
          status: 'sent',
          createdAt: '2024-06-20T10:00:00Z',
          sentAt: '2024-06-20T10:00:00Z'
        },
        {
          _id: '2',
          type: 'personal',
          title: 'Phản hồi về bài tập',
          content: 'Bạn đã làm rất tốt bài tập về useState và useEffect!',
          sender: {
            _id: 'teacher1',
            name: 'Giảng viên Nguyễn',
            avatar: '/images/teacher1.jpg',
            role: 'teacher'
          },
          recipients: [mockStudents[0]],
          status: 'sent',
          createdAt: '2024-06-19T15:30:00Z',
          sentAt: '2024-06-19T15:30:00Z'
        }
      ];

      setCourses(mockCourses);
      setStudents(mockStudents);
      setMessages(mockMessages);
      setLoading(false);
    }, 1000);
  }, []);

  const handleComposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message composition
    console.log('Composing message:', composeData);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setComposeData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setComposeData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const getMessageTypeIcon = (type: string) => {
    const icons = {
      announcement: '📢',
      personal: '💬',
      course: '📚',
      system: '⚙️'
    };
    return icons[type as keyof typeof icons] || '📧';
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Nháp', className: 'status-draft' },
      sent: { label: 'Đã gửi', className: 'status-sent' },
      read: { label: 'Đã đọc', className: 'status-read' },
      archived: { label: 'Đã lưu trữ', className: 'status-archived' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return <span className={`status-badge ${config.className}`}>{config.label}</span>;
  };

  if (loading) {
    return (
      <div className="communication-center-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải trung tâm giao tiếp...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="communication-center-page">
      {/* Header */}
      <div className="page-header">
        <h1>💬 Trung tâm giao tiếp</h1>
        <p>Giao tiếp với học viên và quản lý tin nhắn</p>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === 'compose' ? 'active' : ''}`}
          onClick={() => setActiveTab('compose')}
        >
          ✏️ Soạn tin nhắn
        </button>
        <button
          className={`tab-btn ${activeTab === 'sent' ? 'active' : ''}`}
          onClick={() => setActiveTab('sent')}
        >
          📤 Đã gửi
        </button>
        <button
          className={`tab-btn ${activeTab === 'received' ? 'active' : ''}`}
          onClick={() => setActiveTab('received')}
        >
          📥 Đã nhận
        </button>
        <button
          className={`tab-btn ${activeTab === 'drafts' ? 'active' : ''}`}
          onClick={() => setActiveTab('drafts')}
        >
          📝 Nháp
        </button>
        <button
          className={`tab-btn ${activeTab === 'templates' ? 'active' : ''}`}
          onClick={() => setActiveTab('templates')}
        >
          📋 Mẫu tin nhắn
        </button>
      </div>

      {/* Content */}
      <div className="tab-content">
        {activeTab === 'compose' && (
          <div className="compose-section">
            <h2>Soạn tin nhắn mới</h2>
            
            <form onSubmit={handleComposeSubmit} className="compose-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Loại tin nhắn</label>
                  <select
                    value={composeData.type}
                    onChange={(e) => setComposeData(prev => ({ ...prev, type: e.target.value as any }))}
                    className="form-select"
                  >
                    <option value="announcement">📢 Thông báo chung</option>
                    <option value="course">📚 Thông báo khóa học</option>
                    <option value="personal">💬 Tin nhắn cá nhân</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tiêu đề</label>
                  <input
                    type="text"
                    value={composeData.title}
                    onChange={(e) => setComposeData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Nhập tiêu đề tin nhắn..."
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Nội dung</label>
                <textarea
                  value={composeData.content}
                  onChange={(e) => setComposeData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Nhập nội dung tin nhắn..."
                  className="form-textarea"
                  rows={6}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Người nhận</label>
                  <select
                    value={composeData.recipientType}
                    onChange={(e) => setComposeData(prev => ({ ...prev, recipientType: e.target.value as any }))}
                    className="form-select"
                  >
                    <option value="all">Tất cả học viên</option>
                    <option value="course">Theo khóa học</option>
                    <option value="specific">Chọn học viên cụ thể</option>
                  </select>
                </div>

                {composeData.recipientType === 'course' && (
                  <div className="form-group">
                    <label>Khóa học</label>
                    <select
                      value={composeData.courseId}
                      onChange={(e) => setComposeData(prev => ({ ...prev, courseId: e.target.value }))}
                      className="form-select"
                      required
                    >
                      <option value="">Chọn khóa học</option>
                      {courses.map(course => (
                        <option key={course._id} value={course._id}>
                          {course.title} ({course.studentCount} học viên)
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {composeData.recipientType === 'specific' && (
                  <div className="form-group">
                    <label>Chọn học viên</label>
                    <div className="students-selector">
                      {students.map(student => (
                        <label key={student._id} className="student-checkbox">
                          <input
                            type="checkbox"
                            checked={composeData.selectedStudents.includes(student._id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setComposeData(prev => ({
                                  ...prev,
                                  selectedStudents: [...prev.selectedStudents, student._id]
                                }));
                              } else {
                                setComposeData(prev => ({
                                  ...prev,
                                  selectedStudents: prev.selectedStudents.filter(id => id !== student._id)
                                }));
                              }
                            }}
                          />
                          <img src={student.avatar} alt={student.name} className="student-avatar-small" />
                          <span>{student.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Gửi ngay</label>
                  <input
                    type="checkbox"
                    checked={!composeData.scheduledSend}
                    onChange={(e) => setComposeData(prev => ({ ...prev, scheduledSend: !e.target.checked }))}
                    className="form-checkbox"
                  />
                </div>

                {composeData.scheduledSend && (
                  <div className="form-group">
                    <label>Lên lịch gửi</label>
                    <input
                      type="datetime-local"
                      value={composeData.scheduledDate}
                      onChange={(e) => setComposeData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                      className="form-input"
                      required
                    />
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Tệp đính kèm</label>
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="form-file-input"
                />
                {composeData.attachments.length > 0 && (
                  <div className="attachments-list">
                    {composeData.attachments.map((file, index) => (
                      <div key={index} className="attachment-item">
                        <span>📎 {file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeAttachment(index)}
                          className="remove-attachment-btn"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary">
                  💾 Lưu nháp
                </button>
                <button type="submit" className="btn btn-primary">
                  📤 Gửi tin nhắn
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'sent' && (
          <div className="messages-section">
            <h2>Tin nhắn đã gửi</h2>
            <div className="messages-list">
              {messages.filter(msg => msg.status === 'sent').map(message => (
                <div key={message._id} className="message-card sent">
                  <div className="message-header">
                    <div className="message-type">
                      {getMessageTypeIcon(message.type)}
                      <span className="message-title">{message.title}</span>
                    </div>
                    <div className="message-meta">
                      {getStatusBadge(message.status)}
                      <span className="message-date">
                        {new Date(message.sentAt || message.createdAt).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="message-content">
                    <p>{message.content}</p>
                  </div>

                  <div className="message-footer">
                    <div className="message-recipients">
                      <span>Gửi đến: {message.recipients.length} người</span>
                      {message.courseName && (
                        <span className="course-tag">📚 {message.courseName}</span>
                      )}
                    </div>
                    
                    <div className="message-actions">
                      <button className="action-btn" title="Xem chi tiết">👁️</button>
                      <button className="action-btn" title="Gửi lại">🔄</button>
                      <button className="action-btn" title="Lưu trữ">📁</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'received' && (
          <div className="messages-section">
            <h2>Tin nhắn đã nhận</h2>
            <div className="empty-state">
              <p>Chưa có tin nhắn nào được nhận</p>
            </div>
          </div>
        )}

        {activeTab === 'drafts' && (
          <div className="messages-section">
            <h2>Tin nhắn nháp</h2>
            <div className="empty-state">
              <p>Chưa có tin nhắn nháp nào</p>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="templates-section">
            <h2>Mẫu tin nhắn</h2>
            <div className="templates-grid">
              <div className="template-card">
                <h3>📢 Thông báo bài tập mới</h3>
                <p>Mẫu thông báo khi có bài tập mới được giao</p>
                <button className="btn btn-outline">Sử dụng mẫu</button>
              </div>
              
              <div className="template-card">
                <h3>🎉 Chúc mừng hoàn thành</h3>
                <p>Mẫu chúc mừng học viên hoàn thành khóa học</p>
                <button className="btn btn-outline">Sử dụng mẫu</button>
              </div>
              
              <div className="template-card">
                <h3>📚 Nhắc nhở học tập</h3>
                <p>Mẫu nhắc nhở học viên tiếp tục học tập</p>
                <button className="btn btn-outline">Sử dụng mẫu</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/teacher/courses" className="action-link">
          📚 Quản lý khóa học
        </Link>
        <Link to="/teacher/analytics" className="action-link">
          📊 Xem thống kê
        </Link>
        <Link to="/teacher/earnings" className="action-link">
          💰 Xem thu nhập
        </Link>
      </div>
    </div>
  );
};

export default CommunicationCenter;
