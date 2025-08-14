
const FeaturedLearning = () => {
  return (
    <section className="featured-learning">
      <div className="featured-learning__container">
        {/* Header Content */}
        <div className="featured-learning__header">
          <div className="featured-learning__text-group">
            <div className="featured-learning__subheading">
              Tính năng nổi bật
            </div>
            <h2 className="featured-learning__title">
              Học tập thông minh với công nghệ tiên tiến
            </h2>
            <p className="featured-learning__desc">
              Khám phá các tính năng độc đáo giúp việc học tập trở nên hiệu quả và thú vị hơn bao giờ hết
            </p>
          </div>
        </div>
        
        {/* Features Content */}
        <div className="featured-learning__content">
          {/* Left side - Features */}
          <div className="featured-learning__features">
            {/* Feature 1 - Award */}
            <div className="featured-learning__feature">
              <div className="featured-learning__feature-icon">
                <div className="featured-learning__icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#B54115" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="featured-learning__feature-content">
                <div className="featured-learning__feature-text">
                  <h3 className="featured-learning__feature-title">
                    Chứng chỉ được công nhận
                  </h3>
                  <p className="featured-learning__feature-desc">
                    Nhận chứng chỉ được công nhận quốc tế sau khi hoàn thành khóa học, giúp nâng cao giá trị CV của bạn
                  </p>
                </div>
                <button className="featured-learning__feature-btn">
                  Tìm hiểu thêm
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333" stroke="#B54115" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="featured-learning__feature-line"></div>
            </div>
            
            {/* Feature 2 - Book */}
            <div className="featured-learning__feature">
              <div className="featured-learning__feature-icon">
                <div className="featured-learning__icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 19.9391 11.5786 18.9217 10.8284 18.1716C10.0783 17.4214 9.06087 17 8 17H2V3Z" stroke="#B54115" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 19.9391 12.4214 18.9217 13.1716 18.1716C13.9217 17.4214 14.9391 17 16 17H22V3Z" stroke="#B54115" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="featured-learning__feature-content">
                <div className="featured-learning__feature-text">
                  <h3 className="featured-learning__feature-title">
                    Nội dung đa dạng
                  </h3>
                  <p className="featured-learning__feature-desc">
                    Hàng nghìn khóa học từ các chuyên gia hàng đầu trong mọi lĩnh vực
                  </p>
                </div>
                <button className="featured-learning__feature-btn">
                  Tìm hiểu thêm
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333" stroke="#B54115" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="featured-learning__feature-line"></div>
            </div>
            
            {/* Feature 3 - Chart */}
            <div className="featured-learning__feature">
              <div className="featured-learning__feature-icon">
                <div className="featured-learning__icon-wrapper">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M18 20V10M12 20V4M6 20V14" stroke="#712000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
              <div className="featured-learning__feature-content">
                <div className="featured-learning__feature-text">
                  <h3 className="featured-learning__feature-title">
                    Theo dõi tiến độ
                  </h3>
                  <p className="featured-learning__feature-desc">
                    Hệ thống theo dõi tiến độ học tập chi tiết giúp bạn đánh giá hiệu quả học tập
                  </p>
                </div>
                <button className="featured-learning__feature-btn">
                  Tìm hiểu thêm
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M4.16667 10H15.8333M15.8333 10L10 4.16667M15.8333 10L10 15.8333" stroke="#B54115" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
              <div className="featured-learning__feature-line"></div>
            </div>
          </div>
          
          {/* Right side - Image */}
          <div className="featured-learning__image">
            <img 
              src="/images/Content.png" 
              alt="Students learning with technology"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedLearning;