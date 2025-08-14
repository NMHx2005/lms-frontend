
const Newsletter = () => {
  return (
    <section className="newsletter-section">
      <div className="newsletter-section__container">
        <div className="newsletter-section__content">
          {/* Heading and supporting text */}
          <div className="newsletter-section__text">
            <h2 className="newsletter-section__title">
              Đăng ký nhận bản tin của chúng tôi!
            </h2>
            <p className="newsletter-section__desc">
              Hãy là người đầu tiên nhận thông tin về các sản phẩm mới, tin tức, và các sự kiện trong ngành.
            </p>
          </div>
          
          {/* Email capture */}
          <div className="newsletter-section__form-container">
            <div className="newsletter-section__input-group">
              <div className="newsletter-section__input-wrapper">
                <div className="newsletter-section__input-content">
                  <div className="newsletter-section__input-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M2.5 5.83333L10 11.6667L17.5 5.83333" stroke="#666B85" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.5 5.83333C2.5 5.18695 2.5 4.86376 2.5 4.58333C2.5 3.71488 2.5 3.28066 2.5 2.91667C2.5 2.55267 2.5 2.11845 2.5 1.25C2.5 0.381544 2.5 0.381544 2.5 0.381544H17.5C17.5 0.381544 17.5 0.381544 17.5 1.25C17.5 2.11845 17.5 2.55267 17.5 2.91667C17.5 3.28066 17.5 3.71488 17.5 4.58333C17.5 5.18695 17.5 5.83333 17.5 5.83333L10 11.6667L2.5 5.83333Z" stroke="#666B85" strokeWidth="1.67" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <input 
                    type="email" 
                    className="newsletter-section__input" 
                    placeholder="Nhập email của bạn"
                  />
                  <div className="newsletter-section__help-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z" stroke="#98A2B3" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4C8.53043 4 9.03914 4.21071 9.41421 4.58579C9.78929 4.96086 10 5.46957 10 6C10 6.53043 9.78929 7.03914 9.41421 7.41421C9.03914 7.78929 8.53043 8 8 8C8 8 8 8 8 8" stroke="#98A2B3" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 12H8.01" stroke="#98A2B3" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="newsletter-section__hint">
                Chúng tôi sẽ gửi email cho bạn khi có tin tức mới
              </div>
            </div>
            
            <button className="newsletter-section__btn">
              Đăng ký
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;