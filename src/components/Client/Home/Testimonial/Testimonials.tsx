import Testimonial from './Testimonial';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';

const testimonials = [
  {
    stars: 5,
    text: "Phenikaa cung cấp các khoá học thực sự hữu ích với bản thân mình. Mình tìm được rất nhiều kiến thức tại đây.",
    author: "Lena Nguyen",
    role: "UIUX Designer",
    avatar: './images/avatar2.png',
  },
  {
    stars: 5,
    text: "Phenikaa cho bạn khả năng kiên trì. Tôi đã học được chính xác những gì tôi cần biết trong thực tiễn. Những kiến thức và kỹ năng này đã giúp tôi tự phát triển bản thân và thăng tiến sự nghiệp.",
    author: "Vũ Ngọc Anh",
    role: "Product Manager",
      avatar: './images/avatar2.png',
  },
  {
    stars: 5,
    text: "Với Phenikaa, các nhân viên đã có thể kết hợp các kỹ năng mềm về công nghệ và tư vấn lại với nhau... để thúc đẩy sự nghiệp của họ phát triển.",
    author: "Đào Đức",
    role: "Android developer",
      avatar: './images/avatar2.png',
  },
  {
    stars: 5,
    text: "Tôi rất hài lòng với các khoá học tại Phenikaa. Đội ngũ giảng viên rất tận tâm và chuyên nghiệp.",
    author: "Nguyễn Văn A",
    role: "Backend Developer",
      avatar: './images/avatar2.png',
  },
    {
        stars: 5,
        text: "Phenikaa cung cấp các khoá học thực sự hữu ích với bản thân mình. Mình tìm được rất nhiều kiến thức tại đây.",
        author: "Lena Nguyen",
        role: "UIUX Designer",
        avatar: './images/avatar2.png',
    },
    {
        stars: 5,
        text: "Phenikaa cho bạn khả năng kiên trì. Tôi đã học được chính xác những gì tôi cần biết trong thực tiễn. Những kiến thức và kỹ năng này đã giúp tôi tự phát triển bản thân và thăng tiến sự nghiệp.",
        author: "Vũ Ngọc Anh",
        role: "Product Manager",
        avatar: './images/avatar2.png',
    },
    {
        stars: 5,
        text: "Với Phenikaa, các nhân viên đã có thể kết hợp các kỹ năng mềm về công nghệ và tư vấn lại với nhau... để thúc đẩy sự nghiệp của họ phát triển.",
        author: "Đào Đức",
        role: "Android developer",
        avatar: './images/avatar2.png',
    },
    {
        stars: 5,
        text: "Tôi rất hài lòng với các khoá học tại Phenikaa. Đội ngũ giảng viên rất tận tâm và chuyên nghiệp.",
        author: "Nguyễn Văn A",
        role: "Backend Developer",
        avatar: './images/avatar2.png',
    },
];

const Testimonials = () => {
  return (
    <section className="testimonials-section" aria-label="Testimonials from students">
      <div className="testimonials-section__header">
        <div className="testimonials-section__subheading">Testimonial</div>
        <h2 className="testimonials-section__title">
          Mọi người nói gì sau những trải nghiệm học tập với Phenikaa
        </h2>
      </div>
          <Swiper
                    modules={[Autoplay]}
              spaceBetween={24}
              slidesPerView={5}
              autoplay={{ delay: 1000, disableOnInteraction: false }}
              loop={true}
              grabCursor={true}
              breakpoints={{
                  900: { slidesPerView: 5 },
                  600: { slidesPerView: 1 }
              }}
              className="testimonials-section__slider"
          >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index}>
            <Testimonial {...testimonial} />
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Testimonials;

