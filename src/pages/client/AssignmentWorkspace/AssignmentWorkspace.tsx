import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';
import AssignmentView from '@/components/Client/AssignmentWorkspace/AssignmentView';
import AssignmentSubmit from '@/components/Client/AssignmentWorkspace/AssignmentSubmit';
import SubmissionHistory from '@/components/Client/AssignmentWorkspace/SubmissionHistory';
import GradingStatus from '@/components/Client/AssignmentWorkspace/GradingStatus';
import { Assignment, Submission } from '@/components/Client/AssignmentWorkspace/types';
import './AssignmentWorkspace.css';

const AssignmentWorkspace: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'view' | 'submit' | 'history' | 'grading'>('view');
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAssignmentData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock assignment data
        const mockAssignment: Assignment = {
          id: id || '1',
          title: 'Bài tập thực hành: Xây dựng RESTful API',
          description: 'Trong bài tập này, bạn sẽ xây dựng một RESTful API hoàn chỉnh sử dụng Node.js, Express và MongoDB. API sẽ có đầy đủ các chức năng CRUD, authentication và validation.',
          instructions: '1. Tạo project Node.js mới\n2. Cài đặt các dependencies cần thiết\n3. Thiết kế database schema\n4. Implement các endpoints CRUD\n5. Thêm authentication middleware\n6. Viết unit tests\n7. Deploy lên Heroku/Vercel',
          dueDate: '2024-12-31T23:59:59Z',
          maxScore: 100,
          type: 'file',
          attachments: [
            {
              name: 'assignment-requirements.pdf',
              size: 1024 * 1024, // 1MB
              type: 'application/pdf',
              url: '#'
            },
            {
              name: 'api-specification.json',
              size: 512 * 1024, // 512KB
              type: 'application/json',
              url: '#'
            },
            {
              name: 'database-schema.sql',
              size: 256 * 1024, // 256KB
              type: 'application/sql',
              url: '#'
            }
          ],
          gradingCriteria: [
            'Code quality và structure (20 điểm)',
            'API functionality và endpoints (25 điểm)',
            'Database design và implementation (20 điểm)',
            'Authentication và security (15 điểm)',
            'Testing coverage (10 điểm)',
            'Documentation và deployment (10 điểm)'
          ],
          importantNotes: [
            'Nộp bài đúng hạn để được chấm điểm đầy đủ',
            'Code phải được format và comment rõ ràng',
            'Cần có README.md mô tả cách chạy project',
            'Deploy lên cloud platform và cung cấp link demo'
          ]
        };

        // Add a quiz assignment for demonstration
        if (id === '2') {
          mockAssignment.title = 'Quiz: Kiến thức cơ bản về Web Development';
          mockAssignment.description = 'Bài quiz kiểm tra kiến thức cơ bản về HTML, CSS, JavaScript và các khái niệm web development.';
          mockAssignment.instructions = '1. Đọc kỹ từng câu hỏi\n2. Chọn đáp án chính xác nhất\n3. Kiểm tra lại trước khi nộp\n4. Chỉ được nộp một lần',
          mockAssignment.type = 'quiz';
          mockAssignment.attachments = [
            {
              name: 'quiz-guidelines.pdf',
              size: 256 * 1024,
              type: 'application/pdf',
              url: '#'
            }
          ];
          mockAssignment.gradingCriteria = [
            'Mỗi câu trả lời đúng: 10 điểm',
            'Tổng cộng: 100 điểm',
            'Điểm đạt: 70 điểm trở lên'
          ];
          mockAssignment.importantNotes = [
            'Chỉ được nộp một lần',
            'Không được sử dụng tài liệu tham khảo',
            'Thời gian làm bài: 30 phút'
          ];
          mockAssignment.quizQuestions = [
            {
              id: 'q1',
              question: 'HTML là viết tắt của gì?',
              type: 'multiple-choice',
              options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlink and Text Markup Language'],
              required: true
            },
            {
              id: 'q2',
              question: 'CSS được sử dụng để làm gì?',
              type: 'multiple-choice',
              options: ['Tạo cấu trúc trang web', 'Tạo style và layout', 'Xử lý logic', 'Lưu trữ dữ liệu'],
              required: true
            },
            {
              id: 'q3',
              question: 'JavaScript là ngôn ngữ lập trình gì?',
              type: 'multiple-choice',
              options: ['Compiled', 'Interpreted', 'Assembly', 'Machine code'],
              required: true
            },
            {
              id: 'q4',
              question: 'Giải thích ngắn gọn về DOM trong web development:',
              type: 'text',
              required: true
            },
            {
              id: 'q5',
              question: 'Responsive design là gì?',
              type: 'text',
              required: true
            }
          ];
        }

        // Mock submissions data
        const mockSubmissions: Submission[] = [
          {
            id: 'sub-1',
            submittedAt: '2024-12-25T10:30:00Z',
            type: 'file',
            files: [
              {
                name: 'api-project.zip',
                size: 5 * 1024 * 1024, // 5MB
                type: 'application/zip',
                url: '#'
              }
            ],
            comment: 'Đã hoàn thành tất cả yêu cầu cơ bản. Có thêm một số tính năng bonus như rate limiting và caching.',
            status: 'graded',
            score: 85,
            feedback: 'Bài làm tốt, code structure rõ ràng. Cần cải thiện error handling và validation. Bonus points cho các tính năng nâng cao.',
            gradedAt: '2024-12-26T14:20:00Z',
            gradedBy: 'Nguyễn Văn A'
          },
          {
            id: 'sub-2',
            submittedAt: '2024-12-30T15:45:00Z',
            type: 'file',
            files: [
              {
                name: 'rest-api-project.zip',
                size: 3 * 1024 * 1024, // 3MB
                type: 'application/zip',
                url: '#'
              }
            ],
            comment: 'Cập nhật version mới với bug fixes và improvements.',
            status: 'pending',
            score: undefined,
            feedback: undefined,
            gradedAt: undefined,
            gradedBy: undefined
          }
        ];

        // Add quiz submission for quiz assignment
        if (id === '2') {
          mockSubmissions.push({
            id: 'sub-3',
            submittedAt: '2024-12-28T09:15:00Z',
            type: 'quiz',
            quizAnswers: [
              'HyperText Markup Language',
              'Tạo style và layout',
              'Interpreted',
              'DOM (Document Object Model) là một giao diện lập trình cho HTML và XML. Nó đại diện cho trang web như một cây cấu trúc, nơi mỗi node đại diện cho một phần tử HTML.',
              'Responsive design là thiết kế web đáp ứng, tự động điều chỉnh layout và nội dung để hiển thị tốt trên mọi thiết bị và kích thước màn hình.'
            ],
            comment: 'Đã hoàn thành tất cả câu hỏi. Cảm ơn thầy đã tạo bài quiz rất hay!',
            status: 'graded',
            score: 90,
            feedback: 'Trả lời rất tốt, đặc biệt là câu 4 và 5. Bạn hiểu rõ về DOM và responsive design. Cần cải thiện một chút về JavaScript.',
            gradedAt: '2024-12-29T11:30:00Z',
            gradedBy: 'Nguyễn Văn A'
          });
        }

        setAssignment(mockAssignment);
        setSubmissions(mockSubmissions);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải thông tin bài tập');
        setLoading(false);
      }
    };

    fetchAssignmentData();
  }, [id]);

  const handleTabChange = (tab: 'view' | 'submit' | 'history' | 'grading') => {
    setActiveTab(tab);
  };

  if (loading) {
    return (
      <>
        <TopBar />
        <Header />
        <div className="assignment-workspace__loading">
          <div className="assignment-workspace__spinner"></div>
          <p>Đang tải thông tin bài tập...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !assignment) {
    return (
      <>
        <TopBar />
        <Header />
        <div className="assignment-workspace__error">
          <h2>Không thể tải trang bài tập</h2>
          <p>{error || 'Bài tập không tồn tại'}</p>
          <button onClick={() => navigate('/courses')} className="assignment-workspace__back-btn">
            Quay lại danh sách khóa học
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <TopBar />
      <Header />
      
      <main className="assignment-workspace">
        <div className="assignment-workspace__container">
          <div className="assignment-workspace__header">
            <div className="assignment-workspace__breadcrumbs">
              <button onClick={() => navigate('/courses')} className="assignment-workspace__breadcrumb">
                Khóa học
              </button>
              <span className="assignment-workspace__breadcrumb-separator">/</span>
              <button onClick={() => navigate('/learning/1')} className="assignment-workspace__breadcrumb">
                Học tập
              </button>
              <span className="assignment-workspace__breadcrumb-separator">/</span>
              <span className="assignment-workspace__breadcrumb assignment-workspace__breadcrumb--active">
                Bài tập
              </span>
            </div>
            
            <h1 className="assignment-workspace__title">{assignment.title}</h1>
            
            <div className="assignment-workspace__meta">
              <div className="assignment-workspace__meta-item">
                <span className="assignment-workspace__meta-label">Hạn nộp:</span>
                <span className="assignment-workspace__meta-value">
                  {new Date(assignment.dueDate).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="assignment-workspace__meta-item">
                <span className="assignment-workspace__meta-label">Điểm tối đa:</span>
                <span className="assignment-workspace__meta-value">{assignment.maxScore} điểm</span>
              </div>
              <div className="assignment-workspace__meta-item">
                <span className="assignment-workspace__meta-label">Loại bài tập:</span>
                <span className="assignment-workspace__meta-value">
                  {assignment.type === 'file' ? 'Nộp file' : 
                   assignment.type === 'quiz' ? 'Trắc nghiệm' : 'Văn bản'}
                </span>
              </div>
            </div>
          </div>

          <div className="assignment-workspace__tabs">
            <button
              className={`assignment-workspace__tab ${activeTab === 'view' ? 'assignment-workspace__tab--active' : ''}`}
              onClick={() => handleTabChange('view')}
            >
              Xem đề bài
            </button>
            <button
              className={`assignment-workspace__tab ${activeTab === 'submit' ? 'assignment-workspace__tab--active' : ''}`}
              onClick={() => handleTabChange('submit')}
            >
              Nộp bài
            </button>
            <button
              className={`assignment-workspace__tab ${activeTab === 'history' ? 'assignment-workspace__tab--active' : ''}`}
              onClick={() => handleTabChange('history')}
            >
              Lịch sử nộp
            </button>
            <button
              className={`assignment-workspace__tab ${activeTab === 'grading' ? 'assignment-workspace__tab--active' : ''}`}
              onClick={() => handleTabChange('grading')}
            >
              Trạng thái chấm
            </button>
          </div>

          <div className="assignment-workspace__content">
            {activeTab === 'view' && <AssignmentView assignment={assignment} />}
            {activeTab === 'submit' && <AssignmentSubmit assignment={assignment} />}
            {activeTab === 'history' && <SubmissionHistory submissions={submissions} />}
            {activeTab === 'grading' && <GradingStatus submissions={submissions} maxScore={assignment.maxScore} />}
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AssignmentWorkspace;
