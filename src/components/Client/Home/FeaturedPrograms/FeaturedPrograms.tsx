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

const FeaturedPrograms = () => {
    const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchFeaturedCourses = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch top-rated courses as featured courses
                const response = await clientCoursesService.getCourses({
                    limit: 8, // Get 8 featured courses
                    sortBy: 'averageRating',
                    sortOrder: 'desc'
                });

                if (response.success && response.data) {
                    setFeaturedCourses(response.data.courses || response.data);
                } else {
                    setError('Không thể tải danh sách khóa học nổi bật');
                }
            } catch (err: any) {
                console.error('Error fetching featured courses:', err);
                setError('Có lỗi xảy ra khi tải khóa học nổi bật');
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedCourses();
    }, []);

    // Loading state
    if (loading) {
        return (
            <section className="section" aria-label="Featured programs">
                <div className="section__header">
                    <div>
                        <h2 className="section__title">Khóa Học Nổi Bật</h2>
                        <p className="section__subtitle">Rất nhiều các khóa học từ nhiều lĩnh vực với nhiều các trung tâm uy tín.</p>
                    </div>
                    <Link to="/courses" className="section__btn">
                        Xem thêm
                    </Link>
                </div>
                <div className="featured-slider">
                    <div className="loading-placeholder">
                        <div className="loading-text">Đang tải khóa học nổi bật...</div>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section className="section" aria-label="Featured programs">
                <div className="section__header">
                    <div>
                        <h2 className="section__title">Khóa Học Nổi Bật</h2>
                        <p className="section__subtitle">Rất nhiều các khóa học từ nhiều lĩnh vực với nhiều các trung tâm uy tín.</p>
                    </div>
                    <Link to="/courses" className="section__btn">
                        Xem thêm
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
    if (!featuredCourses || featuredCourses.length === 0) {
        return (
            <section className="section" aria-label="Featured programs">
                <div className="section__header">
                    <div>
                        <h2 className="section__title">Khóa Học Nổi Bật</h2>
                        <p className="section__subtitle">Rất nhiều các khóa học từ nhiều lĩnh vực với nhiều các trung tâm uy tín.</p>
                    </div>
                    <Link to="/courses" className="section__btn">
                        Xem thêm
                    </Link>
                </div>
                <div className="featured-slider">
                    <div className="empty-placeholder">
                        <div className="empty-text">Chưa có khóa học nổi bật nào</div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="section" aria-label="Featured programs">
            <div className="section__header">
                <div>
                    <h2 className="section__title">Khóa Học Nổi Bật</h2>
                    <p className="section__subtitle">Rất nhiều các khóa học từ nhiều lĩnh vực với nhiều các trung tâm uy tín.</p>
                </div>
                <Link to="/courses" className="section__btn">
                    Xem thêm
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
                    {featuredCourses.map((course, index) => (
                        <SwiperSlide key={course._id || index}>
                            <Card
                                id={course._id}
                                category={course.domain || 'Khóa học'}
                                title={course.title}
                                desc={course.shortDescription || course.description || 'Không có mô tả'}
                                imgSrc={course.thumbnail || '/images/default-course.jpg'}
                                imgAlt={`Khóa học: ${course.title}`}
                                btnText="Đăng ký"
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

export default FeaturedPrograms;