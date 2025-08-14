import './Pagination.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems = 0,
  itemsPerPage = 12
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="pagination">
      <div className="pagination__container">
        {/* Results Info */}
        <div className="pagination__info">
          <span className="pagination__results">
            Hiển thị {startItem}-{endItem} trong tổng số {totalItems} khóa học
          </span>
        </div>

        {/* Page Navigation */}
        <div className="pagination__navigation">
          {/* Previous Button */}
          <button
            className={`pagination__btn pagination__btn--prev ${currentPage === 1 ? 'pagination__btn--disabled' : ''}`}
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Trang trước"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
              <path d="M10 12l-4-4 4-4"/>
            </svg>
            Trước
          </button>

          {/* Page Numbers */}
          <div className="pagination__pages">
            {getPageNumbers().map((page, index) => (
              <button
                key={index}
                className={`pagination__page ${page === currentPage ? 'pagination__page--active' : ''} ${page === '...' ? 'pagination__page--ellipsis' : ''}`}
                onClick={() => typeof page === 'number' && handlePageChange(page)}
                disabled={page === '...'}
                aria-label={page === '...' ? undefined : `Trang ${page}`}
                aria-current={page === currentPage ? 'page' : undefined}
              >
                {page}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            className={`pagination__btn pagination__btn--next ${currentPage === totalPages ? 'pagination__btn--disabled' : ''}`}
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Trang tiếp"
          >
            Tiếp
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 16 16">
              <path d="M6 12l4-4-4-4"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
