import { useState } from 'react';
import './CourseFilters.css';

interface CourseFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export interface FilterState {
  domain: string;
  level: string;
  search: string;
  sort: string;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState<FilterState>({
    domain: '',
    level: '',
    search: '',
    sort: 'newest'
  });

  const domains = [
    { value: '', label: 'Tất cả lĩnh vực' },
    { value: 'IT', label: 'Công nghệ thông tin' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Design', label: 'Thiết kế' },
    { value: 'Economics', label: 'Kinh tế' },
    { value: 'Education', label: 'Giáo dục' },
    { value: 'Healthcare', label: 'Y tế' }
  ];

  const levels = [
    { value: '', label: 'Tất cả cấp độ' },
    { value: 'beginner', label: 'Cơ bản' },
    { value: 'intermediate', label: 'Trung cấp' },
    { value: 'advanced', label: 'Nâng cao' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'oldest', label: 'Cũ nhất' },
    { value: 'price-low', label: 'Giá thấp đến cao' },
    { value: 'price-high', label: 'Giá cao đến thấp' },
    { value: 'rating', label: 'Đánh giá cao nhất' },
    { value: 'popular', label: 'Phổ biến nhất' }
  ];

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange(filters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      domain: '',
      level: '',
      search: '',
      sort: 'newest'
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  return (
    <section className="course-filters" aria-label="Course filters">
      <div className="course-filters__container">
        <form onSubmit={handleSearch} className="course-filters__form">
          {/* Search Bar */}
          <div className="course-filters__search">
            <div className="course-filters__search-box">
              <span className="course-filters__search-icon">
                <svg width="20" height="20" fill="none" stroke="#656D7A" strokeWidth="1.7" viewBox="0 0 20 20">
                  <circle cx="9" cy="9" r="7"/>
                  <path d="M15.5 15.5L13 13"/>
                </svg>
              </span>
              <input
                type="text"
                className="course-filters__search-input"
                placeholder="Tìm kiếm khóa học, nội dung..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
              <button type="submit" className="course-filters__search-btn">
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Filters Row */}
          <div className="course-filters__row">
            <div className="course-filters__group">
              <label htmlFor="domain" className="course-filters__label">Lĩnh vực</label>
              <select
                id="domain"
                className="course-filters__select"
                value={filters.domain}
                onChange={(e) => handleFilterChange('domain', e.target.value)}
              >
                {domains.map((domain) => (
                  <option key={domain.value} value={domain.value}>
                    {domain.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="course-filters__group">
              <label htmlFor="level" className="course-filters__label">Cấp độ</label>
              <select
                id="level"
                className="course-filters__select"
                value={filters.level}
                onChange={(e) => handleFilterChange('level', e.target.value)}
              >
                {levels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="course-filters__group">
              <label htmlFor="sort" className="course-filters__label">Sắp xếp</label>
              <select
                id="sort"
                className="course-filters__select"
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="course-filters__clear-btn"
              onClick={clearFilters}
            >
              Xóa bộ lọc
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CourseFilters;
