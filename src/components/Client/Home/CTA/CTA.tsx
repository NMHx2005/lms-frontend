
const CTA = () => {
  return (
    <section className="cta-section">
      <div className="cta-section__container">
        <div className="cta-section__content">
          {/* Content */}
          <div className="cta-section__text-content">
            <div className="cta-section__text-group">
              <h2 className="cta-section__title">
                Sẵn sàng để bắt đầu hành trình học tập của bạn?
              </h2>
              <p className="cta-section__desc">
                Khám phá các khóa học chất lượng cao và phát triển kỹ năng của bạn ngay hôm nay
              </p>
            </div>
            
            <div className="cta-section__actions">
              <button className="cta-section__btn cta-section__btn--secondary">
                Tìm hiểu thêm
              </button>
              <button className="cta-section__btn cta-section__btn--primary">
                Đăng ký ngay
              </button>
            </div>
          </div>
          
          {/* Image */}
          <div className="cta-section__image">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80" 
              alt="Students learning together"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;