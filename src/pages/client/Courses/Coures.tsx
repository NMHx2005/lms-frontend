import React, { useState, useEffect } from 'react';
import { clientCoursesService } from '../../../services/client/courses.service';
import CourseFilters, { FilterState } from '../../../components/Client/Courses/CourseFilters/CourseFilters';
import CourseGrid from '../../../components/Client/Courses/CourseGrid/CourseGrid';
import './Courses.css';
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCourses, setTotalCourses] = useState(0);
  const [filters, setFilters] = useState<FilterState>({
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
  });

  useEffect(() => {
    fetchCourses();
  }, [currentPage, filters]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters from filters
      const params: any = {
        page: currentPage,
        limit: 12
      };

      // Add search query
      if (filters.search) {
        params.q = filters.search;
      }

      // Add basic filters
      if (filters.domain) params.domain = filters.domain;
      if (filters.level) params.level = filters.level;
      if (filters.instructorId) params.instructorId = filters.instructorId;
      if (filters.language) params.language = filters.language;
      if (filters.certificate !== null) params.certificate = filters.certificate;

      // Add price range filter
      if (filters.priceRange) {
        params.priceRange = filters.priceRange;
      }

      // Add rating filter
      if (filters.rating) {
        params.rating = filters.rating;
      }

      // Add duration filter
      if (filters.duration) {
        params.duration = filters.duration;
      }

      // Add tags filters
      if (filters.tags.length > 0) {
        params.tags = filters.tags;
      }

      if (filters.prerequisites.length > 0) {
        params.prerequisites = filters.prerequisites;
      }

      if (filters.benefits.length > 0) {
        params.benefits = filters.benefits;
      }

      // Add sorting
      params.sortBy = filters.sortBy;
      params.sortOrder = filters.sortOrder;

      const response = await clientCoursesService.getCourses(params);

      if (response.success) {
        setCourses(response.data.courses);
        setTotalPages(response.data.totalPages);
        setTotalCourses(response.data.total);
      } else {
        setError('Không thể tải danh sách khóa học');
      }
    } catch (err: any) {
      console.error('Error fetching courses:', err);
      setError(err.message || 'Có lỗi xảy ra khi tải khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCourses();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
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
    setFilters(resetFilters);
    setCurrentPage(1);
  };

  const hasActiveFilters =
    filters.search ||
    filters.domain ||
    filters.level ||
    filters.instructorId ||
    filters.priceRange ||
    filters.rating ||
    filters.duration ||
    filters.language ||
    filters.certificate !== null ||
    filters.tags.length > 0 ||
    filters.prerequisites.length > 0 ||
    filters.benefits.length > 0 ||
    filters.sortBy !== 'createdAt' ||
    filters.sortOrder !== 'desc';

  return (
    <>
      <TopBar />
      <Header />
      <div className="courses-page">
        <div className="courses-container">
          {/* Header */}
          <div className="courses-header">
            <h1>Khám phá khóa học</h1>
            <p>Tìm kiếm và lọc khóa học phù hợp với nhu cầu của bạn</p>

            {hasActiveFilters && (
              <div className="active-filters-info">
                <span>Đang áp dụng {totalCourses} kết quả</span>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="clear-all-filters-btn"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>

          {/* Filters */}
          <CourseFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onSearch={handleSearch}
            isLoading={loading}
          />

          {/* Results */}
          <div className="courses-results">
            {loading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Đang tải khóa học...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
                <button onClick={fetchCourses} className="retry-btn">
                  Thử lại
                </button>
              </div>
            ) : courses.length === 0 ? (
              <div className="empty-state">
                <p>Không tìm thấy khóa học nào phù hợp với bộ lọc của bạn</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <h2>Kết quả tìm kiếm</h2>
                  <span className="results-count">
                    {totalCourses} khóa học
                  </span>
                </div>

                <CourseGrid courses={courses} />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="pagination-btn prev"
                    >
                      Trước
                    </button>

                    <div className="page-numbers">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page =>
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 2
                        )
                        .map((page, index, array) => (
                          <React.Fragment key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="page-ellipsis">...</span>
                            )}
                            <button
                              onClick={() => handlePageChange(page)}
                              className={`pagination-btn ${page === currentPage ? 'active' : ''}`}
                            >
                              {page}
                            </button>
                          </React.Fragment>
                        ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="pagination-btn next"
                    >
                      Sau
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Courses;