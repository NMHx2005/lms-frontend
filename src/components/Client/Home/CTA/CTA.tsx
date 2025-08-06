
const CTA = () => {
    return (
        <section className="cta-section" aria-label="Call to action to join Phenikaa">
            <div className="cta-section__container">
                <div className="cta-section__content">
                    <div className="cta-section__left">
                        <h2 className="cta-section__title">Tham gia với Phenikaa ngay để nâng cao trình độ của bạn</h2>
                        <p className="cta-section__desc">Dùng thử 30 ngày miễn phí từ hôm nay.</p>
                        <div className="cta-section__actions">
                            <button type="button" className="cta-section__btn cta-section__btn--outline">
                                Tìm hiểu thêm
                            </button>
                            <button type="button" className="cta-section__btn cta-section__btn--white">
                                Đăng ký ngay
                            </button>
                        </div>
                    </div>
                    <div className="cta-section__right">
                        <img
                            src="./images/background.png"
                            alt="Group of young students in red uniform smiling and clapping hands"
                            className="cta-section__image"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTA;