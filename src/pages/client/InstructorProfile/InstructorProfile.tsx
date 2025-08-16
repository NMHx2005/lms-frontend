import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './InstructorProfile.css';
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  rating: number;
  studentsCount: number;
  level: string;
  duration: number;
  isPublished: boolean;
}

interface Instructor {
  _id: string;
  name: string;
  avatar: string;
  bio: string;
  title: string;
  company: string;
  location: string;
  website: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    youtube?: string;
  };
  stats: {
    totalStudents: number;
    totalCourses: number;
    totalReviews: number;
    averageRating: number;
    totalEarnings: number;
  };
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  experience: {
    position: string;
    company: string;
    duration: string;
    description: string;
  }[];
  reviews: {
    _id: string;
    studentName: string;
    studentAvatar: string;
    rating: number;
    comment: string;
    date: string;
    courseTitle: string;
  }[];
}

const InstructorProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [instructor, setInstructor] = useState<Instructor | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'about' | 'reviews'>('courses');

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockInstructor: Instructor = {
        _id: id || '1',
        name: 'Hieu Doan',
        avatar: '/images/avatar1.jpg',
        bio: 'Tôi là một Full-stack Developer với hơn 8 năm kinh nghiệm trong việc phát triển web applications. Tôi đam mê chia sẻ kiến thức và giúp đỡ các developer trẻ phát triển kỹ năng của mình.',
        title: 'Senior Full-stack Developer',
        company: 'TechCorp Vietnam',
        location: 'Ho Chi Minh City, Vietnam',
        website: 'https://hieudoan.dev',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/hieudoan',
          github: 'https://github.com/hieudoan',
          youtube: 'https://youtube.com/@hieudoan'
        },
        stats: {
          totalStudents: 15420,
          totalCourses: 12,
          totalReviews: 2847,
          averageRating: 4.8,
          totalEarnings: 125000000
        },
        skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'Docker', 'MongoDB', 'PostgreSQL'],
        education: [
          {
            degree: 'Bachelor of Computer Science',
            institution: 'University of Technology',
            year: 2015
          },
          {
            degree: 'Master of Software Engineering',
            institution: 'International University',
            year: 2018
          }
        ],
        experience: [
          {
            position: 'Junior Developer',
            company: 'StartupXYZ',
            duration: '2015-2017',
            description: 'Phát triển web applications với React và Node.js'
          },
          {
            position: 'Full-stack Developer',
            company: 'TechCorp Vietnam',
            duration: '2017-2020',
            description: 'Xây dựng enterprise applications và mentoring junior developers'
          },
          {
            position: 'Senior Developer',
            company: 'TechCorp Vietnam',
            duration: '2020-Present',
            description: 'Lead technical projects và architecture decisions'
          }
        ],
        reviews: [
          {
            _id: '1',
            studentName: 'Minh Nguyen',
            studentAvatar: '/images/student1.jpg',
            rating: 5,
            comment: 'Khóa học rất hay và dễ hiểu. Giảng viên giải thích rõ ràng và có nhiều ví dụ thực tế.',
            date: '2024-01-15',
            courseTitle: 'React Advanced Patterns'
          },
          {
            _id: '2',
            studentName: 'Lan Tran',
            studentAvatar: '/images/student2.jpg',
            rating: 5,
            comment: 'Tôi đã học được rất nhiều từ khóa học này. Cảm ơn thầy đã chia sẻ kiến thức quý báu.',
            date: '2024-01-10',
            courseTitle: 'Node.js Backend Development'
          },
          {
            _id: '3',
            studentName: 'Nam Le',
            studentAvatar: '/images/student3.jpg',
            rating: 4,
            comment: 'Khóa học tốt, nhưng có thể cải thiện thêm phần thực hành.',
            date: '2024-01-05',
            courseTitle: 'JavaScript Fundamentals'
          }
        ]
      };

      const mockCourses: Course[] = [
        {
          _id: '1',
          title: 'React Advanced Patterns',
          description: 'Học các pattern nâng cao trong React để xây dựng ứng dụng chuyên nghiệp',
          thumbnail: '/images/course1.jpg',
          price: 299000,
          rating: 4.8,
          studentsCount: 1250,
          level: 'Advanced',
          duration: 1800,
          isPublished: true
        },
        {
          _id: '2',
          title: 'Node.js Backend Development',
          description: 'Xây dựng REST API và backend services với Node.js và Express',
          thumbnail: '/images/course2.jpg',
          price: 399000,
          rating: 4.6,
          studentsCount: 890,
          level: 'Intermediate',
          duration: 2400,
          isPublished: true
        },
        {
          _id: '3',
          title: 'JavaScript Fundamentals',
          description: 'Nền tảng JavaScript cơ bản cho người mới bắt đầu',
          thumbnail: '/images/course4.jpg',
          price: 150000,
          rating: 4.7,
          studentsCount: 1800,
          level: 'Beginner',
          duration: 900,
          isPublished: true
        }
      ];

      setInstructor(mockInstructor);
      setCourses(mockCourses);
      setLoading(false);
    }, 1000);
  }, [id]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <Header />
      <div className="instructor-profile">
        <div className="instructor-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải thông tin giảng viên...</p>
        </div>
      </div>
      <Footer />
    </>
    );
  }

  if (!instructor) {
    return (
      <>
      <TopBar />
      <Header />
      <div className="instructor-profile">
        <div className="instructor-not-found">
          <h1>Không tìm thấy giảng viên</h1>
          <p>Giảng viên bạn tìm kiếm không tồn tại.</p>
          <Link to="/courses" className="back-to-courses-btn">
            Quay lại danh sách khóa học
          </Link>
        </div>
      </div>
      <Footer />
      </>
    );
  }

  return (
    <>
    <TopBar />
    <Header />
    <div className="instructor-profile">
      {/* Instructor Header */}
      <div className="instructor-header">
        <div className="instructor-header__content">
          <div className="instructor-avatar instructor-avatar--modefi">
            <img src={instructor.avatar} alt={instructor.name} />
          </div>
          <div className="instructor-info">
            <h1>{instructor.name}</h1>
            <p className="instructor-title">{instructor.title}</p>
            <p className="instructor-company">{instructor.company}</p>
            <p className="instructor-location">📍 {instructor.location}</p>
            
            <div className="instructor-stats">
              <div className="stat-item">
                <span className="stat-value">{instructor.stats.totalStudents.toLocaleString()}</span>
                <span className="stat-label">Học viên</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{instructor.stats.totalCourses}</span>
                <span className="stat-label">Khóa học</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{instructor.stats.averageRating}</span>
                <span className="stat-label">Đánh giá</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{instructor.stats.totalReviews.toLocaleString()}</span>
                <span className="stat-label">Nhận xét</span>
              </div>
            </div>

            <div className="instructor-actions">
              <button className="follow-btn">+ Theo dõi</button>
              <button className="message-btn">💬 Nhắn tin</button>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="social-links">
        {instructor.website && (
          <a href={instructor.website} target="_blank" rel="noopener noreferrer" className="social-link">
            🌐 Website
          </a>
        )}
        {instructor.socialLinks.linkedin && (
          <a href={instructor.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
            💼 LinkedIn
          </a>
        )}
        {instructor.socialLinks.github && (
          <a href={instructor.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link">
            🐙 GitHub
          </a>
        )}
        {instructor.socialLinks.youtube && (
          <a href={instructor.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="social-link">
            📺 YouTube
          </a>
        )}
      </div>

      {/* Bio */}
      <div className="instructor-bio">
        <h2>Giới thiệu</h2>
        <p>{instructor.bio}</p>
      </div>

      {/* Skills */}
      <div className="instructor-skills">
        <h2>Kỹ năng</h2>
        <div className="skills-list">
          {instructor.skills.map((skill, index) => (
            <span key={index} className="skill-tag">{skill}</span>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="instructor-tabs">
        <button 
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          Khóa học ({instructor.stats.totalCourses})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          Thông tin
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
          onClick={() => setActiveTab('reviews')}
        >
          Đánh giá ({instructor.stats.totalReviews})
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'courses' && (
          <div className="courses-tab">
            <div className="courses-grid">
              {courses.map((course) => (
                <div key={course._id} className="course-card">
                  <div className="course-thumbnail course-thumbnail-analytics">
                    <img src={course.thumbnail} alt={course.title} />
                  </div>
                  <div className="course-content">
                    <h3 className="course-title">
                      <Link to={`/courses/${course._id}`}>{course.title}</Link>
                    </h3>
                    <p className="course-description">{course.description}</p>
                    <div className="course-meta">
                      <span className="rating">⭐ {course.rating}</span>
                      <span className="students">👥 {course.studentsCount}</span>
                      <span className="duration">⏱️ {formatDuration(course.duration)}</span>
                      <span className="level">{course.level}</span>
                    </div>
                    <div className="course-price">
                      <span className="price">{formatPrice(course.price)}</span>
                      <Link to={`/courses/${course._id}`} className="view-course-btn">
                        Xem khóa học
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="about-tab">
            <div className="about-section">
              <h3>Học vấn</h3>
              {instructor.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <h4>{edu.degree}</h4>
                  <p>{edu.institution} • {edu.year}</p>
                </div>
              ))}
            </div>

            <div className="about-section">
              <h3>Kinh nghiệm</h3>
              {instructor.experience.map((exp, index) => (
                <div key={index} className="experience-item">
                  <h4>{exp.position}</h4>
                  <p className="company">{exp.company} • {exp.duration}</p>
                  <p className="description">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="reviews-tab">
            <div className="reviews-list">
              {instructor.reviews.map((review) => (
                <div key={review._id} className="review-item">
                  <div className="review-header">
                    <div className="reviewer-info">
                      <img src={review.studentAvatar} alt={review.studentName} />
                      <div>
                        <h4>{review.studentName}</h4>
                        <p className="course-title">{review.courseTitle}</p>
                      </div>
                    </div>
                    <div className="review-rating">
                      <span className="stars">
                        {'⭐'.repeat(review.rating)}
                      </span>
                      <span className="date">{new Date(review.date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default InstructorProfile;
