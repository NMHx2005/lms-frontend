import React, { useState, useEffect } from 'react';
import { clientCoursesService } from '../../../../services/client/courses.service';
import './CourseFilters.css';

export interface FilterState {
  search: string;
  domain: string;
  level: string;
  instructorId: string;
  priceRange: string;
  rating: string;
  duration: string;
  language: string;
  certificate: boolean | null;
  tags: string[];
  prerequisites: string[];
  benefits: string[];
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

interface FilterOptions {
  domains: string[];
  levels: string[];
  languages: string[];
  tags: string[];
  instructors: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
  }>;
}

interface CourseFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

const CourseFilters: React.FC<CourseFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  isLoading = false
}) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    domains: [],
    levels: [],
    languages: [],
    tags: [],
    instructors: []
  });
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      setIsLoadingOptions(true);
      const [filterData, popularTags] = await Promise.all([
        clientCoursesService.getFilterOptions(),
        clientCoursesService.getPopularTags(30)
      ]);

      setFilterOptions({
        domains: filterData.data.domains || [],
        levels: filterData.data.levels || [],
        languages: filterData.data.languages || [],
        tags: popularTags.data.map((tag: any) => tag.name) || [],
        instructors: filterData.data.instructors || []
      });
    } catch (error) {
      console.error('Error loading filter options:', error);
    } finally {
      setIsLoadingOptions(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleReset = () => {
    const resetFilters: FilterState = {
      search: '',
      domain: '',
      level: '',
      instructorId: '',
      priceRange: '',
      rating: '',
      duration: '',
      language: '',
      certificate: null,
      tags: [],
      prerequisites: [],
      benefits: [],
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };
    onFiltersChange(resetFilters);
  };

  const handleTagToggle = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    handleFilterChange('tags', newTags);
  };

  const handlePrerequisiteToggle = (prerequisite: string) => {
    const newPrerequisites = filters.prerequisites.includes(prerequisite)
      ? filters.prerequisites.filter(p => p !== prerequisite)
      : [...filters.prerequisites, prerequisite];
    handleFilterChange('prerequisites', newPrerequisites);
  };

  const handleBenefitToggle = (benefit: string) => {
    const newBenefits = filters.benefits.includes(benefit)
      ? filters.benefits.filter(b => b !== benefit)
      : [...filters.benefits, benefit];
    handleFilterChange('benefits', newBenefits);
  };

  return (
    <div className="course-filters">
      <div className="filters-header">
        <h3>Tìm kiếm khóa học</h3>
        <button
          type="button"
          className="toggle-advanced-btn"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          {showAdvanced ? 'Ẩn tìm kiếm nâng cao' : 'Hiện tìm kiếm nâng cao'}
        </button>
      </div>

      {/* Basic Search */}
      <div className="search-section">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="Tìm kiếm khóa học, giảng viên, tags..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="search-input"
          />
          <button
            type="button"
            onClick={onSearch}
            disabled={isLoading}
            className="search-btn"
          >
            {isLoading ? 'Đang tìm...' : 'Tìm kiếm'}
          </button>
        </div>
      </div>

      {/* Basic Filters */}
      <div className="basic-filters">
        <div className="filter-row">
          <div className="filter-group">
            <label>Lĩnh vực:</label>
            <select
              value={filters.domain}
              onChange={(e) => handleFilterChange('domain', e.target.value)}
            >
              <option value="">Tất cả lĩnh vực</option>
              {filterOptions.domains.map(domain => (
                <option key={domain} value={domain}>{domain}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Trình độ:</label>
            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
            >
              <option value="">Tất cả trình độ</option>
              {filterOptions.levels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Ngôn ngữ:</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange('language', e.target.value)}
            >
              <option value="">Tất cả ngôn ngữ</option>
              {filterOptions.languages.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Khoảng giá:</label>
            <select
              value={filters.priceRange}
              onChange={(e) => handleFilterChange('priceRange', e.target.value)}
            >
              <option value="">Tất cả mức giá</option>
              <option value="free">Miễn phí</option>
              <option value="0-100000">0 - 100,000 VNĐ</option>
              <option value="100000-500000">100,000 - 500,000 VNĐ</option>
              <option value="500000-1000000">500,000 - 1,000,000 VNĐ</option>
              <option value="1000000+">Trên 1,000,000 VNĐ</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Đánh giá:</label>
            <select
              value={filters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
            >
              <option value="">Tất cả đánh giá</option>
              <option value="4+">Từ 4 sao trở lên</option>
              <option value="4.5+">Từ 4.5 sao trở lên</option>
              <option value="5">5 sao</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Thời lượng:</label>
            <select
              value={filters.duration}
              onChange={(e) => handleFilterChange('duration', e.target.value)}
            >
              <option value="">Tất cả thời lượng</option>
              <option value="0-2">0 - 2 giờ</option>
              <option value="2-5">2 - 5 giờ</option>
              <option value="5-10">5 - 10 giờ</option>
              <option value="10+">Trên 10 giờ</option>
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Sắp xếp theo:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="createdAt">Ngày tạo</option>
              <option value="title">Tên khóa học</option>
              <option value="price">Giá</option>
              <option value="rating">Đánh giá</option>
              <option value="duration">Thời lượng</option>
              <option value="students">Số học viên</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Thứ tự:</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value as 'asc' | 'desc')}
            >
              <option value="desc">Giảm dần</option>
              <option value="asc">Tăng dần</option>
            </select>
          </div>

          <div className="filter-group">
            <label>
              <input
                type="checkbox"
                checked={filters.certificate === true}
                onChange={(e) => handleFilterChange('certificate', e.target.checked ? true : null)}
              />
              Có chứng chỉ
            </label>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="advanced-filters">
          <h4>Tags phổ biến</h4>
          <div className="tags-container">
            {filterOptions.tags.slice(0, 20).map(tag => (
              <button
                key={tag}
                type="button"
                className={`tag-btn ${filters.tags.includes(tag) ? 'active' : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <h4>Yêu cầu trước khi học</h4>
          <div className="tags-container">
            {filterOptions.tags.slice(20, 30).map(tag => (
              <button
                key={tag}
                type="button"
                className={`tag-btn ${filters.prerequisites.includes(tag) ? 'active' : ''}`}
                onClick={() => handlePrerequisiteToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>

          <h4>Lợi ích khóa học</h4>
          <div className="tags-container">
            {filterOptions.tags.slice(10, 20).map(tag => (
              <button
                key={tag}
                type="button"
                className={`tag-btn ${filters.benefits.includes(tag) ? 'active' : ''}`}
                onClick={() => handleBenefitToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="filter-actions">
        <button
          type="button"
          onClick={handleReset}
          className="reset-btn"
          disabled={isLoadingOptions}
        >
          Đặt lại
        </button>
        <button
          type="button"
          onClick={onSearch}
          className="apply-btn"
          disabled={isLoading || isLoadingOptions}
        >
          {isLoading ? 'Đang áp dụng...' : 'Áp dụng bộ lọc'}
        </button>
      </div>
    </div>
  );
};

export default CourseFilters;
