import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';
import { clientAuthService } from '@/services/client/auth.service';
import './Learning.css';

interface EnrolledCourse {
    _id: string;
    courseId: {
        _id: string;
        title: string;
        description: string;
        thumbnail: string;
        domain: string;
        level: string;
        instructorId: {
            _id: string;
            name: string;
            avatar: string;
        };
        price: number;
        enrolledStudents: string[];
        createdAt: string;
    };
    progress: number;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
    enrolledAt: string;
    lastAccessedAt: string;
}

const Learning: React.FC = () => {
    const navigate = useNavigate();
    const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterLevel, setFilterLevel] = useState('all');

    useEffect(() => {
        fetchEnrolledCourses();
    }, []);

    const fetchEnrolledCourses = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await clientAuthService.getEnrolledCourses({ limit: 100 });

            if (response.success && response.data) {
                const coursesData = response.data.enrollments || response.data;
                if (Array.isArray(coursesData)) {
                    setEnrolledCourses(coursesData);
                } else {
                    setEnrolledCourses([]);
                }
            } else {
                setEnrolledCourses([]);
            }
        } catch (err: any) {
            console.error('Error fetching enrolled courses:', err);
            setError(err?.message || 'Không thể tải danh sách khóa học');
            setEnrolledCourses([]);
        } finally {
            setLoading(false);
        }
    };

    const filteredCourses = enrolledCourses.filter(enrollment => {
        if (!enrollment || !enrollment.courseId) return false;

        const course = enrollment.courseId;
        const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || enrollment.status === filterStatus;
        const matchesLevel = filterLevel === 'all' || course.level === filterLevel;

        return matchesSearch && matchesStatus && matchesLevel;
    });

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'beginner': return '#10B981';
            case 'intermediate': return '#F59E0B';
            case 'advanced': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getLevelText = (level: string) => {
        switch (level) {
            case 'beginner': return 'Cơ bản';
            case 'intermediate': return 'Trung cấp';
            case 'advanced': return 'Nâng cao';
            default: return level;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return '#10B981';
            case 'completed': return '#3B82F6';
            case 'paused': return '#F59E0B';
            case 'cancelled': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active': return 'Đang học';
            case 'completed': return 'Hoàn thành';
            case 'paused': return 'Tạm dừng';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const handleStartLearning = (courseId: string) => {
        navigate(`/learning/${courseId}`);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    if (loading) {
        return (
            <div className="learning-page">
                <Header />
                <div className="learning__loading">
                    <div className="learning__spinner"></div>
                    <p>Đang tải khóa học...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="learning-page">
                <Header />
                <div className="learning__error">
                    <div className="learning__error-icon">⚠️</div>
                    <h2>Lỗi tải dữ liệu</h2>
                    <p>{error}</p>
                    <button onClick={fetchEnrolledCourses} className="learning__retry-btn">
                        Thử lại
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="learning-page">
            <Header />

            <main className="learning__main">
                <div className="learning__container">
                    {/* Header */}
                    <div className="learning__header">
                        <div className="learning__breadcrumbs">
                            <span>Trang chủ</span>
                            <span>/</span>
                            <span>Học tập</span>
                        </div>
                        <h1 className="learning__title">Khóa học của tôi</h1>
                        <p className="learning__subtitle">
                            Tiếp tục hành trình học tập của bạn với {enrolledCourses.length} khóa học đã đăng ký
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="learning__filters">
                        <div className="learning__search">
                            <input
                                type="text"
                                placeholder="Tìm kiếm khóa học..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="learning__search-input"
                            />
                            <button className="learning__search-btn">🔍</button>
                        </div>

                        <div className="learning__filter-group">
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="learning__filter-select"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Đang học</option>
                                <option value="completed">Hoàn thành</option>
                                <option value="paused">Tạm dừng</option>
                                <option value="cancelled">Đã hủy</option>
                            </select>

                            <select
                                value={filterLevel}
                                onChange={(e) => setFilterLevel(e.target.value)}
                                className="learning__filter-select"
                            >
                                <option value="all">Tất cả cấp độ</option>
                                <option value="beginner">Cơ bản</option>
                                <option value="intermediate">Trung cấp</option>
                                <option value="advanced">Nâng cao</option>
                            </select>
                        </div>
                    </div>

                    {/* Courses Grid */}
                    {filteredCourses.length === 0 ? (
                        <div className="learning__empty">
                            <div className="learning__empty-icon">📚</div>
                            <h3>Không có khóa học nào</h3>
                            <p>
                                {enrolledCourses.length === 0
                                    ? 'Bạn chưa đăng ký khóa học nào. Hãy khám phá các khóa học thú vị!'
                                    : 'Không tìm thấy khóa học phù hợp với bộ lọc của bạn.'
                                }
                            </p>
                            {enrolledCourses.length === 0 && (
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="learning__explore-btn"
                                >
                                    Khám phá khóa học
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="learning__courses-grid">
                            {filteredCourses.map((enrollment) => (
                                <div key={enrollment._id} className="learning__course-card">
                                    <div className="learning__course-thumbnail">
                                        <img
                                            src={enrollment.courseId.thumbnail}
                                            alt={enrollment.courseId.title}
                                            className="learning__course-image"
                                        />
                                        <div className="learning__course-overlay">
                                            <div className="learning__course-level" style={{ backgroundColor: getLevelColor(enrollment.courseId.level) }}>
                                                {getLevelText(enrollment.courseId.level)}
                                            </div>
                                            <div className="learning__course-status" style={{ backgroundColor: getStatusColor(enrollment.status) }}>
                                                {getStatusText(enrollment.status)}
                                            </div>
                                        </div>
                                        <div className="learning__course-progress">
                                            <div className="learning__progress-bar">
                                                <div
                                                    className="learning__progress-fill"
                                                    style={{ width: `${enrollment.progress || 0}%` }}
                                                ></div>
                                            </div>
                                            <span className="learning__progress-text">{enrollment.progress || 0}%</span>
                                        </div>
                                    </div>

                                    <div className="learning__course-content">
                                        <h3 className="learning__course-title">{enrollment.courseId.title}</h3>
                                        <p className="learning__course-description">{enrollment.courseId.description}</p>

                                        <div className="learning__course-meta">
                                            <div className="learning__meta-item">
                                                <span className="learning__meta-icon">👨‍🏫</span>
                                                <span className="learning__meta-text">{enrollment.courseId.instructorId?.name || 'N/A'}</span>
                                            </div>
                                            <div className="learning__meta-item">
                                                <span className="learning__meta-icon">👥</span>
                                                <span className="learning__meta-text">{enrollment.courseId.enrolledStudents?.length || 0} học viên</span>
                                            </div>
                                            <div className="learning__meta-item">
                                                <span className="learning__meta-icon">📅</span>
                                                <span className="learning__meta-text">Đăng ký: {formatDate(enrollment.enrolledAt)}</span>
                                            </div>
                                        </div>

                                        <div className="learning__course-actions">
                                            <button
                                                onClick={() => handleStartLearning(enrollment.courseId._id)}
                                                className="learning__start-btn"
                                                disabled={enrollment.status === 'cancelled'}
                                            >
                                                {enrollment.status === 'completed' ? 'Xem lại' : 'Tiếp tục học'}
                                            </button>
                                            <button className="learning__details-btn">
                                                Chi tiết
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Learning;