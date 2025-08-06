import { useState } from "react";

const features = [
  {
    icon: (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="48" height="48" rx="24" fill="#FFD1C0" />
              <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FFF1EB" stroke-width="8" />
              <path d="M24.21 29.89L23 39L28 36L33 39L31.79 29.88M35 24C35 27.866 31.866 31 28 31C24.134 31 21 27.866 21 24C21 20.134 24.134 17 28 17C31.866 17 35 20.134 35 24Z" stroke="#B54115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
    ),
    title: "Luyện thi chứng chỉ quốc tế",
    desc: "Luyện thi các chứng chỉ quốc tế trong ngành lập trình giúp bạn có cơ hội phát triển nghề nghiệp tốt hơn và học tập trong môi trường chuyên nghiệp.",
    button: "Xem thêm",
    link: "#"
  },
  {
    icon: (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="48" height="48" rx="24" fill="#FFD1C0" />
              <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FFF1EB" stroke-width="8" />
              <path d="M24.21 29.89L23 39L28 36L33 39L31.79 29.88M35 24C35 27.866 31.866 31 28 31C24.134 31 21 27.866 21 24C21 20.134 24.134 17 28 17C31.866 17 35 20.134 35 24Z" stroke="#B54115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
    ),
    title: "Đào tạo thực hành",
    desc: "Chương trình đào tạo thực hành giúp bạn có kỹ năng làm việc thực tế và áp dụng kiến thức vào dự án thực tế.",
    button: "Xem thêm",
    link: "#"
  },
  {
    icon: (
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="48" height="48" rx="24" fill="#FFD1C0" />
              <rect x="4" y="4" width="48" height="48" rx="24" stroke="#FFF1EB" stroke-width="8" />
              <path d="M28 23C28 21.9391 27.5786 20.9217 26.8284 20.1716C26.0783 19.4214 25.0609 19 24 19H18V34H25C25.7956 34 26.5587 34.3161 27.1213 34.8787C27.6839 35.4413 28 36.2044 28 37M28 23V37M28 23C28 21.9391 28.4214 20.9217 29.1716 20.1716C29.9217 19.4214 30.9391 19 32 19H38V34H31C30.2044 34 29.4413 34.3161 28.8787 34.8787C28.3161 35.4413 28 36.2044 28 37" stroke="#B54115" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
    ),
    title: "Khoa học phân tích dữ liệu",
    desc: "Học và làm việc với các công cụ phân tích dữ liệu để nâng cao kỹ năng và phát triển sự nghiệp.",
    button: "Xem thêm",
    link: "#"
  }
];

const FeaturedLearning = () => {
  const [active, setActive] = useState(0);

  return (
    <section className="featured-learning-section" aria-label="Features section">
        <div className="featured-learning-section__container">
            <div className="featured-learning-section__left">
            <div className="featured-learning-section__subheading">Nổi bật</div>
            <h2 className="featured-learning-section__heading">Chương trình học tập hướng tới mục tiêu của bạn</h2>
            <p className="featured-learning-section__desc">
                Rất nhiều phương pháp học tập được áp dụng để bạn đạt được mục tiêu kiến thức trong thời gian ngắn nhất.
            </p>
                  <div className="eatured-learning-section-content">
                      <div className="featured-learning-section__tabs">
                          {features.map((item, idx) => (
                              <div
                                  key={idx}
                                  className={`featured-learning-section__tab${active === idx ? " active" : ""}`}
                                  onClick={() => setActive(idx)}
                                  tabIndex={0}
                                  role="button"
                                  aria-pressed={active === idx}
                              >
                                  <div className="featured-learning-section__tab-icon">{item.icon}</div>
                                  <div className="featured-learning-section__tab-content">
                                      <div className="featured-learning-section__tab-title">{item.title}</div>
                                      <div className="featured-learning-section__tab-desc">{item.desc}</div>
                                      <a href={item.link} className="featured-learning-section__tab-btn">
                                          {item.button}
                                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M7 5l5 5-5 5" stroke="#B54115" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                      </a>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <div className="featured-learning-section__right">
                          <img
                              src="./images/Content.png"
                              alt="People writing notes and working with laptop and color pens on table"
                              className="featured-learning-section__image"
                            //   width="520"
                            //   height="360"
                          />
                      </div>
                  </div>
            </div>
            
        </div>
    </section>
  );
};

export default FeaturedLearning;