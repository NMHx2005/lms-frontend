import { useState, useEffect } from 'react';
import Header from "@/components/Layout/client/Header";
import Footer from "@/components/Layout/client/Footer";
import CourseHeader from "@/components/Client/Courses/CourseHeader/CourseHeader";
import CourseFilters, { FilterState } from "@/components/Client/Courses/CourseFilters/CourseFilters";
import CourseGrid, { Course } from "@/components/Client/Courses/CourseGrid/CourseGrid";
import Pagination from "@/components/Client/Courses/Pagination/Pagination";
import "./Courses.css";
import TopBar from '@/components/Client/Home/TopBar/TopBar';

const Courses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    domain: '',
    level: '',
    search: '',
    sort: 'newest'
  });

  const itemsPerPage = 12;

  // Mock data - trong thực tế sẽ lấy từ API
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        id: '1',
        category: 'Khoa học máy tính',
        title: 'Đào tạo lập trình viên quốc tế',
        desc: 'Học để trở thành chuyên gia công nghệ với các khóa học quốc tế chuẩn quốc tế.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/2acdcf6b-7987-4e03-25b9-3a37878e436d.jpg',
        imgAlt: 'Person working on laptop in office',
        btnText: 'Offline',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 5000000,
        rating: 4.8,
        instructor: 'Nguyễn Văn A',
        duration: '6 tháng',
        level: 'beginner'
      },
      {
        id: '2',
        category: 'Data Science',
        title: 'Những kiến thức cơ bản để hiểu về AI',
        desc: 'Làm thế nào để hiểu và áp dụng AI trong các ngành nghề khác nhau.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/9bfd7db9-44e6-4720-9a72-3bf6d26f126d.jpg',
        imgAlt: 'Man working with data on computer',
        btnText: 'Xem thử',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 3000000,
        rating: 4.9,
        instructor: 'Trần Thị B',
        duration: '4 tháng',
        level: 'intermediate'
      },
      {
        id: '3',
        category: 'Business & Accounting',
        title: 'Đào tạo kỹ sư IT làm kế toán doanh nghiệp',
        desc: 'Lập kế hoạch, quản lý và vận hành hệ thống kế toán doanh nghiệp.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/0820ec3b-33e6-468b-cc54-d7317c4a00fd.jpg',
        imgAlt: 'People in meeting room discussing',
        btnText: 'Offline',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 4500000,
        rating: 4.7,
        instructor: 'Lê Văn C',
        duration: '5 tháng',
        level: 'advanced'
      },
      {
        id: '4',
        category: 'Thiết kế & Sáng tạo',
        title: 'UI/UX Design từ cơ bản đến nâng cao',
        desc: 'Học thiết kế giao diện người dùng và trải nghiệm người dùng chuyên nghiệp.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/511cdf80-9e0b-4b53-1a80-941d6c952f79.jpg',
        imgAlt: 'Design work on computer',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 3500000,
        rating: 4.6,
        instructor: 'Phạm Thị D',
        duration: '3 tháng',
        level: 'beginner'
      },
      {
        id: '5',
        category: 'Marketing & Truyền thông',
        title: 'Digital Marketing toàn diện',
        desc: 'Chiến lược marketing số hiệu quả cho doanh nghiệp trong thời đại công nghệ.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/290a80f1-a263-4cd3-dcf8-e6ec6b6b50c9.jpg',
        imgAlt: 'Marketing strategy meeting',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 4000000,
        rating: 4.5,
        instructor: 'Hoàng Văn E',
        duration: '4 tháng',
        level: 'intermediate'
      },
      {
        id: '6',
        category: 'Ngoại ngữ',
        title: 'Tiếng Anh giao tiếp cho người đi làm',
        desc: 'Nâng cao kỹ năng tiếng Anh để phát triển sự nghiệp trong môi trường quốc tế.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/f9dbcea8-f19d-4f64-2eac-72bed0506370.jpg',
        imgAlt: 'English conversation class',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 2500000,
        rating: 4.8,
        instructor: 'Sarah Johnson',
        duration: '6 tháng',
        level: 'beginner'
      },
      {
        id: '7',
        category: 'Khoa học máy tính',
        title: 'Lập trình Web Full-stack với React & Node.js',
        desc: 'Xây dựng ứng dụng web hoàn chỉnh từ frontend đến backend.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/2acdcf6b-7987-4e03-25b9-3a37878e436d.jpg',
        imgAlt: 'Web development',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 6000000,
        rating: 4.9,
        instructor: 'Vũ Hoàng F',
        duration: '8 tháng',
        level: 'intermediate'
      },
      {
        id: '8',
        category: 'Data Science',
        title: 'Machine Learning cơ bản',
        desc: 'Học các thuật toán machine learning và ứng dụng thực tế.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/9bfd7db9-44e6-4720-9a72-3bf6d26f126d.jpg',
        imgAlt: 'Machine learning algorithms',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 5500000,
        rating: 4.7,
        instructor: 'Lý Thị G',
        duration: '7 tháng',
        level: 'advanced'
      },
      {
        id: '9',
        category: 'Business & Accounting',
        title: 'Quản lý dự án Agile',
        desc: 'Phương pháp quản lý dự án hiện đại và hiệu quả.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/0820ec3b-33e6-468b-cc54-d7317c4a00fd.jpg',
        imgAlt: 'Agile project management',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 3800000,
        rating: 4.6,
        instructor: 'Đỗ Văn H',
        duration: '4 tháng',
        level: 'intermediate'
      },
      {
        id: '10',
        category: 'Thiết kế & Sáng tạo',
        title: 'Thiết kế đồ họa chuyên nghiệp',
        desc: 'Sử dụng các công cụ thiết kế để tạo ra sản phẩm sáng tạo.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/511cdf80-9e0b-4b53-1a80-941d6c952f79.jpg',
        imgAlt: 'Graphic design work',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 3200000,
        rating: 4.5,
        instructor: 'Bùi Thị I',
        duration: '5 tháng',
        level: 'beginner'
      },
      {
        id: '11',
        category: 'Marketing & Truyền thông',
        title: 'Content Marketing & SEO',
        desc: 'Tạo nội dung hấp dẫn và tối ưu hóa cho công cụ tìm kiếm.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/290a80f1-a263-4cd3-dcf8-e6ec6b6b50c9.jpg',
        imgAlt: 'Content marketing strategy',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 3500000,
        rating: 4.4,
        instructor: 'Ngô Văn K',
        duration: '3 tháng',
        level: 'intermediate'
      },
      {
        id: '12',
        category: 'Ngoại ngữ',
        title: 'Tiếng Nhật cơ bản cho người mới bắt đầu',
        desc: 'Học tiếng Nhật từ bảng chữ cái đến giao tiếp cơ bản.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/f9dbcea8-f19d-4f64-2eac-72bed0506370.jpg',
        imgAlt: 'Japanese language learning',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 2800000,
        rating: 4.6,
        instructor: 'Tanaka Yuki',
        duration: '6 tháng',
        level: 'beginner'
      },
      {
        id: '13',
        category: 'Khoa học máy tính',
        title: 'Lập trình di động với Flutter',
        desc: 'Phát triển ứng dụng di động đa nền tảng với Flutter.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/2acdcf6b-7987-4e03-25b9-3a37878e436d.jpg',
        imgAlt: 'Mobile app development',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 6500000,
        rating: 4.8,
        instructor: 'Trần Minh L',
        duration: '9 tháng',
        level: 'advanced'
      },
      {
        id: '14',
        category: 'Data Science',
        title: 'Phân tích dữ liệu với Python',
        desc: 'Sử dụng Python để phân tích và trực quan hóa dữ liệu.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/9bfd7db9-44e6-4720-9a72-3bf6d26f126d.jpg',
        imgAlt: 'Data analysis with Python',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 4200000,
        rating: 4.6,
        instructor: 'Phạm Văn M',
        duration: '5 tháng',
        level: 'intermediate'
      },
      {
        id: '15',
        category: 'Business & Accounting',
        title: 'Kế toán doanh nghiệp vừa và nhỏ',
        desc: 'Học kế toán cơ bản và ứng dụng vào thực tế doanh nghiệp.',
        imgSrc: 'https://storage.googleapis.com/a1aa/image/0820ec3b-33e6-468b-cc54-d7317c4a00fd.jpg',
        imgAlt: 'Small business accounting',
        btnText: 'Đăng ký',
        linkText: 'Chi tiết →',
        linkHref: '#',
        price: 3000000,
        rating: 4.5,
        instructor: 'Lê Thị N',
        duration: '4 tháng',
        level: 'beginner'
      }
    ];

    // Simulate API call delay
    setTimeout(() => {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort courses
  useEffect(() => {
    let result = [...courses];

    // Apply domain filter
    if (filters.domain) {
      result = result.filter(course => 
        course.category.toLowerCase().includes(filters.domain.toLowerCase())
      );
    }

    // Apply level filter
    if (filters.level) {
      result = result.filter(course => course.level === filters.level);
    }

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      result = result.filter(course =>
        course.title.toLowerCase().includes(searchLower) ||
        course.desc.toLowerCase().includes(searchLower) ||
        course.category.toLowerCase().includes(searchLower) ||
        course.instructor?.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'oldest':
        result.sort((a, b) => parseInt(a.id) - parseInt(b.id));
        break;
      case 'price-low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'popular':
        // Mock popularity based on rating and price
        result.sort((a, b) => {
          const scoreA = (a.rating || 0) * 10 - (a.price || 0) / 100000;
          const scoreB = (b.rating || 0) * 10 - (b.price || 0) / 100000;
          return scoreB - scoreA;
        });
        break;
    }

    setFilteredCourses(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [filters, courses]);

  // Get current page courses
  const indexOfLastCourse = currentPage * itemsPerPage;
  const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <TopBar />
      <Header />
      
      <main>
        <CourseHeader />
        <CourseFilters onFiltersChange={handleFiltersChange} />
        <CourseGrid 
          courses={currentCourses} 
          loading={loading} 
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          totalItems={filteredCourses.length}
          itemsPerPage={itemsPerPage}
        />
      </main>
      
      <Footer />
    </>
  );
};

export default Courses;