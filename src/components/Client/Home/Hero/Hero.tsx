
const Hero = () => {
    return (
        <section className="hero" aria-label="Hero section with offline courses">
            <div className="hero__container">
                <div className="hero__left">
                    <h1 className="hero__title">Lớp học Online phù hợp nhất với bạn</h1>
                    <p className="hero__desc">
                        Lớp học Online giúp bạn học bài bản và được tương tác và hỗ trợ trực tiếp. Học tập tại trung tâm, bạn được trải nghiệm thực tế và học hỏi.
                    </p>
                    <button type="button" className="hero__btn-register">
                        Đăng ký ngay!
                    </button>
                    <div className="hero__dots" role="tablist" aria-label="Hero slider navigation">
                        <div className="hero__dot" role="tab" aria-selected="true" tabIndex={0}></div>
                        <div className="hero__dot hero__dot--inactive" role="tab" aria-selected="false" tabIndex={-1}></div>
                        <div className="hero__dot hero__dot--inactive" role="tab" aria-selected="false" tabIndex={-1}></div>
                    </div>
                </div>
                <div className="hero__right" aria-hidden="true">
                    <img
                        src="./images/banner.png"
                        alt="Young woman in red shirt holding notebooks and glasses, smiling"
               
                        className="hero__image"
                    />
                </div>
            </div>
        </section>
    );
};

export default Hero;