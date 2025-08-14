import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const partners = [
  { src: "./images/codegym.png", alt: "CODEGYM logo in blue text on white background" },
  { src: "./images/funix.png", alt: "FUNiX logo in blue text on white background" },
  { src: "./images/apollo.png", alt: "AMERICAN ENGLISH logo in blue text on white background" },
  { src: "./images/aptech.png", alt: "Aptech logo in black text on white background" },
  { src: "./images/rikedu.png", alt: "Rikkei logo in red text on white background" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg", alt: "Microsoft logo" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png", alt: "Logo TV" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg", alt: "Google logo" },
  { src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg", alt: "Facebook logo" }
];

const Partners = () => {
  return (
    <section className="partners-section" aria-label="Partner centers">
      <div className="partners-section__container">
        <h2 className="partners-section__title">Các trung tâm được liên kết</h2>
        <div className="partners-section__slider">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={24}
            slidesPerView={2}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            loop={true}
            grabCursor={true}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 12 },
              480: { slidesPerView: 3, spaceBetween: 16 },
              768: { slidesPerView: 4, spaceBetween: 24 },
              1024: { slidesPerView: 5, spaceBetween: 32 }
            }}
          >
            {partners.map((partner, index) => (
              <SwiperSlide key={index}>
                <img src={partner.src} alt={partner.alt} className="partners-section__logo" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Partners;