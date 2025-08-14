import Card from "../Card/Card";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const Courses = () => {
    const courses = [
        {
            category: "Khoa học máy tính",
            title: "Đào tạo lập trình viên quốc tế",
            desc: "Học để trở thành chuyên gia công nghệ với các khóa học quốc tế chuẩn quốc tế.",
            imgSrc: "https://storage.googleapis.com/a1aa/image/2acdcf6b-7987-4e03-25b9-3a37878e436d.jpg",
            imgAlt: "Person working on laptop in office",
            btnText: "Offline",
            linkText: "Chi tiết →",
            linkHref: "#",
        },
        {
            category: "Khoa học máy tính",
            title: "Đào tạo lập trình viên quốc tế",
            desc: "Chương trình đào tạo lập trình viên chuyên nghiệp với giáo trình quốc tế.",
            imgSrc: "https://storage.googleapis.com/a1aa/image/9e55681f-7af2-45da-31a6-d5f109a91ca6.jpg",
            imgAlt: "Group of students in classroom",
            btnText: "Offline",
            linkText: "Chi tiết →",
            linkHref: "#",
        },
        {
            category: "Data Science",
            title: "Những kiến thức cơ bản để hiểu về AI",
            desc: "Làm thế nào để hiểu và áp dụng AI trong các ngành nghề khác nhau.",
            imgSrc: "https://storage.googleapis.com/a1aa/image/9bfd7db9-44e6-4720-9a72-3bf6d26f126d.jpg",
            imgAlt: "Man working with data on computer",
            btnText: "Xem thử",
            linkText: "Chi tiết →",
            linkHref: "#",
        },
        {
            category: "Business & Accounting",
            title: "Đào tạo kỹ sư IT làm kế toán doanh nghiệp",
            desc: "Lập kế hoạch, quản lý và vận hành hệ thống kế toán doanh nghiệp.",
            imgSrc: "https://storage.googleapis.com/a1aa/image/0820ec3b-33e6-468b-cc54-d7317c4a00fd.jpg",
            imgAlt: "People in meeting room discussing",
            btnText: "Offline",
            linkText: "Chi tiết →",
            linkHref: "#",
        },
{
        category: "Khoa học máy tính",
        title: "Đào tạo lập trình viên quốc tế",
        desc: "Học để trở thành chuyên gia công nghệ với các khóa học quốc tế chuẩn quốc tế.",
        imgSrc: "https://storage.googleapis.com/a1aa/image/2acdcf6b-7987-4e03-25b9-3a37878e436d.jpg",
        imgAlt: "Person working on laptop in office",
        btnText: "Offline",
        linkText: "Chi tiết →",
        linkHref: "#",
        },
    {
        category: "Khoa học máy tính",
        title: "Đào tạo lập trình viên quốc tế",
        desc: "Chương trình đào tạo lập trình viên chuyên nghiệp với giáo trình quốc tế.",
        imgSrc: "https://storage.googleapis.com/a1aa/image/9e55681f-7af2-45da-31a6-d5f109a91ca6.jpg",
        imgAlt: "Group of students in classroom",
        btnText: "Offline",
        linkText: "Chi tiết →",
        linkHref: "#",
    },
    {
        category: "Data Science",
        title: "Những kiến thức cơ bản để hiểu về AI",
        desc: "Làm thế nào để hiểu và áp dụng AI trong các ngành nghề khác nhau.",
        imgSrc: "https://storage.googleapis.com/a1aa/image/9bfd7db9-44e6-4720-9a72-3bf6d26f126d.jpg",
        imgAlt: "Man working with data on computer",
        btnText: "Xem thử",
        linkText: "Chi tiết →",
        linkHref: "#",
    },
    {
        category: "Business & Accounting",
        title: "Đào tạo kỹ sư IT làm kế toán doanh nghiệp",
        desc: "Lập kế hoạch, quản lý và vận hành hệ thống kế toán doanh nghiệp.",
        imgSrc: "https://storage.googleapis.com/a1aa/image/0820ec3b-33e6-468b-cc54-d7317c4a00fd.jpg",
        imgAlt: "People in meeting room discussing",
        btnText: "Offline",
        linkText: "Chi tiết →",
        linkHref: "#",
    }
    ];

    return (
        <section className="section" aria-label="Courses">
            <div className="section__header">
                <div>
                    <h2 className="section__title">Lớp học</h2>
                    <p className="section__subtitle">Rất nhiều các khóa học từ nhiều lĩnh vực với nhiều các trung tâm uy tín.</p>
                </div>
                <button type="button" className="section__btn">
                    Xem
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
                    {courses.map((course, index) => (
                        <SwiperSlide key={index}>
                            <Card {...course} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default Courses;