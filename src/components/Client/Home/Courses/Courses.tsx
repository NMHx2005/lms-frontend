import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../Card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import { clientCoursesService } from "../../../../services/client/courses.service";

interface Course {
    _id: string;
    title: string;
    shortDescription?: string;
    description?: string;
    thumbnail?: string;
    domain?: string;
    level?: string;
    averageRating?: number;
    totalStudents?: number;
    totalLessons?: number;
    price?: number;
    originalPrice?: number;
    discountPercentage?: number;
    instructorId?: {
        name: string;
        email: string;
        avatar?: string;
    };
    certificate?: boolean;
}

const Courses = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch courses with limit and sorting
                const response = await clientCoursesService.getCourses({
                    limit: 8, // Get 8 courses
                    sortBy: 'createdAt',
                    sortOrder: 'desc'
                });

                if (response.success && response.data) {
                    setCourses(response.data.courses || response.data);
                } else {
                    setError('Không thể tải danh sách khóa học');
                }
            } catch (err: any) {
                console.error('Error fetching courses:', err);
                setError('Có lỗi xảy ra khi tải danh sách khóa học');
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    // Loading state
    if (loading) {
        return (
            <section className="section" aria-label="Courses">
                <div className="section__header">
                    <div>
                        <h2 className="section__title">Lớp học</h2>
                        <p className="section__subtitle">Rất nhiều các khóa học từ nhiều lĩnh vực với nhiều các trung tâm uy tín.</p>
                    </div>
                    <Link to="/courses">
                        <button type="button" className="section__btn">
                            Xem
                        </button>
                    </Link>
                </div>
                <div className="featured-slider">
                    <div className="loading-placeholder">
                        <div className="loading-text">Đang tải danh sách khóa học...</div>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="section" aria-label="Courses">
                <div className="section__header">
                    <div>
                        <h2 className="section__title">Lớp học</h2>
                        <p className="section__subtitle">Rất nhiều các khóa học từ nhiều lĩnh vực với nhiều các trung tâm uy tín.</p>
                    </div>
                    <Link to="/courses">
                        <button type="button" className="section__btn">
                            Xem
                        </button>
                    </Link>
                </div>
                <div className="featured-slider">
                    <div className="error-placeholder">
                        <div className="error-text">{error}</div>
                        <button
                            onClick={() => window.location.reload()}
                            className="retry-btn"
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    // Empty state
    if (!courses || courses.length === 0) {
        return (
            <section className="section" aria-label="Courses">
                <div className="section__header">
                    <div>
                        <h2 className="section__title">Lớp học</h2>
                        <p className="section__subtitle">Rất nhiều các khóa học từ nhiều lĩnh vực với nhiều các trung tâm uy tín.</p>
                    </div>
                    <Link to="/courses">
                        <button type="button" className="section__btn">
                            Xem
                        </button>
                    </Link>
                </div>
                <div className="featured-slider">
                    <div className="empty-placeholder">
                        <div className="empty-text">Chưa có khóa học nào</div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section" aria-label="Courses">
            <div className="section__header">
                <div>
                    <h2 className="section__title">Lớp học</h2>
                    <p className="section__subtitle">Rất nhiều các khóa học từ nhiều lĩnh vực với nhiều các trung tâm uy tín.</p>
                </div>
                <Link to="/courses">
                    <button type="button" className="section__btn">
                        Xem
                    </button>
                </Link>
            </div>
            <div className="featured-slider">
                <Swiper
                    modules={[Autoplay]}
                    spaceBetween={24}
                    slidesPerView={1}
                    autoplay={{ delay: 3000, disableOnInteraction: false }}
                    loop={true}
                    grabCursor={true}
                    watchOverflow={true}
                    breakpoints={{
                        320: { slidesPerView: 1, spaceBetween: 16 },
                        480: { slidesPerView: 1, spaceBetween: 16 },
                        640: { slidesPerView: 2, spaceBetween: 20 },
                        768: { slidesPerView: 2, spaceBetween: 20 },
                        1024: { slidesPerView: 3, spaceBetween: 24 },
                        1280: { slidesPerView: 4, spaceBetween: 24 },
                        1536: { slidesPerView: 5, spaceBetween: 24 },
                    }}
                >
                    {courses.map((course, index) => (
                        <SwiperSlide key={course._id || index}>
                            <Card
                                id={course._id}
                                category={course.domain || 'Khóa học'}
                                title={course.title}
                                desc={course.shortDescription || course.description || 'Không có mô tả'}
                                imgSrc={course.thumbnail || '/images/default-course.jpg'}
                                imgAlt={`Khóa học: ${course.title}`}
                                btnText="Xem thử"
                                linkText="Chi tiết →"
                                linkHref={`/courses/${course._id}`}
                                fetchData={false} // Use static data since we already have course info
                            />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Courses;