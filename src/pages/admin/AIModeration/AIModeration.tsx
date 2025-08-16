import React, { useState, useEffect } from 'react';
import './AIModeration.css';

interface AIModerationResult {
  _id: string;
  contentId: string;
  contentType: 'course' | 'comment' | 'review' | 'assignment';
  content: string;
  confidence: number;
  flagged: boolean;
  riskLevel: 'low' | 'medium' | 'high';
  categories: string[];
  suggestions: string[];
  processedAt: string;
  status: 'pending' | 'reviewed' | 'auto-approved' | 'auto-rejected';
  reviewedBy?: string;
  reviewNotes?: string;
}

interface AIModerationStats {
  totalProcessed: number;
  flaggedContent: number;
  autoApproved: number;
  autoRejected: number;
  pendingReview: number;
  accuracy: number;
  processingTime: number;
}

const AIModeration: React.FC = () => {
  const [moderationResults, setModerationResults] = useState<AIModerationResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<AIModerationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AIModerationStats | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    contentType: 'all',
    riskLevel: 'all',
    status: 'all'
  });
  const [selectedResults, setSelectedResults] = useState<string[]>([]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Simulate API call for AI moderation data
    setTimeout(() => {
      const mockResults: AIModerationResult[] = [
        {
          _id: '1',
          contentId: 'course-123',
          contentType: 'course',
          content: 'Advanced JavaScript Programming with Modern ES6+ Features',
          confidence: 0.94,
          flagged: false,
          riskLevel: 'low',
          categories: ['educational', 'programming'],
          suggestions: ['Content appears appropriate for educational platform'],
          processedAt: '2024-01-15T10:30:00Z',
          status: 'auto-approved'
        },
        {
          _id: '2',
          contentId: 'comment-456',
          contentType: 'comment',
          content: 'This course is absolutely terrible and the instructor should be fired immediately!',
          confidence: 0.89,
          flagged: true,
          riskLevel: 'high',
          categories: ['inappropriate', 'harassment', 'spam'],
          suggestions: ['Review for inappropriate language', 'Consider moderation action'],
          processedAt: '2024-01-15T11:15:00Z',
          status: 'pending'
        },
        {
          _id: '3',
          contentId: 'review-789',
          contentType: 'review',
          content: 'Great course! Learned a lot about React hooks and state management.',
          confidence: 0.97,
          flagged: false,
          riskLevel: 'low',
          categories: ['positive', 'educational'],
          suggestions: ['Content appears appropriate'],
          processedAt: '2024-01-15T12:00:00Z',
          status: 'auto-approved'
        },
        {
          _id: '4',
          contentId: 'assignment-101',
          contentType: 'assignment',
          content: 'Please submit your final project demonstrating understanding of the concepts covered in this course.',
          confidence: 0.92,
          flagged: false,
          riskLevel: 'low',
          categories: ['educational', 'assignment'],
          suggestions: ['Content appears appropriate'],
          processedAt: '2024-01-15T13:45:00Z',
          status: 'auto-approved'
        },
        {
          _id: '5',
          contentId: 'comment-202',
          contentType: 'comment',
          content: 'I think this course could be improved by adding more practical examples',
          confidence: 0.88,
          flagged: true,
          riskLevel: 'medium',
          categories: ['feedback', 'suggestion'],
          suggestions: ['Review for constructive feedback', 'May be appropriate with minor edits'],
          processedAt: '2024-01-15T14:20:00Z',
          status: 'pending'
        }
      ];

      const mockStats: AIModerationStats = {
        totalProcessed: 1247,
        flaggedContent: 23,
        autoApproved: 1189,
        autoRejected: 35,
        pendingReview: 18,
        accuracy: 94.2,
        processingTime: 2.3
      };

      setModerationResults(mockResults);
      setFilteredResults(mockResults);
      setStats(mockStats);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = moderationResults;

    if (filters.search) {
      filtered = filtered.filter(result =>
        result.content.toLowerCase().includes(filters.search.toLowerCase()) ||
        result.contentId.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.contentType !== 'all') {
      filtered = filtered.filter(result => result.contentType === filters.contentType);
    }

    if (filters.riskLevel !== 'all') {
      filtered = filtered.filter(result => result.riskLevel === filters.riskLevel);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(result => result.status === filters.status);
    }

    setFilteredResults(filtered);
  }, [moderationResults, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleResultSelection = (resultId: string) => {
    setSelectedResults(prev =>
      prev.includes(resultId)
        ? prev.filter(id => id !== resultId)
        : [...prev, resultId]
    );
  };

  // const handleSelectAll = () => {
  //   if (selectedResults.length === filteredResults.length) {
  //     setSelectedResults([]);
  //   } else {
  //     setSelectedResults(filteredResults.map(result => result._id));
  //   }
  // };

  const handleBulkAction = (action: string) => {
    // Simulate bulk actions
    console.log(`Bulk action: ${action} for ${selectedResults.length} items`);
    setSelectedResults([]);
  };

  const handleResultAction = (resultId: string, action: string) => {
    // Simulate individual result actions
    console.log(`Action: ${action} for result ${resultId}`);
  };

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'green';
      case 'medium': return 'yellow';
      case 'high': return 'red';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'auto-approved': return 'green';
      case 'auto-rejected': return 'red';
      case 'pending': return 'yellow';
      case 'reviewed': return 'blue';
      default: return 'gray';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  if (loading) {
    return (
      <div className="ai-moderation-loading">
        <div className="loading-spinner"></div>
        <p>Đang tải dữ liệu AI Moderation...</p>
      </div>
    );
  }

  return (
    <div className="ai-moderation">
      {/* Header */}
      <div className="ai-moderation-header">
        <div className="header-content">
          <h1>🤖 AI Moderation</h1>
          <p>Quản lý nội dung tự động với AI, phát hiện và xử lý nội dung không phù hợp</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => setShowSettings(!showSettings)}
          >
            ⚙️ Cài đặt AI
          </button>
          <button className="btn btn-primary">
            🔄 Cập nhật mô hình
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="ai-stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <div className="stat-value">{stats.totalProcessed.toLocaleString()}</div>
              <div className="stat-label">Tổng nội dung đã xử lý</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🚩</div>
            <div className="stat-content">
              <div className="stat-value">{stats.flaggedContent}</div>
              <div className="stat-label">Nội dung bị đánh dấu</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <div className="stat-value">{stats.autoApproved}</div>
              <div className="stat-label">Tự động phê duyệt</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-value">{stats.accuracy}%</div>
              <div className="stat-label">Độ chính xác</div>
            </div>
          </div>
        </div>
      )}

      {/* AI Settings Panel */}
      {showSettings && (
        <div className="ai-settings-panel">
          <h3>⚙️ Cài đặt AI Moderation</h3>
          <div className="settings-grid">
            <div className="setting-group">
              <label>Độ tin cậy tối thiểu:</label>
              <input type="range" min="0.5" max="1" step="0.05" defaultValue="0.8" />
              <span>80%</span>
            </div>
            <div className="setting-group">
              <label>Tự động từ chối nội dung có rủi ro:</label>
              <select defaultValue="high">
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
              </select>
            </div>
            <div className="setting-group">
              <label>Kích hoạt AI cho:</label>
              <div className="checkbox-group">
                <label><input type="checkbox" defaultChecked /> Khóa học</label>
                <label><input type="checkbox" defaultChecked /> Bình luận</label>
                <label><input type="checkbox" defaultChecked /> Đánh giá</label>
                <label><input type="checkbox" defaultChecked /> Bài tập</label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="ai-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="Tìm kiếm nội dung..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-group">
          <select
            value={filters.contentType}
            onChange={(e) => handleFilterChange('contentType', e.target.value)}
          >
            <option value="all">Tất cả loại nội dung</option>
            <option value="course">Khóa học</option>
            <option value="comment">Bình luận</option>
            <option value="review">Đánh giá</option>
            <option value="assignment">Bài tập</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={filters.riskLevel}
            onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
          >
            <option value="all">Tất cả mức rủi ro</option>
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
        </div>
        <div className="filter-group">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="pending">Chờ xem xét</option>
            <option value="auto-approved">Tự động phê duyệt</option>
            <option value="auto-rejected">Tự động từ chối</option>
            <option value="reviewed">Đã xem xét</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedResults.length > 0 && (
        <div className="bulk-actions-bar">
          <span>{selectedResults.length} mục được chọn</span>
          <div className="bulk-actions">
            <button 
              className="btn btn-success"
              onClick={() => handleBulkAction('approve')}
            >
              ✅ Phê duyệt
            </button>
            <button 
              className="btn btn-danger"
              onClick={() => handleBulkAction('reject')}
            >
              ❌ Từ chối
            </button>
            <button 
              className="btn btn-secondary"
              onClick={() => handleBulkAction('flag')}
            >
              🚩 Đánh dấu
            </button>
          </div>
        </div>
      )}

      {/* Results List */}
      <div className="ai-results-list">
        {filteredResults.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🤖</div>
            <h3>Không có kết quả nào</h3>
            <p>Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          filteredResults.map(result => (
            <div key={result._id} className={`ai-result-card ${result.flagged ? 'flagged' : ''}`}>
              <div className="result-header">
                <div className="result-selection">
                  <input
                    type="checkbox"
                    checked={selectedResults.includes(result._id)}
                    onChange={() => handleResultSelection(result._id)}
                  />
                </div>
                <div className="result-meta">
                  <span className={`content-type ${result.contentType}`}>
                    {result.contentType === 'course' && '📚'}
                    {result.contentType === 'comment' && '💬'}
                    {result.contentType === 'review' && '⭐'}
                    {result.contentType === 'assignment' && '📝'}
                    {result.contentType}
                  </span>
                  <span className="content-id">{result.contentId}</span>
                  <span className={`risk-level ${getRiskLevelColor(result.riskLevel)}`}>
                    {result.riskLevel === 'low' && '🟢'}
                    {result.riskLevel === 'medium' && '🟡'}
                    {result.riskLevel === 'high' && '🔴'}
                    {result.riskLevel}
                  </span>
                  <span className={`status ${getStatusColor(result.status)}`}>
                    {result.status === 'auto-approved' && '✅'}
                    {result.status === 'auto-rejected' && '❌'}
                    {result.status === 'pending' && '⏳'}
                    {result.status === 'reviewed' && '👁️'}
                    {result.status}
                  </span>
                </div>
                <div className="result-confidence">
                  <span className="confidence-label">Độ tin cậy:</span>
                  <span className="confidence-value">{Math.round(result.confidence * 100)}%</span>
                </div>
              </div>

              <div className="result-content">
                <div className="content-text">{result.content}</div>
                <div className="content-categories">
                  {result.categories.map(category => (
                    <span key={category} className="category-tag">{category}</span>
                  ))}
                </div>
              </div>

              <div className="result-suggestions">
                <h4>💡 Gợi ý AI:</h4>
                <ul>
                  {result.suggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>

              <div className="result-footer">
                <div className="result-timeline">
                  <span>Xử lý: {formatDate(result.processedAt)}</span>
                  {result.reviewedBy && (
                    <span>Xem xét bởi: {result.reviewedBy}</span>
                  )}
                </div>
                <div className="result-actions">
                  {result.status === 'pending' && (
                    <>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={() => handleResultAction(result._id, 'approve')}
                      >
                        ✅ Phê duyệt
                      </button>
                      <button 
                        className="btn btn-danger btn-sm"
                        onClick={() => handleResultAction(result._id, 'reject')}
                      >
                        ❌ Từ chối
                      </button>
                    </>
                  )}
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleResultAction(result._id, 'review')}
                  >
                    👁️ Xem chi tiết
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredResults.length > 0 && (
        <div className="pagination">
          <button className="btn btn-secondary">← Trước</button>
          <div className="page-numbers">
            <span className="page-number active">1</span>
            <span className="page-number">2</span>
            <span className="page-number">3</span>
          </div>
          <button className="btn btn-secondary">Sau →</button>
        </div>
      )}
    </div>
  );
};

export default AIModeration;
