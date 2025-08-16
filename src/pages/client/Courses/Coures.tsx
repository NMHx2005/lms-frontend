import { useState, useEffect } from 'react';
import { Course } from '@/components/Client/Dashboard/types';
import Header from "@/components/Layout/client/Header";
import Footer from "@/components/Layout/client/Footer";
import CourseHeader from "@/components/Client/Courses/CourseHeader/CourseHeader";
import CourseFilters, { FilterState } from "@/components/Client/Courses/CourseFilters/CourseFilters";
import CourseGrid from "@/components/Client/Courses/CourseGrid/CourseGrid";
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

  // Mock data theo cấu trúc MongoDB chuẩn
  useEffect(() => {
    const mockCourses: Course[] = [
      {
        "_id": "64f0d1234567890abcdef123",
        "title": "Đào tạo lập trình viên quốc tế",
        "description": "Học để trở thành chuyên gia công nghệ với các khóa học quốc tế chuẩn quốc tế. Khóa học bao gồm 24 bài học thực hành và 3 dự án thực tế.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/2acdcf6b-7987-4e03-25b9-3a37878e436d.jpg",
        "domain": "IT",
        "level": "beginner",
        "prerequisites": ["HTML cơ bản", "CSS cơ bản", "JavaScript cơ bản"],
        "benefits": ["Trở thành Full Stack Developer", "Làm việc với các công nghệ hiện đại", "Có thể apply vào dự án thực tế"],
        "relatedLinks": ["https://github.com", "https://stackoverflow.com"],
        "instructorId": "64f0c1234567890abcdef123",
        "price": 5000000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 45,
        "reports": 0,
        "createdAt": "2025-08-02T03:00:00.000Z",
        "updatedAt": "2025-08-02T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef123"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef124",
        "title": "Những kiến thức cơ bản để hiểu về AI",
        "description": "Làm thế nào để hiểu và áp dụng AI trong các ngành nghề khác nhau. Khóa học cung cấp kiến thức nền tảng về Machine Learning và Deep Learning.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/9bfd7db9-44e6-4720-9a72-3bf6d26f126d.jpg",
        "domain": "IT",
        "level": "intermediate",
        "prerequisites": ["Python cơ bản", "Toán học cơ bản", "Thống kê cơ bản"],
        "benefits": ["Hiểu về AI và Machine Learning", "Áp dụng AI vào dự án thực tế", "Nắm vững các thuật toán cơ bản"],
        "relatedLinks": ["https://python.org", "https://tensorflow.org"],
        "instructorId": "64f0c1234567890abcdef124",
        "price": 3000000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 32,
        "reports": 0,
        "createdAt": "2025-08-01T03:00:00.000Z",
        "updatedAt": "2025-08-01T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef124"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef125",
        "title": "Digital Marketing Strategy",
        "description": "Chiến lược marketing số toàn diện cho doanh nghiệp, bao gồm SEO, social media, content marketing và analytics.",
        "thumbnail": "/images/course-3.jpg",
        "domain": "Marketing",
        "level": "intermediate",
        "prerequisites": ["Marketing cơ bản", "Hiểu về digital landscape"],
        "benefits": ["Xây dựng chiến lược marketing số", "Tối ưu hóa ROI", "Phân tích dữ liệu marketing"],
        "relatedLinks": ["https://google.com/analytics", "https://ads.google.com"],
        "instructorId": "64f0c1234567890abcdef125",
        "price": 2500000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 28,
        "reports": 0,
        "createdAt": "2025-07-30T03:00:00.000Z",
        "updatedAt": "2025-07-30T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef125"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef126",
        "title": "Lập trình ReactJS từ cơ bản đến nâng cao",
        "description": "Khóa học toàn diện về ReactJS, từ các khái niệm cơ bản đến xây dựng ứng dụng web phức tạp với React Hooks và Redux.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/reactjs-course.jpg",
        "domain": "IT",
        "level": "intermediate",
        "prerequisites": ["JavaScript nâng cao", "HTML/CSS", "Kiến thức cơ bản về API"],
        "benefits": ["Xây dựng ứng dụng web hiện đại", "Làm việc với React Hooks và Redux", "Tối ưu hóa hiệu suất ứng dụng"],
        "relatedLinks": ["https://reactjs.org", "https://redux.js.org"],
        "instructorId": "64f0c1234567890abcdef126",
        "price": 4500000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 50,
        "reports": 0,
        "createdAt": "2025-08-05T03:00:00.000Z",
        "updatedAt": "2025-08-05T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef126"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef127",
        "title": "Phân tích dữ liệu với Python",
        "description": "Khóa học cung cấp kiến thức về phân tích dữ liệu với Python, sử dụng các thư viện như Pandas, NumPy và Matplotlib.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/python-data-analysis.jpg",
        "domain": "IT",
        "level": "intermediate",
        "prerequisites": ["Python cơ bản", "Thống kê cơ bản"],
        "benefits": ["Phân tích dữ liệu hiệu quả", "Trực quan hóa dữ liệu", "Áp dụng vào các dự án thực tế"],
        "relatedLinks": ["https://pandas.pydata.org", "https://matplotlib.org"],
        "instructorId": "64f0c1234567890abcdef127",
        "price": 3500000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 40,
        "reports": 0,
        "createdAt": "2025-08-04T03:00:00.000Z",
        "updatedAt": "2025-08-04T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef127"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef128",
        "title": "Thiết kế UI/UX cho ứng dụng di động",
        "description": "Học cách thiết kế giao diện người dùng (UI) và trải nghiệm người dùng (UX) cho ứng dụng di động với Figma và các công cụ hiện đại.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/ui-ux-course.jpg",
        "domain": "IT",
        "level": "beginner",
        "prerequisites": ["Không yêu cầu kinh nghiệm trước"],
        "benefits": ["Thiết kế giao diện đẹp và thân thiện", "Hiểu về quy trình UX", "Tạo prototype với Figma"],
        "relatedLinks": ["https://figma.com", "https://uxdesign.cc"],
        "instructorId": "64f0c1234567890abcdef128",
        "price": 2800000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 35,
        "reports": 0,
        "createdAt": "2025-08-03T03:00:00.000Z",
        "updatedAt": "2025-08-03T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef128"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef129",
        "title": "SEO nâng cao cho doanh nghiệp",
        "description": "Khóa học chuyên sâu về tối ưu hóa công cụ tìm kiếm (SEO) để tăng thứ hạng website và thu hút khách hàng.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/seo-course.jpg",
        "domain": "Marketing",
        "level": "advanced",
        "prerequisites": ["SEO cơ bản", "Hiểu về Google Analytics"],
        "benefits": ["Tăng thứ hạng trên Google", "Tối ưu hóa nội dung", "Phân tích hiệu quả chiến dịch"],
        "relatedLinks": ["https://moz.com", "https://search.google.com/search-console"],
        "instructorId": "64f0c1234567890abcdef129",
        "price": 3200000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 30,
        "reports": 0,
        "createdAt": "2025-08-02T03:00:00.000Z",
        "updatedAt": "2025-08-02T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef129"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef130",
        "title": "Lập trình Android với Kotlin",
        "description": "Khóa học lập trình ứng dụng Android với ngôn ngữ Kotlin, từ cơ bản đến xây dựng ứng dụng thực tế.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/android-kotlin.jpg",
        "domain": "IT",
        "level": "intermediate",
        "prerequisites": ["Java cơ bản", "Kiến thức về lập trình hướng đối tượng"],
        "benefits": ["Phát triển ứng dụng Android", "Làm việc với Kotlin", "Đưa ứng dụng lên Google Play"],
        "relatedLinks": ["https://developer.android.com", "https://kotlinlang.org"],
        "instructorId": "64f0c1234567890abcdef130",
        "price": 4000000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 42,
        "reports": 0,
        "createdAt": "2025-08-01T03:00:00.000Z",
        "updatedAt": "2025-08-01T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef130"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef131",
        "title": "Quảng cáo trên mạng xã hội",
        "description": "Học cách chạy quảng cáo hiệu quả trên các nền tảng như Facebook, Instagram và TikTok để tiếp cận khách hàng mục tiêu.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/social-media-ads.jpg",
        "domain": "Marketing",
        "level": "beginner",
        "prerequisites": ["Không yêu cầu kinh nghiệm trước"],
        "benefits": ["Tạo chiến dịch quảng cáo hiệu quả", "Tối ưu hóa chi phí quảng cáo", "Phân tích hiệu suất quảng cáo"],
        "relatedLinks": ["https://ads.facebook.com", "https://business.instagram.com"],
        "instructorId": "64f0c1234567890abcdef131",
        "price": 2000000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 25,
        "reports": 0,
        "createdAt": "2025-07-31T03:00:00.000Z",
        "updatedAt": "2025-07-31T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef131"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef132",
        "title": "Học Deep Learning với TensorFlow",
        "description": "Khóa học chuyên sâu về Deep Learning, sử dụng TensorFlow để xây dựng các mô hình học sâu như CNN và RNN.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/deep-learning.jpg",
        "domain": "IT",
        "level": "advanced",
        "prerequisites": ["Machine Learning cơ bản", "Python nâng cao", "Toán học nâng cao"],
        "benefits": ["Xây dựng mô hình Deep Learning", "Áp dụng vào các dự án AI", "Hiểu về mạng nơ-ron"],
        "relatedLinks": ["https://tensorflow.org", "https://deeplearning.ai"],
        "instructorId": "64f0c1234567890abcdef132",
        "price": 5500000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 48,
        "reports": 0,
        "createdAt": "2025-07-30T03:00:00.000Z",
        "updatedAt": "2025-07-30T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef132"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef133",
        "title": "Content Marketing chuyên sâu",
        "description": "Khóa học giúp bạn xây dựng chiến lược nội dung hiệu quả, từ viết bài PR, blog đến video marketing.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/content-marketing.jpg",
        "domain": "Marketing",
        "level": "intermediate",
        "prerequisites": ["Marketing cơ bản", "Kỹ năng viết cơ bản"],
        "benefits": ["Tạo nội dung thu hút khách hàng", "Xây dựng thương hiệu cá nhân", "Tối ưu hóa nội dung cho SEO"],
        "relatedLinks": ["https://hubspot.com", "https://contentmarketinginstitute.com"],
        "instructorId": "64f0c1234567890abcdef133",
        "price": 2700000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 33,
        "reports": 0,
        "createdAt": "2025-07-29T03:00:00.000Z",
        "updatedAt": "2025-07-29T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef133"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef134",
        "title": "Lập trình iOS với Swift",
        "description": "Khóa học phát triển ứng dụng iOS với Swift, từ giao diện cơ bản đến tích hợp API và xuất bản lên App Store.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/ios-swift.jpg",
        "domain": "IT",
        "level": "intermediate",
        "prerequisites": ["Kiến thức lập trình cơ bản", "Hiểu về giao diện người dùng"],
        "benefits": ["Phát triển ứng dụng iOS", "Làm việc với SwiftUI", "Đưa ứng dụng lên App Store"],
        "relatedLinks": ["https://developer.apple.com", "https://swift.org"],
        "instructorId": "64f0c1234567890abcdef134",
        "price": 4200000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 39,
        "reports": 0,
        "createdAt": "2025-07-28T03:00:00.000Z",
        "updatedAt": "2025-07-28T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef134"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef135",
        "title": "An ninh mạng cơ bản",
        "description": "Khóa học giới thiệu về an ninh mạng, từ bảo mật hệ thống đến phát hiện và ngăn chặn tấn công mạng.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/cybersecurity.jpg",
        "domain": "IT",
        "level": "beginner",
        "prerequisites": ["Kiến thức cơ bản về mạng"],
        "benefits": ["Hiểu về an ninh mạng", "Bảo vệ dữ liệu cá nhân", "Phát hiện lỗ hổng bảo mật"],
        "relatedLinks": ["https://owasp.org", "https://cybersecurity.google"],
        "instructorId": "64f0c1234567890abcdef135",
        "price": 3000000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 36,
        "reports": 0,
        "createdAt": "2025-07-27T03:00:00.000Z",
        "updatedAt": "2025-07-27T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef135"]     // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef136",
        "title": "Email Marketing hiệu quả",
        "description": "Khóa học hướng dẫn cách xây dựng chiến dịch email marketing chuyên nghiệp, từ thiết kế email đến phân tích hiệu quả.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/email-marketing.jpg",
        "domain": "Marketing",
        "level": "beginner",
        "prerequisites": ["Không yêu cầu kinh nghiệm trước"],
        "benefits": ["Tạo email thu hút khách hàng", "Tăng tỷ lệ mở email", "Phân tích hiệu quả chiến dịch"],
        "relatedLinks": ["https://mailchimp.com", "https://sendgrid.com"],
        "instructorId": "64f0c1234567890abcdef136",
        "price": 2200000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 29,
        "reports": 0,
        "createdAt": "2025-07-26T03:00:00.000Z",
        "updatedAt": "2025-07-26T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef136"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef137",
        "title": "Lập trình Backend với Node.js",
        "description": "Khóa học về phát triển backend với Node.js, Express và MongoDB để xây dựng API mạnh mẽ.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/nodejs-backend.jpg",
        "domain": "IT",
        "level": "intermediate",
        "prerequisites": ["JavaScript nâng cao", "Kiến thức về cơ sở dữ liệu"],
        "benefits": ["Xây dựng API hiệu quả", "Làm việc với MongoDB", "Tích hợp backend với frontend"],
        "relatedLinks": ["https://nodejs.org", "https://expressjs.com"],
        "instructorId": "64f0c1234567890abcdef137",
        "price": 3800000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 44,
        "reports": 0,
        "createdAt": "2025-07-25T03:00:00.000Z",
        "updatedAt": "2025-07-25T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef137"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef138",
        "title": "Phát triển Game với Unity",
        "description": "Khóa học hướng dẫn lập trình game 2D và 3D với Unity và ngôn ngữ C#.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/unity-game.jpg",
        "domain": "IT",
        "level": "intermediate",
        "prerequisites": ["C# cơ bản", "Kiến thức về lập trình hướng đối tượng"],
        "benefits": ["Phát triển game 2D/3D", "Làm việc với Unity Engine", "Xuất bản game lên nền tảng di động"],
        "relatedLinks": ["https://unity.com", "https://learn.unity.com"],
        "instructorId": "64f0c1234567890abcdef138",
        "price": 4600000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 47,
        "reports": 0,
        "createdAt": "2025-07-24T03:00:00.000Z",
        "updatedAt": "2025-07-24T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef138"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef139",
        "title": "Phân tích dữ liệu kinh doanh với Power BI",
        "description": "Khóa học hướng dẫn sử dụng Power BI để phân tích và trực quan hóa dữ liệu kinh doanh.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/power-bi.jpg",
        "domain": "IT",
        "level": "beginner",
        "prerequisites": ["Kiến thức cơ bản về Excel"],
        "benefits": ["Tạo báo cáo trực quan", "Phân tích dữ liệu kinh doanh", "Tích hợp với các nguồn dữ liệu"],
        "relatedLinks": ["https://powerbi.microsoft.com", "https://docs.microsoft.com"],
        "instructorId": "64f0c1234567890abcdef139",
        "price": 2900000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 31,
        "reports": 0,
        "createdAt": "2025-07-23T03:00:00.000Z",
        "updatedAt": "2025-07-23T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef139"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef140",
        "title": "Branding cá nhân và doanh nghiệp",
        "description": "Khóa học về xây dựng thương hiệu cá nhân và doanh nghiệp để tạo dấu ấn trên thị trường.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/branding-course.jpg",
        "domain": "Marketing",
        "level": "beginner",
        "prerequisites": ["Không yêu cầu kinh nghiệm trước"],
        "benefits": ["Xây dựng thương hiệu cá nhân", "Tăng độ nhận diện thương hiệu", "Tạo chiến lược branding"],
        "relatedLinks": ["https://canva.com", "https://brandingmag.com"],
        "instructorId": "64f0c1234567890abcdef140",
        "price": 2400000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 27,
        "reports": 0,
        "createdAt": "2025-07-22T03:00:00.000Z",
        "updatedAt": "2025-07-22T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef140"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef141",
        "title": "Lập trình Front-end với Vue.js",
        "description": "Khóa học phát triển giao diện web hiện đại với Vue.js và các công cụ như Vue Router, Vuex.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/vuejs-course.jpg",
        "domain": "IT",
        "level": "intermediate",
        "prerequisites": ["JavaScript nâng cao", "HTML/CSS"],
        "benefits": ["Xây dựng giao diện web động", "Làm việc với Vue.js", "Tích hợp API vào frontend"],
        "relatedLinks": ["https://vuejs.org", "https://vuex.vuejs.org"],
        "instructorId": "64f0c1234567890abcdef141",
        "price": 3700000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 43,
        "reports": 0,
        "createdAt": "2025-07-21T03:00:00.000Z",
        "updatedAt": "2025-07-21T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef141"] // Thêm thuộc tính
      },
      {
        "_id": "64f0d1234567890abcdef142",
        "title": "Tối ưu hóa hiệu suất website",
        "description": "Khóa học hướng dẫn cách tối ưu hóa tốc độ và hiệu suất website với các kỹ thuật như lazy loading, minification và CDN.",
        "thumbnail": "https://storage.googleapis.com/a1aa/image/web-performance.jpg",
        "domain": "IT",
        "level": "advanced",
        "prerequisites": ["HTML/CSS nâng cao", "JavaScript nâng cao"],
        "benefits": ["Tăng tốc độ website", "Cải thiện trải nghiệm người dùng", "Tối ưu hóa SEO"],
        "relatedLinks": ["https://web.dev", "https://developers.google.com/speed"],
        "instructorId": "64f0c1234567890abcdef142",
        "price": 3300000,
        "isPublished": true,
        "isApproved": true,
        "upvotes": 38,
        "reports": 0,
        "createdAt": "2025-07-20T03:00:00.000Z",
        "updatedAt": "2025-07-20T03:00:00.000Z",
        "enrolledStudents": ["64f0c1234567890abcdef142"] // Thêm thuộc tính
      }
    ];

    // Simulate API delay
    setTimeout(() => {
      setCourses(mockCourses);
      setFilteredCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter courses based on current filters
  useEffect(() => {
    let filtered = [...courses];

    if (filters.domain) {
      filtered = filtered.filter(course => course.domain === filters.domain);
    }

    if (filters.level) {
      filtered = filtered.filter(course => course.level === filters.level);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchLower) ||
        course.description.toLowerCase().includes(searchLower)
      );
    }

    // Sort courses
    switch (filters.sort) {
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'popular':
        filtered.sort((a, b) => b.upvotes - a.upvotes);
        break;
      default:
        break;
    }

    setFilteredCourses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [courses, filters]);

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