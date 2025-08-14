import { useState } from 'react';
import './CourseFAQ.css';

interface CourseFAQProps {
  faqs: {
    id: number;
    question: string;
    answer: string;
  }[];
}

const CourseFAQ: React.FC<CourseFAQProps> = ({ faqs }) => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);

  const toggleFAQ = (id: number) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <section className="course-faq">
      <div className="course-faq__container">
        <div className="course-faq__header">
          <h2 className="course-faq__title">Câu hỏi thường gặp</h2>
          <p className="course-faq__description">
            Tìm hiểu thêm về khóa học và quy trình học tập
          </p>
        </div>

        <div className="course-faq__list">
          {faqs.map((faq) => (
            <div key={faq.id} className="course-faq__item">
              <button
                className="course-faq__question"
                onClick={() => toggleFAQ(faq.id)}
                aria-expanded={openFAQ === faq.id}
              >
                <span className="course-faq__question-text">{faq.question}</span>
                <svg
                  className={`course-faq__arrow ${openFAQ === faq.id ? 'expanded' : ''}`}
                  width="20"
                  height="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 9l-7 7-7-7"/>
                </svg>
              </button>
              
              {openFAQ === faq.id && (
                <div className="course-faq__answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="course-faq__cta">
          <p className="course-faq__cta-text">
            Vẫn còn thắc mắc? Hãy liên hệ với chúng tôi!
          </p>
          <button className="course-faq__contact-btn">
            Liên hệ hỗ trợ
          </button>
        </div>
      </div>
    </section>
  );
};

export default CourseFAQ;
