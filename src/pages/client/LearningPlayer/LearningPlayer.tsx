import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';
import LearningSidebar from '@/components/Client/LearningPlayer/LearningSidebar/LearningSidebar';
import LearningContent from '@/components/Client/LearningPlayer/LearningContent/LearningContent';
import './LearningPlayer.css';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'file' | 'link';
  content: string;
  duration: string;
  isCompleted: boolean;
  isLocked: boolean;
}

interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
  isExpanded: boolean;
}

interface Course {
  id: string;
  title: string;
  instructor: string;
  image: string;
  description: string;
}

const LearningPlayer: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [currentLessonId, setCurrentLessonId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock course data
        const mockCourse: Course = {
          id: courseId || '1',
          title: 'Đào tạo lập trình viên quốc tế',
          instructor: 'Nguyễn Văn A',
          image: 'https://storage.googleapis.com/a1aa/image/0820ec3b-33e6-468b-cc54-d7317c4a00fd.jpg',
          description: 'Khóa học toàn diện về lập trình web từ cơ bản đến nâng cao'
        };
        
        // Mock sections and lessons data
        const mockSections: Section[] = [
          {
            id: '1',
            title: 'Phần 1: Giới thiệu và cài đặt môi trường',
            isExpanded: true,
            lessons: [
              {
                id: '1-1',
                title: 'Chào mừng đến với khóa học',
                type: 'video',
                content: 'https://example.com/video1.mp4',
                duration: '5 phút',
                isCompleted: true,
                isLocked: false
              },
              {
                id: '1-2',
                title: 'Cài đặt môi trường phát triển',
                type: 'text',
                content: `
                  <h2>Cài đặt môi trường phát triển</h2>
                  <p>Trong bài học này, chúng ta sẽ học cách cài đặt các công cụ cần thiết để bắt đầu lập trình web:</p>
                  <h3>1. Cài đặt Node.js</h3>
                  <ul>
                    <li>Truy cập <a href="https://nodejs.org" target="_blank">nodejs.org</a></li>
                    <li>Tải phiên bản LTS mới nhất</li>
                    <li>Chạy installer và làm theo hướng dẫn</li>
                  </ul>
                  <h3>2. Cài đặt Code Editor</h3>
                  <ul>
                    <li>Visual Studio Code (khuyến nghị)</li>
                    <li>Sublime Text</li>
                    <li>WebStorm</li>
                  </ul>
                  <h3>3. Cài đặt Git</h3>
                  <ul>
                    <li>Tải từ <a href="https://git-scm.com" target="_blank">git-scm.com</a></li>
                    <li>Cấu hình user name và email</li>
                  </ul>
                `,
                duration: '15 phút',
                isCompleted: false,
                isLocked: false
              },
              {
                id: '1-3',
                title: 'Tài liệu tham khảo',
                type: 'file',
                content: 'environment-setup.pdf',
                duration: '10 phút',
                isCompleted: false,
                isLocked: false
              }
            ]
          },
          {
            id: '2',
            title: 'Phần 2: HTML cơ bản',
            isExpanded: false,
            lessons: [
              {
                id: '2-1',
                title: 'Cấu trúc HTML cơ bản',
                type: 'video',
                content: 'https://example.com/video2.mp4',
                duration: '20 phút',
                isCompleted: false,
                isLocked: false
              },
              {
                id: '2-2',
                title: 'Các thẻ HTML phổ biến',
                type: 'text',
                content: `
                  <h2>Các thẻ HTML phổ biến</h2>
                  <p>HTML cung cấp nhiều thẻ để tạo cấu trúc và nội dung cho trang web:</p>
                  <h3>Thẻ tiêu đề</h3>
                  <ul>
                    <li>&lt;h1&gt; đến &lt;h6&gt;: Tạo các cấp độ tiêu đề khác nhau</li>
                    <li>&lt;h1&gt; là tiêu đề chính, &lt;h6&gt; là tiêu đề nhỏ nhất</li>
                  </ul>
                  <h3>Thẻ đoạn văn</h3>
                  <ul>
                    <li>&lt;p&gt;: Tạo đoạn văn bản</li>
                    <li>&lt;br&gt;: Xuống dòng</li>
                  </ul>
                  <h3>Thẻ danh sách</h3>
                  <ul>
                    <li>&lt;ul&gt;: Danh sách không có thứ tự</li>
                    <li>&lt;ol&gt;: Danh sách có thứ tự</li>
                    <li>&lt;li&gt;: Phần tử trong danh sách</li>
                  </ul>
                `,
                duration: '25 phút',
                isCompleted: false,
                isLocked: false
              },
              {
                id: '2-3',
                title: 'Tài liệu HTML',
                type: 'link',
                content: 'https://developer.mozilla.org/en-US/docs/Web/HTML',
                duration: '30 phút',
                isCompleted: false,
                isLocked: false
              }
            ]
          },
          {
            id: '3',
            title: 'Phần 3: CSS cơ bản',
            isExpanded: false,
            lessons: [
              {
                id: '3-1',
                title: 'Giới thiệu CSS',
                type: 'video',
                content: 'https://example.com/video3.mp4',
                duration: '18 phút',
                isCompleted: false,
                isLocked: true
              },
              {
                id: '3-2',
                title: 'Selectors và Properties',
                type: 'text',
                content: 'Nội dung về CSS selectors và properties...',
                duration: '22 phút',
                isCompleted: false,
                isLocked: true
              }
            ]
          }
        ];
        
        setCourse(mockCourse);
        setSections(mockSections);
        
        // Set first lesson as current
        if (mockSections.length > 0 && mockSections[0].lessons.length > 0) {
          setCurrentLessonId(mockSections[0].lessons[0].id);
        }
        
      } catch (err) {
        setError('Không thể tải thông tin khóa học');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseData();
    }
  }, [courseId]);

  const handleLessonSelect = (lessonId: string) => {
    setCurrentLessonId(lessonId);
  };

  const handleSectionToggle = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, isExpanded: !section.isExpanded }
        : section
    ));
  };

  const handleLessonComplete = (lessonId: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      lessons: section.lessons.map(lesson =>
        lesson.id === lessonId
          ? { ...lesson, isCompleted: true }
          : lesson
      )
    })));
  };

  const handleProgressUpdate = (lessonId: string, progress: number) => {
    // Update progress for video lessons
    console.log(`Lesson ${lessonId} progress: ${progress}%`);
  };

  const getCurrentLesson = (): Lesson | null => {
    for (const section of sections) {
      const lesson = section.lessons.find(l => l.id === currentLessonId);
      if (lesson) return lesson;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="learning-player-page">
        <Header />
        <div className="learning-player__loading">
          <div className="learning-player__spinner"></div>
          <p>Đang tải khóa học...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="learning-player-page">
        <Header />
        <div className="learning-player__error">
          <h2>Không thể tải trang học tập</h2>
          <p>{error || 'Khóa học không tồn tại'}</p>
          <button onClick={() => navigate('/courses')} className="learning-player__back-btn">
            Quay lại danh sách khóa học
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const currentLesson = getCurrentLesson();

  return (
    <div className="learning-player-page">
      <Header />
      
      <main className="learning-player__main">
        <div className="learning-player__container">
          <div className="learning-player__header">
            <div className="learning-player__course-info">
              <img src={course.image} alt={course.title} className="learning-player__course-image" />
              <div className="learning-player__course-details">
                <h1 className="learning-player__course-title">{course.title}</h1>
                <p className="learning-player__course-instructor">Giảng viên: {course.instructor}</p>
              </div>
            </div>
          </div>

          <div className="learning-player__content">
            <LearningSidebar
              courseId={courseId || ''}
              currentLessonId={currentLessonId}
              onLessonSelect={handleLessonSelect}
              sections={sections}
              onSectionToggle={handleSectionToggle}
            />
            
            {currentLesson ? (
              <LearningContent
                lesson={currentLesson}
                onComplete={handleLessonComplete}
                onProgressUpdate={handleProgressUpdate}
              />
            ) : (
              <div className="learning-player__no-lesson">
                <div className="learning-player__no-lesson-icon">📚</div>
                <h3>Chọn bài học để bắt đầu</h3>
                <p>Vui lòng chọn một bài học từ danh sách bên trái để bắt đầu học tập</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LearningPlayer;
