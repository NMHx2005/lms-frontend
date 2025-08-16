import React, { useState, useEffect } from 'react';
import './CategoryManagement.css';

interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  parentId?: string;
  parentName?: string;
  level: number;
  order: number;
  isActive: boolean;
  courseCount: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    level: 'all',
    status: 'all',
    parent: 'all'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'tree'>('list');

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockCategories: Category[] = [
        {
          _id: 'cat-1',
          name: 'Lập trình',
          slug: 'lap-trinh',
          description: 'Các khóa học về lập trình và phát triển phần mềm',
          level: 0,
          order: 1,
          isActive: true,
          courseCount: 45,
          seoTitle: 'Khóa học lập trình online - Học code từ cơ bản đến nâng cao',
          seoDescription: 'Học lập trình online với các khóa học chất lượng cao từ các chuyên gia hàng đầu',
          seoKeywords: ['lập trình', 'coding', 'programming', 'phát triển phần mềm'],
          imageUrl: '/images/categories/programming.jpg',
          createdAt: '2024-01-01',
          updatedAt: '2024-01-15'
        },
        {
          _id: 'cat-2',
          name: 'Frontend Development',
          slug: 'frontend-development',
          description: 'Phát triển giao diện người dùng với HTML, CSS, JavaScript',
          parentId: 'cat-1',
          parentName: 'Lập trình',
          level: 1,
          order: 1,
          isActive: true,
          courseCount: 18,
          seoTitle: 'Khóa học Frontend Development - HTML, CSS, JavaScript',
          seoDescription: 'Học phát triển giao diện web với các công nghệ frontend hiện đại',
          seoKeywords: ['frontend', 'html', 'css', 'javascript', 'web development'],
          imageUrl: '/images/categories/frontend.jpg',
          createdAt: '2024-01-02',
          updatedAt: '2024-01-16'
        },
        {
          _id: 'cat-3',
          name: 'Backend Development',
          slug: 'backend-development',
          description: 'Phát triển phía máy chủ với Node.js, Python, Java',
          parentId: 'cat-1',
          parentName: 'Lập trình',
          level: 1,
          order: 2,
          isActive: true,
          courseCount: 22,
          seoTitle: 'Khóa học Backend Development - Node.js, Python, Java',
          seoDescription: 'Học phát triển backend và API với các ngôn ngữ lập trình phổ biến',
          seoKeywords: ['backend', 'nodejs', 'python', 'java', 'api development'],
          imageUrl: '/images/categories/backend.jpg',
          createdAt: '2024-01-03',
          updatedAt: '2024-01-17'
        },
        {
          _id: 'cat-4',
          name: 'React',
          slug: 'react',
          description: 'Thư viện JavaScript cho xây dựng giao diện người dùng',
          parentId: 'cat-2',
          parentName: 'Frontend Development',
          level: 2,
          order: 1,
          isActive: true,
          courseCount: 12,
          seoTitle: 'Khóa học React - Xây dựng ứng dụng web hiện đại',
          seoDescription: 'Học React từ cơ bản đến nâng cao, xây dựng SPA chuyên nghiệp',
          seoKeywords: ['react', 'javascript', 'frontend', 'spa', 'web app'],
          imageUrl: '/images/categories/react.jpg',
          createdAt: '2024-01-04',
          updatedAt: '2024-01-18'
        },
        {
          _id: 'cat-5',
          name: 'Thiết kế',
          slug: 'thiet-ke',
          description: 'Các khóa học về thiết kế đồ họa và UI/UX',
          level: 0,
          order: 2,
          isActive: true,
          courseCount: 28,
          seoTitle: 'Khóa học thiết kế đồ họa và UI/UX chuyên nghiệp',
          seoDescription: 'Học thiết kế đồ họa, UI/UX với các công cụ hiện đại',
          seoKeywords: ['thiết kế', 'design', 'ui/ux', 'đồ họa', 'photoshop'],
          imageUrl: '/images/categories/design.jpg',
          createdAt: '2024-01-05',
          updatedAt: '2024-01-19'
        },
        {
          _id: 'cat-6',
          name: 'Marketing',
          slug: 'marketing',
          description: 'Các khóa học về marketing số và quảng cáo',
          level: 0,
          order: 3,
          isActive: false,
          courseCount: 15,
          seoTitle: 'Khóa học Marketing số - Chiến lược quảng cáo hiệu quả',
          seoDescription: 'Học marketing số và các chiến lược quảng cáo online',
          seoKeywords: ['marketing', 'digital marketing', 'quảng cáo', 'seo'],
          imageUrl: '/images/categories/marketing.jpg',
          createdAt: '2024-01-06',
          updatedAt: '2024-01-20'
        }
      ];

      setCategories(mockCategories);
      setFilteredCategories(mockCategories);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = categories;

    if (filters.search) {
      filtered = filtered.filter(cat =>
        cat.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        cat.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.level !== 'all') {
      filtered = filtered.filter(cat => cat.level === parseInt(filters.level));
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(cat => 
        filters.status === 'active' ? cat.isActive : !cat.isActive
      );
    }

    if (filters.parent !== 'all') {
      if (filters.parent === 'root') {
        filtered = filtered.filter(cat => !cat.parentId);
      } else if (filters.parent === 'child') {
        filtered = filtered.filter(cat => cat.parentId);
      }
    }

    setFilteredCategories(filtered);
  }, [filters, categories]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleCreateCategory = () => {
    setShowCreateModal(true);
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    setShowEditModal(category._id);
  };

  const handleDeleteCategory = (categoryId: string) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      setCategories(categories.filter(cat => cat._id !== categoryId));
    }
  };

  const handleToggleStatus = (categoryId: string) => {
    setCategories(categories.map(cat =>
      cat._id === categoryId ? { ...cat, isActive: !cat.isActive } : cat
    ));
  };

  const getLevelIndent = (level: number) => {
    return level * 20;
  };

  const getLevelIcon = (level: number) => {
    switch (level) {
      case 0: return '📁';
      case 1: return '📂';
      case 2: return '📄';
      default: return '📄';
    }
  };

  const renderCategoryTree = (parentId?: string, level = 0) => {
    const children = filteredCategories.filter(cat => cat.parentId === parentId);
    
    return children.map(category => (
      <div key={category._id} className="category-tree-item">
        <div 
          className="category-tree-row"
          style={{ paddingLeft: `${getLevelIndent(level)}px` }}
        >
          <span className="category-tree-icon">{getLevelIcon(level)}</span>
          <span className="category-tree-name">{category.name}</span>
          <span className="category-tree-count">({category.courseCount} khóa học)</span>
          <div className="category-tree-actions">
            <button
              className="category-tree-edit-btn"
              onClick={() => handleEditCategory(category)}
            >
              Sửa
            </button>
            <button
              className="category-tree-delete-btn"
              onClick={() => handleDeleteCategory(category._id)}
            >
              Xóa
            </button>
          </div>
        </div>
        {renderCategoryTree(category._id, level + 1)}
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="category-management">
        <div className="category-management__loading">
          <div className="loading-spinner"></div>
          <p>Đang tải quản lý danh mục...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="category-management">
      <div className="category-management__header">
        <div className="category-management__title">
          <h1>🏷️ Quản lý danh mục</h1>
          <p>Quản lý danh mục khóa học, SEO optimization và category hierarchy</p>
        </div>
        <button className="category-management__create-btn" onClick={handleCreateCategory}>
          + Tạo danh mục mới
        </button>
      </div>

      <div className="category-management__stats">
        <div className="category-stat">
          <span className="category-stat__value">{categories.length}</span>
          <span className="category-stat__label">Tổng danh mục</span>
        </div>
        <div className="category-stat">
          <span className="category-stat__value">
            {categories.filter(cat => cat.isActive).length}
          </span>
          <span className="category-stat__label">Đang hoạt động</span>
        </div>
        <div className="category-stat">
          <span className="category-stat__value">
            {categories.filter(cat => !cat.parentId).length}
          </span>
          <span className="category-stat__label">Danh mục gốc</span>
        </div>
        <div className="category-stat">
          <span className="category-stat__value">
            {categories.reduce((sum, cat) => sum + cat.courseCount, 0)}
          </span>
          <span className="category-stat__label">Tổng khóa học</span>
        </div>
      </div>

      <div className="category-management__controls">
        <div className="category-management__filters">
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="category-management__search"
          />
          <select
            value={filters.level}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="category-management__filter"
          >
            <option value="all">Tất cả cấp độ</option>
            <option value="0">Cấp 0 (Gốc)</option>
            <option value="1">Cấp 1</option>
            <option value="2">Cấp 2</option>
          </select>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="category-management__filter"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
          <select
            value={filters.parent}
            onChange={(e) => handleFilterChange('parent', e.target.value)}
            className="category-management__filter"
          >
            <option value="all">Tất cả</option>
            <option value="root">Chỉ danh mục gốc</option>
            <option value="child">Chỉ danh mục con</option>
          </select>
        </div>
        <div className="category-management__view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
            onClick={() => setViewMode('list')}
          >
            📋 Danh sách
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'tree' ? 'active' : ''}`}
            onClick={() => setViewMode('tree')}
          >
            🌳 Cây danh mục
          </button>
        </div>
      </div>

      <div className="category-management__content">
        {viewMode === 'list' ? (
          <div className="category-management__list">
            <div className="category-table">
              <table>
                <thead>
                  <tr>
                    <th>Danh mục</th>
                    <th>Mô tả</th>
                    <th>Cấp độ</th>
                    <th>Khóa học</th>
                    <th>SEO</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category) => (
                    <tr key={category._id} className="category-row">
                      <td>
                        <div className="category-info">
                          <span className="category-icon">{getLevelIcon(category.level)}</span>
                          <div className="category-details">
                            <span className="category-name">{category.name}</span>
                            <span className="category-slug">/{category.slug}</span>
                            {category.parentName && (
                              <span className="category-parent">← {category.parentName}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <p className="category-description">{category.description}</p>
                      </td>
                      <td>
                        <span className="category-level">Cấp {category.level}</span>
                      </td>
                      <td>
                        <span className="category-course-count">{category.courseCount}</span>
                      </td>
                      <td>
                        <div className="category-seo">
                          {category.seoTitle && (
                            <span className="seo-indicator seo-title">✓ Title</span>
                          )}
                          {category.seoDescription && (
                            <span className="seo-indicator seo-desc">✓ Desc</span>
                          )}
                          {category.seoKeywords && category.seoKeywords.length > 0 && (
                            <span className="seo-indicator seo-keywords">✓ Keywords</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <button
                          className={`status-toggle ${category.isActive ? 'active' : 'inactive'}`}
                          onClick={() => handleToggleStatus(category._id)}
                        >
                          {category.isActive ? 'Hoạt động' : 'Không hoạt động'}
                        </button>
                      </td>
                      <td>
                        <div className="category-actions">
                          <button
                            className="category-edit-btn"
                            onClick={() => handleEditCategory(category)}
                          >
                            Sửa
                          </button>
                          <button
                            className="category-delete-btn"
                            onClick={() => handleDeleteCategory(category._id)}
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="category-management__tree">
            <div className="category-tree">
              {renderCategoryTree()}
            </div>
          </div>
        )}
      </div>

      {/* Create/Edit Category Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Tạo danh mục mới</h3>
            <p>Modal tạo danh mục sẽ được implement ở đây...</p>
            <button onClick={() => setShowCreateModal(false)}>Đóng</button>
          </div>
        </div>
      )}

      {showEditModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowEditModal(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Sửa danh mục: {selectedCategory.name}</h3>
            <p>Modal sửa danh mục sẽ được implement ở đây...</p>
            <button onClick={() => setShowEditModal(null)}>Đóng</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagement;
