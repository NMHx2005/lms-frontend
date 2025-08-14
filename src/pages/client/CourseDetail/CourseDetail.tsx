import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from "@/components/Layout/client/Header";
import Footer from "@/components/Layout/client/Footer";
import CourseHero from "@/components/Client/CourseDetail/CourseHero/CourseHero";
import CourseContent from "@/components/Client/CourseDetail/CourseContent/CourseContent";
import CourseCTA from "@/components/Client/CourseDetail/CourseCTA/CourseCTA";
import CourseFAQ from "@/components/Client/CourseDetail/CourseFAQ/CourseFAQ";
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import "./CourseDetail.css";

interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  imgSrc: string;
  imgAlt: string;
  price: number;
  originalPrice?: number;
  rating: number;
  totalRatings: number;
  instructor: {
    name: string;
    avatar: string;
    title: string;
    company: string;
  };
  duration: string;
  level: string;
  students: number;
  lastUpdated: string;
  language: string;
  whatYouWillLearn: string[];
  requirements: string[];
  targetAudience: string[];
  curriculum: {
    section: string;
    lessons: {
      title: string;
      duration: string;
      type: 'video' | 'text' | 'quiz' | 'assignment';
      isPreview?: boolean;
    }[];
  }[];
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data - trong thực tế sẽ lấy từ API
  useEffect(() => {
    const mockCourse: Course = {
      id: id || '1',
      title: 'Đào tạo lập trình viên quốc tế - Full Stack Development',
      description: 'Khóa học toàn diện về Full Stack Development, từ cơ bản đến nâng cao. Bạn sẽ học được cách xây dựng ứng dụng web hoàn chỉnh từ frontend đến backend, sử dụng các công nghệ hiện đại như React, Node.js, MongoDB và nhiều công nghệ khác. Khóa học được thiết kế bởi các chuyên gia hàng đầu trong lĩnh vực phát triển phần mềm.',
      category: 'Khoa học máy tính',
      imgSrc: 'https://storage.googleapis.com/a1aa/image/2acdcf6b-7987-4e03-25b9-3a37878e436d.jpg',
      imgAlt: 'Full Stack Development Course',
      price: 5000000,
      originalPrice: 8000000,
      rating: 4.8,
      totalRatings: 1247,
      instructor: {
        name: 'Nguyễn Văn A',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        title: 'Senior Full Stack Developer',
        company: 'TechCorp Vietnam'
      },
      duration: '6 tháng',
      level: 'beginner',
      students: 15420,
      lastUpdated: 'Tháng 12, 2024',
      language: 'Tiếng Việt',
      whatYouWillLearn: [
        'Xây dựng ứng dụng web hoàn chỉnh từ frontend đến backend',
        'Làm chủ React, Node.js, MongoDB và các công nghệ hiện đại',
        'Thiết kế và phát triển RESTful API chuyên nghiệp',
        'Triển khai ứng dụng lên cloud và quản lý database',
        'Áp dụng các best practices trong phát triển phần mềm',
        'Làm việc với Git và quy trình phát triển Agile'
      ],
      requirements: [
        'Có kiến thức cơ bản về HTML, CSS và JavaScript',
        'Có máy tính cá nhân với hệ điều hành Windows, macOS hoặc Linux',
        'Có kết nối internet ổn định để học online',
        'Có thời gian học tập ít nhất 2-3 giờ mỗi ngày'
      ],
      targetAudience: [
        'Sinh viên ngành Công nghệ thông tin muốn học Full Stack Development',
        'Lập trình viên frontend muốn mở rộng kỹ năng sang backend',
        'Lập trình viên backend muốn học frontend và trở thành Full Stack',
        'Người mới bắt đầu muốn chuyển đổi nghề nghiệp sang lập trình',
        'Freelancer muốn có kỹ năng toàn diện để nhận dự án lớn'
      ],
      curriculum: [
        {
          section: 'Chương 1: Giới thiệu và cài đặt môi trường',
          lessons: [
            { title: 'Giới thiệu khóa học và lộ trình học tập', duration: '15:00', type: 'video', isPreview: true },
            { title: 'Cài đặt Node.js và các công cụ cần thiết', duration: '20:00', type: 'video' },
            { title: 'Cài đặt VS Code và các extension hữu ích', duration: '12:00', type: 'video' },
            { title: 'Tạo project và cấu trúc thư mục', duration: '18:00', type: 'video' },
            { title: 'Bài tập thực hành: Cài đặt môi trường', duration: '30:00', type: 'assignment' }
          ]
        },
        {
          section: 'Chương 2: HTML, CSS và JavaScript cơ bản',
          lessons: [
            { title: 'HTML5: Cấu trúc và semantic elements', duration: '25:00', type: 'video' },
            { title: 'CSS3: Layout, Flexbox và Grid', duration: '30:00', type: 'video' },
            { title: 'JavaScript ES6+: Variables, functions và objects', duration: '35:00', type: 'video' },
            { title: 'DOM manipulation và event handling', duration: '28:00', type: 'video' },
            { title: 'Bài tập thực hành: Tạo landing page', duration: '45:00', type: 'assignment' },
            { title: 'Quiz: Kiểm tra kiến thức HTML/CSS/JS', duration: '20:00', type: 'quiz' }
          ]
        },
        {
          section: 'Chương 3: React cơ bản đến nâng cao',
          lessons: [
            { title: 'Giới thiệu React và JSX', duration: '22:00', type: 'video' },
            { title: 'Components, props và state', duration: '30:00', type: 'video' },
            { title: 'Hooks: useState, useEffect, useContext', duration: '35:00', type: 'video' },
            { title: 'Routing với React Router', duration: '25:00', type: 'video' },
            { title: 'State management với Redux Toolkit', duration: '40:00', type: 'video' },
            { title: 'Bài tập thực hành: Xây dựng ứng dụng React', duration: '60:00', type: 'assignment' }
          ]
        },
        {
          section: 'Chương 4: Backend với Node.js và Express',
          lessons: [
            { title: 'Giới thiệu Node.js và Express', duration: '20:00', type: 'video' },
            { title: 'Tạo server và routing', duration: '28:00', type: 'video' },
            { title: 'Middleware và error handling', duration: '25:00', type: 'video' },
            { title: 'Kết nối database MongoDB', duration: '30:00', type: 'video' },
            { title: 'Authentication và authorization', duration: '35:00', type: 'video' },
            { title: 'Bài tập thực hành: Xây dựng RESTful API', duration: '50:00', type: 'assignment' }
          ]
        },
        {
          section: 'Chương 5: Database và ORM',
          lessons: [
            { title: 'Thiết kế database schema', duration: '25:00', type: 'video' },
            { title: 'MongoDB: CRUD operations', duration: '30:00', type: 'video' },
            { title: 'Mongoose ODM và validation', duration: '28:00', type: 'video' },
            { title: 'Relationships và data modeling', duration: '32:00', type: 'video' },
            { title: 'Bài tập thực hành: Thiết kế database', duration: '40:00', type: 'assignment' }
          ]
        },
        {
          section: 'Chương 6: Deployment và DevOps cơ bản',
          lessons: [
            { title: 'Git và GitHub workflow', duration: '25:00', type: 'video' },
            { title: 'Deploy lên Heroku/Vercel', duration: '30:00', type: 'video' },
            { title: 'Environment variables và security', duration: '20:00', type: 'video' },
            { title: 'Monitoring và logging', duration: '18:00', type: 'video' },
            { title: 'Bài tập thực hành: Deploy ứng dụng', duration: '45:00', type: 'assignment' }
          ]
        }
      ]
    };

    // Simulate API call delay
    setTimeout(() => {
      setCourse(mockCourse);
      setLoading(false);
    }, 1000);
  }, [id]);

  const faqs = [
    {
      id: 1,
      question: 'Tôi có cần kiến thức lập trình trước khi tham gia khóa học không?',
      answer: 'Khóa học được thiết kế cho người mới bắt đầu, nhưng bạn nên có kiến thức cơ bản về HTML, CSS và JavaScript. Nếu chưa có, chúng tôi cung cấp tài liệu bổ sung để bạn tự học trước.'
    },
    {
      id: 2,
      question: 'Khóa học có cung cấp chứng chỉ không?',
      answer: 'Có, sau khi hoàn thành khóa học và làm đủ bài tập, bạn sẽ nhận được chứng chỉ hoàn thành có giá trị quốc tế, được công nhận bởi nhiều công ty công nghệ.'
    },
    {
      id: 3,
      question: 'Tôi có thể học theo tốc độ của mình không?',
      answer: 'Hoàn toàn có thể! Khóa học cung cấp quyền truy cập vĩnh viễn, bạn có thể học bất cứ lúc nào và theo tốc độ phù hợp với mình.'
    },
    {
      id: 4,
      question: 'Có hỗ trợ khi tôi gặp khó khăn không?',
      answer: 'Có, chúng tôi cung cấp hỗ trợ 1-1 thông qua chat, email và video call. Đội ngũ giảng viên và trợ giảng luôn sẵn sàng hỗ trợ bạn 24/7.'
    },
    {
      id: 5,
      question: 'Tôi có thể hoàn tiền nếu không hài lòng không?',
      answer: 'Có, chúng tôi cam kết hoàn tiền 100% trong vòng 30 ngày nếu bạn không hài lòng với khóa học. Không cần lý do, không cần câu hỏi.'
    }
  ];

  if (loading) {
    return (
      <>
        <TopBar />
        <Header />
        <div className="course-detail-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin khóa học...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!course) {
    return (
      <>
        <TopBar />
        <Header />
        <div className="course-detail-error">
          <h2>Không tìm thấy khóa học</h2>
          <p>Khóa học bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Header />
      
      <main className="course-detail">
        <CourseHero course={course} />
        <CourseContent course={course} />
        <CourseCTA course={course} />
        <CourseFAQ faqs={faqs} />
      </main>
      
      <Footer />
    </>
  );
};

export default CourseDetail;