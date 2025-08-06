
const Newsletter = () => {
    return (
        <section className="newsletter-section" aria-label="Newsletter subscription">
            <div className="newsletter-section__container">
                <div className="newsletter-section__left">
                    <h2 className="newsletter-section__title">Đăng ký nhận bản tin của chúng tôi!</h2>
                    <p className="newsletter-section__desc">
                        Hãy là người đầu tiên nhận thông tin về các sản phẩm mới, tin tức và góc nhìn trong ngành.
                    </p>
                </div>
                <form className="newsletter-section__form" action="#" method="post" noValidate>
                    <div className="newsletter-section__input-wrap">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="newsletter-section__input"
                            placeholder="Địa chỉ email của bạn"
                            required
                            aria-required="true"
                        />
                        <button type="submit" className="newsletter-section__button">
                            Đăng ký
                        </button>
                    </div>
                    <div className="newsletter-section__privacy">
                        Chúng tôi quan tâm đến dữ liệu của bạn theo <a href="#" className="newsletter-section__privacy-link">chính sách bảo mật</a> của chúng tôi
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;