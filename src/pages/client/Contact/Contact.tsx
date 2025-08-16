import React, { useState } from 'react';
import './Contact.css';
import Footer from '@/components/Layout/client/Footer';
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import Header from '@/components/Layout/client/Header';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'general' | 'support' | 'business' | 'feedback';
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const contactInfo = [
    {
      icon: '📍',
      title: 'Địa chỉ',
      content: '123 Đường ABC, Quận 1, TP.HCM, Việt Nam'
    },
    {
      icon: '📧',
      title: 'Email',
      content: 'contact@lmsplatform.com'
    },
    {
      icon: '📞',
      title: 'Điện thoại',
      content: '+84 28 1234 5678'
    },
    {
      icon: '⏰',
      title: 'Giờ làm việc',
      content: 'Thứ 2 - Thứ 6: 8:00 - 18:00'
    }
  ];

  const faqs = [
    {
      question: 'Làm thế nào để đăng ký khóa học?',
      answer: 'Bạn có thể đăng ký khóa học bằng cách tạo tài khoản, chọn khóa học mong muốn và thanh toán trực tuyến.'
    },
    {
      question: 'Tôi có thể học offline không?',
      answer: 'Hiện tại chúng tôi chỉ cung cấp các khóa học trực tuyến để đảm bảo tính linh hoạt và tiện lợi.'
    },
    {
      question: 'Làm thế nào để liên hệ với giảng viên?',
      answer: 'Bạn có thể liên hệ với giảng viên thông qua hệ thống nhắn tin nội bộ hoặc để lại comment trong khóa học.'
    },
    {
      question: 'Tôi có thể hoàn tiền nếu không hài lòng không?',
      answer: 'Có, chúng tôi có chính sách hoàn tiền trong vòng 30 ngày nếu bạn không hài lòng với khóa học.'
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 2000);
  };

  if (submitted) {
    return (
      <div className="contact-page">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h1>Gửi tin nhắn thành công!</h1>
          <p>Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="send-another-btn"
          >
            Gửi tin nhắn khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <TopBar />
    <Header />
      <div className="contact-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1>Liên hệ với chúng tôi</h1>
            <p>Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn. Hãy để lại tin nhắn và chúng tôi sẽ phản hồi sớm nhất có thể.</p>
          </div>
        </section>

        <div className="contact-content">
          <div className="container">
            <div className="contact-grid">
              {/* Contact Form */}
              <div className="contact-form-section">
                <h2>Gửi tin nhắn</h2>
                <form onSubmit={handleSubmit} className="contact-form" autoComplete='off'>
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="name">Họ và tên *</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập họ và tên của bạn"
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập email của bạn"
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="type">Loại tin nhắn *</label>
                      <select
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="general">Tin nhắn chung</option>
                        <option value="support">Hỗ trợ kỹ thuật</option>
                        <option value="business">Hợp tác kinh doanh</option>
                        <option value="feedback">Góp ý phản hồi</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="subject">Tiêu đề *</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Nhập tiêu đề tin nhắn"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Nội dung tin nhắn *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      placeholder="Nhập nội dung tin nhắn của bạn..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Đang gửi...' : 'Gửi tin nhắn'}
                  </button>
                </form>
              </div>

              {/* Contact Information */}
              <div className="contact-info-section">
                <h2>Thông tin liên hệ</h2>
                <div className="contact-info-list">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="contact-info-item">
                      <div className="info-icon">{info.icon}</div>
                      <div className="info-content">
                        <h3>{info.title}</h3>
                        <p>{info.content}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="social-links">
                  <h3>Theo dõi chúng tôi</h3>
                  <div className="social-icons">
                    <a href="#" className="social-icon facebook">📘</a>
                    <a href="#" className="social-icon twitter">🐦</a>
                    <a href="#" className="social-icon linkedin">💼</a>
                    <a href="#" className="social-icon youtube">📺</a>
                    <a href="#" className="social-icon instagram">📷</a>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <section className="faq-section">
              <h2>Câu hỏi thường gặp</h2>
              <div className="faq-list">
                {faqs.map((faq, index) => (
                  <div key={index} className="faq-item">
                    <h3 className="faq-question">{faq.question}</h3>
                    <p className="faq-answer">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Map Section */}
            <section className="map-section">
              <h2>Vị trí của chúng tôi</h2>
              <div className="map-container">
                <div className="map-placeholder">
                  <div className="map-icon">🗺️</div>
                  <p>Bản đồ sẽ được hiển thị tại đây</p>
                  <p className="map-address">
                    <strong>Địa chỉ:</strong> 123 Đường ABC, Quận 1, TP.HCM, Việt Nam
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
