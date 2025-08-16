import React, { useState } from 'react';
import './AITools.css';

interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'content' | 'design' | 'analysis' | 'automation';
  isAvailable: boolean;
  usageCount: number;
  maxUsage: number;
}

const AITools: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'content' | 'design' | 'analysis' | 'automation'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const aiTools: AITool[] = [
    {
      id: '1',
      name: 'AI Avatar Generator',
      description: 'Tạo avatar chuyên nghiệp cho khóa học với AI',
      icon: '👤',
      category: 'design',
      isAvailable: true,
      usageCount: 12,
      maxUsage: 50
    },
    {
      id: '2',
      name: 'Thumbnail Designer',
      description: 'Thiết kế thumbnail hấp dẫn cho video và khóa học',
      icon: '🖼️',
      category: 'design',
      isAvailable: true,
      usageCount: 8,
      maxUsage: 30
    },
    {
      id: '3',
      name: 'Content Moderation',
      description: 'Kiểm tra và lọc nội dung không phù hợp',
      icon: '🛡️',
      category: 'content',
      isAvailable: true,
      usageCount: 25,
      maxUsage: 100
    },
    {
      id: '4',
      name: 'Auto Transcription',
      description: 'Chuyển đổi video thành văn bản tự động',
      icon: '📝',
      category: 'content',
      isAvailable: true,
      usageCount: 15,
      maxUsage: 40
    },
    {
      id: '5',
      name: 'Student Analytics',
      description: 'Phân tích hành vi và hiệu suất học tập của học viên',
      icon: '📊',
      category: 'analysis',
      isAvailable: false,
      usageCount: 0,
      maxUsage: 0
    },
    {
      id: '6',
      name: 'Smart Grading',
      description: 'Chấm điểm bài tập tự động với AI',
      icon: '✅',
      category: 'automation',
      isAvailable: false,
      usageCount: 0,
      maxUsage: 0
    },
    {
      id: '7',
      name: 'Course Structure Optimizer',
      description: 'Tối ưu hóa cấu trúc khóa học dựa trên dữ liệu',
      icon: '🏗️',
      category: 'analysis',
      isAvailable: true,
      usageCount: 3,
      maxUsage: 20
    },
    {
      id: '8',
      name: 'Auto Quiz Generator',
      description: 'Tạo câu hỏi trắc nghiệm từ nội dung khóa học',
      icon: '❓',
      category: 'automation',
      isAvailable: true,
      usageCount: 18,
      maxUsage: 60
    }
  ];

  const filteredTools = aiTools.filter(tool => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (category: string) => {
    const labels = {
      content: 'Nội dung',
      design: 'Thiết kế',
      analysis: 'Phân tích',
      automation: 'Tự động hóa'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      content: '📚',
      design: '🎨',
      analysis: '📊',
      automation: '🤖'
    };
    return icons[category as keyof typeof icons] || '🔧';
  };

  const getUsagePercentage = (usage: number, max: number) => {
    if (max === 0) return 0;
    return Math.min((usage / max) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage >= 80) return '#ef4444';
    if (percentage >= 60) return '#f59e0b';
    return '#10b981';
  };

  const handleToolClick = (tool: AITool) => {
    if (!tool.isAvailable) {
      alert('Công cụ này chưa có sẵn. Vui lòng nâng cấp gói để sử dụng!');
      return;
    }
    
    // Simulate tool usage
    console.log(`Using AI tool: ${tool.name}`);
    alert(`Đang mở ${tool.name}...`);
  };

  const getStatsSummary = () => {
    const total = aiTools.length;
    const available = aiTools.filter(t => t.isAvailable).length;
    const totalUsage = aiTools.reduce((sum, t) => sum + t.usageCount, 0);
    const totalMaxUsage = aiTools.reduce((sum, t) => sum + t.maxUsage, 0);

    return { total, available, totalUsage, totalMaxUsage };
  };

  const stats = getStatsSummary();

  return (
    <div className="teacher-dashboard">
      <div className="teacher-dashboard__header">
        <div className="teacher-dashboard__breadcrumbs">
          <span>Teacher Dashboard</span>
          <span>/</span>
          <span>AI Tools</span>
        </div>
        <h1 className="teacher-dashboard__title">AI Tools</h1>
      </div>

      <div className="teacher-dashboard__content">
        {/* Stats Overview */}
        <div className="ai-tools__stats">
          <div className="stat-card">
            <div className="stat-card__icon">🤖</div>
            <div className="stat-card__content">
              <h3>{stats.total}</h3>
              <p>Tổng công cụ AI</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">✅</div>
            <div className="stat-card__content">
              <h3>{stats.available}</h3>
              <p>Công cụ có sẵn</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">📊</div>
            <div className="stat-card__content">
              <h3>{stats.totalUsage}</h3>
              <p>Lượt sử dụng</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-card__icon">🎯</div>
            <div className="stat-card__content">
              <h3>{Math.round((stats.totalUsage / stats.totalMaxUsage) * 100)}%</h3>
              <p>Tỷ lệ sử dụng</p>
            </div>
          </div>
        </div>

        {/* Header Actions */}
        <div className="ai-tools__header-actions">
          <div className="ai-tools__search">
            <input
              type="text"
              placeholder="Tìm kiếm công cụ AI..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button>🔍</button>
          </div>
          <button className="teacher-dashboard__btn teacher-dashboard__btn--primary">
            🚀 Nâng cấp gói
          </button>
        </div>

        {/* Category Filter */}
        <div className="ai-tools__categories">
          <button
            className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('all')}
          >
            🌟 Tất cả
          </button>
          <button
            className={`category-btn ${selectedCategory === 'content' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('content')}
          >
            📚 Nội dung
          </button>
          <button
            className={`category-btn ${selectedCategory === 'design' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('design')}
          >
            🎨 Thiết kế
          </button>
          <button
            className={`category-btn ${selectedCategory === 'analysis' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('analysis')}
          >
            📊 Phân tích
          </button>
          <button
            className={`category-btn ${selectedCategory === 'automation' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('automation')}
          >
            🤖 Tự động hóa
          </button>
        </div>

        {/* AI Tools Grid */}
        <div className="ai-tools__grid">
          {filteredTools.length === 0 ? (
            <div className="ai-tools__empty">
              <div className="empty__icon">🤖</div>
              <h3>Không tìm thấy công cụ nào</h3>
              <p>Không có công cụ AI nào khớp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            filteredTools.map((tool) => (
              <div 
                key={tool.id} 
                className={`ai-tool-card ${!tool.isAvailable ? 'disabled' : ''}`}
                onClick={() => handleToolClick(tool)}
              >
                <div className="tool-card__header">
                  <div className="tool-card__icon">
                    {tool.icon}
                  </div>
                  <div className="tool-card__category">
                    <span className="category-badge">
                      {getCategoryIcon(tool.category)} {getCategoryLabel(tool.category)}
                    </span>
                  </div>
                </div>
                
                <div className="tool-card__content">
                  <h3 className="tool-card__title">{tool.name}</h3>
                  <p className="tool-card__description">{tool.description}</p>
                  
                  {tool.isAvailable && (
                    <div className="tool-card__usage">
                      <div className="usage__info">
                        <span className="usage__text">
                          {tool.usageCount} / {tool.maxUsage} lượt sử dụng
                        </span>
                        <span className="usage__percentage">
                          {Math.round(getUsagePercentage(tool.usageCount, tool.maxUsage))}%
                        </span>
                      </div>
                      <div className="usage__bar">
                        <div 
                          className="usage__bar-fill"
                          style={{ 
                            width: `${getUsagePercentage(tool.usageCount, tool.maxUsage)}%`,
                            backgroundColor: getUsageColor(getUsagePercentage(tool.usageCount, tool.maxUsage))
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="tool-card__footer">
                  {tool.isAvailable ? (
                    <button className="tool-card__action-btn">
                      🚀 Sử dụng ngay
                    </button>
                  ) : (
                    <div className="tool-card__unavailable">
                      <span className="unavailable__icon">🔒</span>
                      <span className="unavailable__text">Cần nâng cấp</span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Upgrade Banner */}
        <div className="ai-tools__upgrade-banner">
          <div className="upgrade-banner__content">
            <div className="upgrade-banner__icon">🚀</div>
            <div className="upgrade-banner__text">
              <h3>Mở khóa tất cả AI Tools</h3>
              <p>Nâng cấp lên gói Pro để sử dụng không giới hạn tất cả công cụ AI và tính năng nâng cao</p>
            </div>
            <button className="teacher-dashboard__btn teacher-dashboard__btn--primary">
              Nâng cấp ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITools;
