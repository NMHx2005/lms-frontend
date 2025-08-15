import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Ratings.css';

interface RatingAction {
  id: string;
  courseId: string;
  courseName: string;
  courseImage: string;
  actionType: 'upvotes' | 'reports';
  action: 'added' | 'removed';
  reason?: string;
  createdAt: string;
  canUndo: boolean;
}

const Ratings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'upvotes' | 'reports'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data
  const ratingActions: RatingAction[] = [
    {
      id: '1',
      courseId: '1',
      courseName: 'React Advanced Patterns',
      courseImage: '/images/apollo.png',
      actionType: 'upvotes',
      action: 'added',
      createdAt: '2024-01-15T10:30:00Z',
      canUndo: true
    },
    {
      id: '2',
      courseId: '2',
      courseName: 'Node.js Backend Development',
      courseImage: '/images/aptech.png',
      actionType: 'upvotes',
      action: 'removed',
      createdAt: '2024-01-14T14:20:00Z',
      canUndo: false
    },
    {
      id: '3',
      courseId: '3',
      courseName: 'UI/UX Design Fundamentals',
      courseImage: '/images/codegym.png',
      actionType: 'reports',
      action: 'added',
      reason: 'Nội dung không phù hợp với lứa tuổi',
      createdAt: '2024-01-13T16:45:00Z',
      canUndo: true
    },
    {
      id: '4',
      courseId: '4',
      courseName: 'Python Data Science',
      courseImage: '/images/funix.png',
      actionType: 'upvotes',
      action: 'added',
      createdAt: '2024-01-12T08:15:00Z',
      canUndo: true
    },
    {
      id: '5',
      courseId: '5',
      courseName: 'Machine Learning Basics',
      courseImage: '/images/rikedu.png',
      actionType: 'reports',
      action: 'removed',
      reason: 'Báo cáo sai, nội dung hoàn toàn phù hợp',
      createdAt: '2024-01-11T11:30:00Z',
      canUndo: false
    },
    {
      id: '6',
      courseId: '6',
      courseName: 'Web Development Bootcamp',
      courseImage: '/images/logo.png',
      actionType: 'upvotes',
      action: 'added',
      createdAt: '2024-01-10T09:45:00Z',
      canUndo: true
    }
  ];

  const filteredActions = ratingActions.filter(action => {
    const matchesTab = activeTab === 'all' || action.actionType === activeTab;
    const matchesSearch = action.courseName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getActionIcon = (actionType: string, action: string) => {
    if (actionType === 'upvotes') {
      return action === 'added' ? '👍' : '👎';
    } else {
      return action === 'added' ? '🚨' : '✅';
    }
  };

  const getActionLabel = (actionType: string, action: string) => {
    if (actionType === 'upvotes') {
      return action === 'added' ? 'Đã upvote' : 'Đã bỏ upvote';
    } else {
      return action === 'added' ? 'Đã báo cáo' : 'Đã hủy báo cáo';
    }
  };

  const getActionClass = (actionType: string, action: string) => {
    if (actionType === 'upvotes') {
      return action === 'added' ? 'action-badge--upvote-added' : 'action-badge--upvote-removed';
    } else {
      return action === 'added' ? 'action-badge--report-added' : 'action-badge--report-removed';
    }
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

  const handleUndoAction = (actionId: string) => {
    // Mock function - in real app this would call API
    console.log('Undoing action:', actionId);
    alert('Đã hủy hành động thành công!');
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__breadcrumbs">
          <Link to="/dashboard">Dashboard</Link>
          <span>Ratings & Reports</span>
        </div>
        <h1 className="dashboard__title">Lịch sử đánh giá & báo cáo</h1>
      </div>

      <div className="dashboard__content">
        {/* Tabs */}
        <div className="dashboard__tabs">
          <button
            className={`dashboard__tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            Tất cả
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'upvotes' ? 'active' : ''}`}
            onClick={() => setActiveTab('upvotes')}
          >
            Upvotes
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Báo cáo
          </button>
        </div>

        {/* Filter Bar */}
        <div className="dashboard__filter-bar">
          <div className="dashboard__search">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên khóa học..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>🔍</button>
          </div>
          <div className="dashboard__stats-summary">
            <div className="stat-item">
              <span className="stat-label">Tổng upvotes:</span>
              <span className="stat-value">{ratingActions.filter(a => a.actionType === 'upvotes' && a.action === 'added').length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Tổng báo cáo:</span>
              <span className="stat-value">{ratingActions.filter(a => a.actionType === 'reports' && a.action === 'added').length}</span>
            </div>
          </div>
        </div>

        {/* Rating Actions List */}
        <div className="dashboard__ratings">
          {filteredActions.length === 0 ? (
            <div className="dashboard__empty">
              <div className="dashboard__empty-icon">📊</div>
              <h3>Không có hoạt động nào</h3>
              <p>Bạn chưa có hoạt động đánh giá hoặc báo cáo nào hoặc không có hoạt động nào khớp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            <div className="dashboard__ratings-list">
              {filteredActions.map((action) => (
                <div key={action.id} className="dashboard__rating-card">
                  <div className="rating-card__header">
                    <div className="rating-card__course">
                      <img 
                        src={action.courseImage} 
                        alt={action.courseName}
                        className="rating-card__course-image"
                      />
                      <div className="rating-card__course-info">
                        <h4>{action.courseName}</h4>
                        <div className="rating-card__action-info">
                          <span className={`action-badge ${getActionClass(action.actionType, action.action)}`}>
                            {getActionIcon(action.actionType, action.action)} {getActionLabel(action.actionType, action.action)}
                          </span>
                          <span className="rating-card__date">{formatDate(action.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="rating-card__actions">
                      {action.canUndo && (
                        <button 
                          className="dashboard__btn dashboard__btn--outline"
                          onClick={() => handleUndoAction(action.id)}
                        >
                          Hủy hành động
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {action.reason && (
                    <div className="rating-card__content">
                      <div className="rating-card__reason">
                        <strong>Lý do:</strong> {action.reason}
                      </div>
                    </div>
                  )}
                  
                  <div className="rating-card__footer">
                    <div className="rating-card__meta">
                      <span className="meta-item">
                        <strong>Loại:</strong> {action.actionType === 'upvotes' ? 'Upvote' : 'Báo cáo'}
                      </span>
                      <span className="meta-item">
                        <strong>Hành động:</strong> {action.action === 'added' ? 'Thêm' : 'Xóa'}
                      </span>
                      <span className="meta-item">
                        <strong>Có thể hủy:</strong> {action.canUndo ? 'Có' : 'Không'}
                      </span>
                    </div>
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

export default Ratings;
