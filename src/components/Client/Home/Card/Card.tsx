import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { clientCoursesService } from '@/services/client/courses.service';
import "@/styles/home.css";

interface CardProps {
    id?: string; // course id to fetch dynamic data
    category?: string;
    title?: string;
    desc?: string;
    imgSrc?: string;
    imgAlt?: string;
    btnText?: string;
    linkText?: string;
    linkHref?: string;
    fetchData?: boolean; // if true and id provided, fetch from backend
}

const formatCurrency = (value?: number) => {
    if (typeof value !== 'number') return '';
    try {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);
    } catch {
        return `${value.toLocaleString('vi-VN')}₫`;
    }
};

const Card = ({ id, category, title, desc, imgSrc, imgAlt, btnText, linkText, linkHref, fetchData = true }: CardProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [dynamicData, setDynamicData] = useState<{
        title?: string;
        description?: string;
        shortDescription?: string;
        thumbnail?: string;
        domain?: string;
        level?: string;
        averageRating?: number;
        totalStudents?: number;
        totalLessons?: number;
        price?: number;
        originalPrice?: number;
        discountPercentage?: number;
        instructorName?: string;
        certificate?: boolean;
    } | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchCourse = async () => {
            if (!fetchData || !id) return;
            try {
                setIsLoading(true);
                setError(null);
                const res = await clientCoursesService.getCourseById(id);
                // Controller returns { success, data: course }
                const course = res?.data || res; // fallback if shape differs
                if (!isMounted) return;
                setDynamicData({
                    title: course?.title,
                    description: course?.description,
                    shortDescription: course?.shortDescription,
                    thumbnail: course?.thumbnail,
                    domain: course?.domain,
                    level: course?.level,
                    averageRating: course?.averageRating,
                    totalStudents: course?.totalStudents,
                    totalLessons: course?.totalLessons,
                    price: course?.price,
                    originalPrice: course?.originalPrice,
                    discountPercentage: course?.discountPercentage,
                    instructorName: course?.instructorName || course?.instructorId?.name,
                    certificate: course?.certificate
                });
            } catch (e: any) {
                if (!isMounted) return;
                setError(e?.message || 'Failed to load course');
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };
        fetchCourse();
        return () => {
            isMounted = false;
        };
    }, [id, fetchData]);

    const finalTitle = dynamicData?.title || title || '';
    const finalCategory = (dynamicData?.domain || category || '').toUpperCase();
    const finalDesc = dynamicData?.shortDescription || desc || dynamicData?.description || '';
    const finalImg = dynamicData?.thumbnail || imgSrc || '';
    const finalAlt = imgAlt || `Image for ${finalTitle}`;
    const finalLinkHref = id ? `/courses/${id}` : (linkHref || '#');

    const price = dynamicData?.price;
    const originalPrice = dynamicData?.originalPrice;
    const discountPercentage = dynamicData?.discountPercentage;
    const hasDiscount = !!discountPercentage && discountPercentage > 0 && originalPrice && price && originalPrice > price;

    return (
        <article className="card card--elevated">
            <div className="card__image-wrap">
                <img src={finalImg} alt={finalAlt} className="card__image" />
                {dynamicData?.certificate && <span className="card__chip">Chứng chỉ</span>}
            </div>
            <div className="card__content">
                <div className="card__category text-accent">{finalCategory}</div>
                <h3 className="card__title">{finalTitle}</h3>
                {finalDesc?.trim() && <p className="card__desc text-muted">{finalDesc}</p>}

                {/* Meta row: rating, students, lessons, level */}
                <div className="card__meta-row">
                    {typeof dynamicData?.averageRating === 'number' && (
                        <span className="card__meta" title="Đánh giá">⭐ {dynamicData.averageRating.toFixed(1)}</span>
                    )}
                    {typeof dynamicData?.totalStudents === 'number' && (
                        <span className="card__meta" title="Học viên">👥 {dynamicData.totalStudents.toLocaleString('vi-VN')}</span>
                    )}
                    {typeof dynamicData?.totalLessons === 'number' && (
                        <span className="card__meta" title="Bài học">📚 {dynamicData.totalLessons}</span>
                    )}
                    {dynamicData?.level && (
                        <span className="card__meta" title="Cấp độ">🏷️ {dynamicData.level}</span>
                    )}
                </div>

                {dynamicData?.instructorName && (
                    <div className="card__instructor text-muted">👤 {dynamicData.instructorName}</div>
                )}
            </div>

            <div className="card__footer">
                {/* Price block */}
                {typeof price === 'number' && (
                    <div className="card__price">
                        <strong className="card__price-current">{formatCurrency(price)}</strong>
                        {hasDiscount && (
                            <>
                                <span className="card__price-original">{formatCurrency(originalPrice)}</span>
                                <span className="card__price-discount">-{discountPercentage}%</span>
                            </>
                        )}
                    </div>
                )}

                <div className="card__actions">
                    {btnText?.trim() && (
                        <button type="button" className="card__btn btn btn--primary">
                            {btnText}
                        </button>
                    )}
                    {(linkText?.trim() || id || linkHref) && (
                        <Link
                            to={finalLinkHref}
                            className="card__link btn btn--ghost"
                            aria-label={`Read more about ${finalTitle}`}
                        >
                            {linkText || 'Chi tiết →'}
                        </Link>
                    )}
                </div>

                {isLoading && <p className="card__state" aria-live="polite">Đang tải...</p>}
                {error && <p className="card__state" aria-live="polite">{error}</p>}
            </div>
        </article>
    );
};

export default Card;