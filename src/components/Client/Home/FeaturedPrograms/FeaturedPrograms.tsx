import Card from "../Card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const FeaturedPrograms = () => {
    const programs = [
        {
            id: '1',
            category: "Kỹ năng",
            title: "Đào tạo lập trình viên quốc tế",
            desc: "Học để trở thành chuyên gia công nghệ với các khóa học quốc tế chuẩn quốc tế.",
            imgSrc: "https://storage.googleapis.com/a1aa/image/511cdf80-9e0b-4b53-1a80-941d6c952f79.jpg",
            imgAlt: "Two people working on computers in office environment",
            btnText: "Đăng ký",
            linkText: "Chi tiết →",
            linkHref: "#",
        },
        {
            id: '2',
            category: "Career & Academic",
            title: "Đào tạo kỹ sư IT làm kế toán doanh nghiệp",
            desc: "Lập kế hoạch, quản lý và vận hành hệ thống kế toán doanh nghiệp.",
            imgSrc: "https://storage.googleapis.com/a1aa/image/290a80f1-a263-4cd3-dcf8-e6ec6b6b50c9.jpg",
            imgAlt: "Woman talking to man in office meeting",
            btnText: "Đăng ký",
            linkText: "Chi tiết →",
            linkHref: "#",
        },
        {
            id: '3',
            category: "Career & Academic",
            title: "Những kiến thức cơ bản để hiểu về AI",
            desc: "Làm thế nào để hiểu và áp dụng AI trong các ngành nghề khác nhau.",
            imgSrc: "https://storage.googleapis.com/a1aa/image/f9dbcea8-f19d-4f64-2aac-72bed0506370.jpg",
            imgAlt: "Group of people in meeting room discussing",
            btnText: "Đăng ký",
            linkText: "Chi tiết →",
            linkHref: "#",
        },
        {
            id: '4',
            category: "Kỹ năng",
            title: "Đào tạo lập trình viên quốc tế",
            desc: "Học để trở thành chuyên gia công nghệ với các khóa học quốc tế chuẩn quốc tế.",
            imgSrc: "https://storage.googleapis.com/a1aa/image/511cdf80-9e0b-4b53-1a80-941d6c952f79.jpg",
            imgAlt: "Two people working on computers in office environment",
            btnText: "Đăng ký",
            linkText: "Chi tiết →",
            linkHref: "#",
        },
        {
            id: '5',
            category: "Career & Academic",
            title: "Đào tạo kỹ sư IT làm kế toán doanh nghiệp",
            desc: "Lập kế hoạch, quản lý và vận hành hệ thống kế toán doanh nghiệp.",
            imgSrc: "https://storage.googleapis.com/a1aa/image/290a80f1-a263-4cd3-dcf8-e6ec6b6b50c9.jpg",
            imgAlt: "Woman talking to man in office meeting",
            btnText: "Đăng ký",
            linkText: "Chi tiết →",
            linkHref: "#",
        },
        {
            id: '6',
            category: "Career & Academic",
            title: "Những kiến thức cơ bản để hiểu về AI",
            desc: "Làm thế nào để hiểu và áp dụng AI trong các ngành nghề khác nhau.",
            imgSrc: "https://storage.googleapis.com/a1aa/image/f9dbcea8-f19d-4f64-2aac-72bed0506370.jpg",
            imgAlt: "Group of people in meeting room discussing",
            btnText: "Đăng ký",
            linkText: "Chi tiết →",
            linkHref: "#",
        },
    ];

    return (
        <section className="section" aria-label="Featured programs"> 
            <div className="section__header">
                <div>
                    <h2 className="section__title">Khóa Học Nổi Bật</h2>
                    <p className="section__subtitle">Rất nhiều các khóa học từ nhiều lĩnh vực với nhiều các trung tâm uy tín.</p>
                </div>
                <button type="button" className="section__btn">
                    Xem thêm
                </button>
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
                    {programs.map((program, index) => (
                        <SwiperSlide key={index}>
                            <Card {...program} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default FeaturedPrograms;