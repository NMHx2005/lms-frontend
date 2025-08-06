interface TestimonialProps {
  stars: number;
  text: string;
  author: string;
  role: string;
  avatar: string;
}
const Testimonial = ({ stars, text, author, role, avatar }: TestimonialProps) => {
  return (
    <article className="testimonial-card" role="listitem">
      <div className="testimonial-card__avatar-wrap">
        <img src={avatar} alt={author} className="testimonial-card__avatar" />
      </div>
      <div className="testimonial-card__stars">
        {[...Array(stars)].map((_, index) => (
          <svg key={index} width="28" height="28" viewBox="0 0 28 28" fill="none"><polygon points="14,2 17.09,9.26 25,10.27 19,15.14 20.18,22.02 14,18.77 7.82,22.02 9,15.14 3,10.27 10.91,9.26" fill="#F79708"/></svg>
        ))}
      </div>
      <div className="testimonial-card__text">{text}</div>
      <div className="testimonial-card__footer">
        <div>
          <div className="testimonial-card__author">{author}</div>
          <div className="testimonial-card__role">{role}</div>
        </div>
        <div className="testimonial-card__quote">
          <svg width="28" height="19" viewBox="0 0 28 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.3684 19.0001C4.49107 19.0001 3.06173 18.4668 2.0804 17.4001C1.09907 16.2908 0.608398 14.9681 0.608398 13.4321V12.4721C0.608398 11.2775 0.779065 10.1255 1.1204 9.01612C1.5044 7.86412 1.99507 6.75478 2.5924 5.68812C3.2324 4.62145 3.9364 3.61878 4.7044 2.68012C5.4724 1.74145 6.26173 0.888117 7.0724 0.120117H12.8964C11.2751 1.44278 9.99507 2.74412 9.0564 4.02412C8.11773 5.26145 7.41373 6.62678 6.9444 8.12012H7.0724C8.43773 8.12012 9.61106 8.56812 10.5924 9.46412C11.6164 10.3601 12.1284 11.5975 12.1284 13.1761V13.4321C12.1284 14.9681 11.6377 16.2908 10.6564 17.4001C9.67507 18.4668 8.24573 19.0001 6.3684 19.0001ZM21.4724 19.0001C19.5951 19.0001 18.1657 18.4668 17.1844 17.4001C16.2031 16.2908 15.7124 14.9681 15.7124 13.4321V12.4721C15.7124 11.2775 15.8831 10.1255 16.2244 9.01612C16.6084 7.86412 17.0991 6.75478 17.6964 5.68812C18.3364 4.62145 19.0404 3.61878 19.8084 2.68012C20.5764 1.74145 21.3657 0.888117 22.1764 0.120117H28.0004C26.3791 1.44278 25.0991 2.74412 24.1604 4.02412C23.2217 5.26145 22.5177 6.62678 22.0484 8.12012H22.1764C23.5417 8.12012 24.7151 8.56812 25.6964 9.46412C26.7204 10.3601 27.2324 11.5975 27.2324 13.1761V13.4321C27.2324 14.9681 26.7417 16.2908 25.7604 17.4001C24.7791 18.4668 23.3497 19.0001 21.4724 19.0001Z" fill="#1D2939" />
          </svg>
        </div>
      </div>
    </article>
  );
};

export default Testimonial;