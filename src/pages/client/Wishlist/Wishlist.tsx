import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WishlistItem } from '../../../types/index';
import './Wishlist.css';

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<'addedAt' | 'price' | 'rating' | 'title'>('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockWishlist: WishlistItem[] = [
        {
          _id: '1',
          courseId: 'course1',
          title: 'React Advanced Patterns & Best Practices',
          thumbnail: '/images/course1.jpg',
          instructor: 'Hieu Doan',
          price: 29.99,
          originalPrice: 49.99,
          rating: 4.8,
          totalStudents: 1247,
          duration: 12.5,
          level: 'advanced',
          category: 'Web Development',
          addedAt: '2024-01-15T10:30:00Z',
          isOnSale: true,
          discountPercentage: 40
        },
        {
          _id: '2',
          courseId: 'course2',
          title: 'Node.js Backend Development Masterclass',
          thumbnail: '/images/course2.jpg',
          instructor: 'Minh Nguyen',
          price: 39.99,
          rating: 4.6,
          totalStudents: 892,
          duration: 18.0,
          level: 'intermediate',
          category: 'Backend Development',
          addedAt: '2024-01-12T14:20:00Z',
          isOnSale: false
        },
        {
          _id: '3',
          courseId: 'course3',
          title: 'UI/UX Design Fundamentals & Prototyping',
          thumbnail: '/images/course3.jpg',
          instructor: 'Lan Tran',
          price: 24.99,
          originalPrice: 34.99,
          rating: 4.7,
          totalStudents: 1567,
          duration: 8.5,
          level: 'beginner',
          category: 'Design',
          addedAt: '2024-01-10T09:15:00Z',
          isOnSale: true,
          discountPercentage: 29
        },
        {
          _id: '4',
          courseId: 'course4',
          title: 'Machine Learning with Python: From Basics to Advanced',
          thumbnail: '/images/course4.jpg',
          instructor: 'David Chen',
          price: 59.99,
          rating: 4.9,
          totalStudents: 2341,
          duration: 25.0,
          level: 'advanced',
          category: 'Data Science',
          addedAt: '2024-01-08T16:45:00Z',
          isOnSale: false
        },
        {
          _id: '5',
          courseId: 'course5',
          title: 'Mobile App Development with React Native',
          thumbnail: '/images/course5.jpg',
          instructor: 'Sarah Johnson',
          price: 34.99,
          originalPrice: 44.99,
          rating: 4.5,
          totalStudents: 987,
          duration: 15.5,
          level: 'intermediate',
          category: 'Mobile Development',
          addedAt: '2024-01-05T11:30:00Z',
          isOnSale: true,
          discountPercentage: 23
        }
      ];
      
      setWishlistItems(mockWishlist);
      setLoading(false);
    }, 1000);
  }, []);

  const removeFromWishlist = (itemId: string) => {
    setWishlistItems(prev => prev.filter(item => item._id !== itemId));
    // Here you would also call API to remove from wishlist
  };

  const moveToCart = (itemId: string) => {
    // Here you would call API to move item to cart
    console.log('Moving to cart:', itemId);
  };

  const getSortedItems = () => {
    const sorted = [...wishlistItems].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'addedAt':
          comparison = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime();
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    if (filterCategory) {
      return sorted.filter(item => item.category === filterCategory);
    }
    
    return sorted;
  };

  const getCategories = () => {
    const categories = [...new Set(wishlistItems.map(item => item.category))];
    return categories;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatDuration = (hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải danh sách yêu thích...</p>
        </div>
      </div>
    );
  }

  const sortedItems = getSortedItems();
  const categories = getCategories();

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>Danh sách yêu thích ❤️</h1>
        <p>Quản lý các khóa học bạn quan tâm</p>
      </div>

      {/* Stats */}
      <div className="wishlist-stats">
        <div className="stat-item">
          <span className="stat-number">{wishlistItems.length}</span>
          <span className="stat-label">Khóa học yêu thích</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            ${wishlistItems.reduce((total, item) => total + item.price, 0).toFixed(2)}
          </span>
          <span className="stat-label">Tổng giá trị</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {wishlistItems.filter(item => item.isOnSale).length}
          </span>
          <span className="stat-label">Đang giảm giá</span>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="wishlist-controls">
        <div className="filters">
          <select 
            value={filterCategory} 
            onChange={(e) => setFilterCategory(e.target.value)}
            className="category-filter"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div className="sorting">
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as any)}
            className="sort-select"
          >
            <option value="addedAt">Ngày thêm</option>
            <option value="price">Giá</option>
            <option value="rating">Đánh giá</option>
            <option value="title">Tên khóa học</option>
          </select>
          
          <button 
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="sort-order-btn"
          >
            {sortOrder === 'asc' ? '↑' : '↓'}
          </button>
        </div>

        <div className="actions">
          <button 
            onClick={() => {
              // Clear all wishlist items
              setWishlistItems([]);
            }}
            className="clear-all-btn"
            disabled={wishlistItems.length === 0}
          >
            🗑️ Xóa tất cả
          </button>
        </div>
      </div>

      {/* Wishlist Items */}
      {sortedItems.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-icon">❤️</div>
          <h3>Danh sách yêu thích trống</h3>
          <p>Bạn chưa có khóa học nào trong danh sách yêu thích</p>
          <Link to="/courses" className="browse-courses-btn">
            🔍 Khám phá khóa học
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {sortedItems.map((item) => (
            <div key={item._id} className="wishlist-item">
              <div className="item-thumbnail">
                <img src={item.thumbnail} alt={item.title} />
                {item.isOnSale && (
                  <div className="sale-badge">
                    -{item.discountPercentage}%
                  </div>
                )}
                <div className="item-actions">
                  <button 
                    onClick={() => removeFromWishlist(item._id)}
                    className="remove-btn"
                    title="Xóa khỏi danh sách yêu thích"
                  >
                    ❌
                  </button>
                </div>
              </div>

              <div className="item-content">
                <div className="item-header">
                  <h3 className="item-title">
                    <Link to={`/courses/${item.courseId}`}>
                      {item.title}
                    </Link>
                  </h3>
                  <div className="item-meta">
                    <span className="instructor">👤 {item.instructor}</span>
                    <span className="level">📊 {item.level}</span>
                    <span className="duration">⏱️ {formatDuration(item.duration)}</span>
                  </div>
                </div>

                <div className="item-stats">
                  <div className="rating">
                    <span className="stars">
                      {'⭐'.repeat(Math.floor(item.rating))}
                      {item.rating % 1 !== 0 && '⭐'}
                    </span>
                    <span className="rating-text">{item.rating}</span>
                    <span className="total-students">({item.totalStudents} học viên)</span>
                  </div>
                  <span className="category">{item.category}</span>
                </div>

                <div className="item-price">
                  {item.isOnSale ? (
                    <div className="price-info">
                      <span className="current-price">${item.price}</span>
                      <span className="original-price">${item.originalPrice}</span>
                    </div>
                  ) : (
                    <span className="current-price">${item.price}</span>
                  )}
                </div>

                <div className="item-footer">
                  <span className="added-date">
                    Thêm vào: {formatDate(item.addedAt)}
                  </span>
                  <div className="item-buttons">
                    <button 
                      onClick={() => moveToCart(item._id)}
                      className="add-to-cart-btn"
                    >
                      🛒 Thêm vào giỏ
                    </button>
                    <Link 
                      to={`/checkout/${item.courseId}`}
                      className="buy-now-btn"
                    >
                      💳 Mua ngay
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/courses" className="browse-more-btn">
          🔍 Khám phá thêm khóa học
        </Link>
        <Link to="/dashboard/courses" className="my-courses-btn">
          📚 Khóa học của tôi
        </Link>
        <Link to="/dashboard" className="back-dashboard-btn">
          🏠 Về Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Wishlist;
