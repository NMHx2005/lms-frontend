import { useState } from "react";

const partners = [
  {
    src: "./images/codegym.png",
    alt: "CODEGYM logo in blue text on white background"
  },
  {
    src: "./images/funix.png",
    alt: "FUNiX logo in blue text on white background"
  },
  {
    src: "./images/apollo.png",
    alt: "AMERICAN ENGLISH logo in blue text on white background"
  },
  {
    src: "./images/aptech.png",
    alt: "Aptech logo in black text on white background"
  },
  {
    src: "./images/rikedu.png",
    alt: "Rikkei logo in red text on white background"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    alt: "Microsoft logo"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png",
    alt: "Logo TV"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    alt: "Google logo"
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
    alt: "Facebook logo"
  }
];

const SLIDE_SIZE = 5;

const Partners = () => {
  const [start, setStart] = useState(0);
  const end = start + SLIDE_SIZE;
  const canPrev = start > 0;
  const canNext = end < partners.length;

  const handlePrev = () => {
    if (canPrev) setStart(start - 1);
  };
  const handleNext = () => {
    if (canNext) setStart(start + 1);
  };

  return (
    <section className="partners-section" aria-label="Partner centers">
      <div className="partners-section__container">
        <h2 className="partners-section__title">Các trung tâm được liên kết</h2>
        <div className="partners-section__slider">
          <button
            aria-label="Previous partner logo"
            className="partners-section__arrow"
            type="button"
            onClick={handlePrev}
            disabled={!canPrev}
            style={{ opacity: canPrev ? 1 : 0.4, pointerEvents: canPrev ? 'auto' : 'none' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#656D7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
          {partners.slice(start, end).map((partner, index) => (
            <img
              key={start + index}
              src={partner.src}
              alt={partner.alt}
              className="partners-section__logo"
              role="listitem"
            />
          ))}
          <button
            aria-label="Next partner logo"
            className="partners-section__arrow"
            type="button"
            onClick={handleNext}
            disabled={!canNext}
            style={{ opacity: canNext ? 1 : 0.4, pointerEvents: canNext ? 'auto' : 'none' }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#656D7A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Partners;