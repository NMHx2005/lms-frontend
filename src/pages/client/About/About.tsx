import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';
import Footer from '@/components/Layout/client/Footer';
import TopBar from '@/components/Client/Home/TopBar/TopBar';
import Header from '@/components/Layout/client/Header';

const About: React.FC = () => {
  const stats = [
    { number: '50,000+', label: 'Học viên' },
    { number: '500+', label: 'Khóa học' },
    { number: '100+', label: 'Giảng viên' },
    { number: '95%', label: 'Hài lòng' }
  ];

  const features = [
    {
      icon: '🎯',
      title: 'Học tập có mục tiêu',
      description: 'Mỗi khóa học được thiết kế với mục tiêu rõ ràng, giúp bạn đạt được kết quả cụ thể'
    },
    {
      icon: '🚀',
      title: 'Tiến độ nhanh chóng',
      description: 'Phương pháp học tập hiệu quả giúp bạn tiến bộ nhanh chóng trong thời gian ngắn'
    },
    {
      icon: '💡',
      title: 'Kiến thức thực tế',
      description: 'Nội dung được cập nhật liên tục theo xu hướng công nghệ và nhu cầu thị trường'
    },
    {
      icon: '🤝',
      title: 'Hỗ trợ 24/7',
      description: 'Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc, mọi nơi'
    }
  ];

  const team = [
    {
      name: 'Hieu Doan',
      position: 'CEO & Founder',
      avatar: '/images/team1.jpg',
      bio: 'Full-stack developer với 8+ năm kinh nghiệm, đam mê giáo dục và công nghệ'
    },
    {
      name: 'Minh Nguyen',
      position: 'CTO',
      avatar: '/images/team2.jpg',
      bio: 'Chuyên gia về AI và Machine Learning, có kinh nghiệm tại các công ty công nghệ hàng đầu'
    },
    {
      name: 'Lan Tran',
      position: 'Head of Design',
      avatar: '/images/team3.jpg',
      bio: 'UI/UX Designer với 6+ năm kinh nghiệm, tạo ra những trải nghiệm người dùng tuyệt vời'
    },
    {
      name: 'Nam Le',
      position: 'Head of Content',
      avatar: '/images/team4.jpg',
      bio: 'Chuyên gia về nội dung giáo dục, có kinh nghiệm giảng dạy tại các trường đại học'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Thành lập',
      description: 'Platform được thành lập với mục tiêu mang giáo dục chất lượng đến mọi người'
    },
    {
      year: '2021',
      title: '1000 học viên đầu tiên',
      description: 'Đạt được cột mốc 1000 học viên và mở rộng danh mục khóa học'
    },
    {
      year: '2022',
      title: 'Ra mắt mobile app',
      description: 'Phát triển ứng dụng di động để học viên có thể học mọi lúc, mọi nơi'
    },
    {
      year: '2023',
      title: '50,000+ học viên',
      description: 'Trở thành một trong những platform giáo dục trực tuyến hàng đầu Việt Nam'
    },
    {
      year: '2024',
      title: 'AI-powered learning',
      description: 'Tích hợp AI để cá nhân hóa trải nghiệm học tập cho từng học viên'
    }
  ];

  return (
    <>
    <TopBar />
    <Header />
    <div className="about-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Về chúng tôi</h1>
          <p>Chúng tôi tin rằng giáo dục chất lượng cao nên được tiếp cận bởi tất cả mọi người, bất kể họ ở đâu trên thế giới.</p>
          <div className="hero-stats">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item">
                <span className="stat-number">{stat.number}</span>
                <span className="stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Sứ mệnh của chúng tôi</h2>
              <p>Chúng tôi cam kết mang đến những khóa học chất lượng cao, được thiết kế bởi các chuyên gia hàng đầu trong lĩnh vực của họ. Mục tiêu của chúng tôi là giúp mọi người phát triển kỹ năng cần thiết để thành công trong thế giới công nghệ đang thay đổi nhanh chóng.</p>
              <p>Chúng tôi tin rằng học tập không chỉ là việc tiếp thu kiến thức, mà còn là việc áp dụng kiến thức đó vào thực tế để tạo ra giá trị cho bản thân và xã hội.</p>
            </div>
            <div className="mission-image">
              <img src="/images/mission.jpg" alt="Sứ mệnh của chúng tôi" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2>Tại sao chọn chúng tôi?</h2>
          <div className="features-grid">
            {features.map((feature, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container">
          <h2>Đội ngũ của chúng tôi</h2>
          <p className="team-intro">Gặp gỡ những người đam mê và tài năng đang xây dựng tương lai của giáo dục</p>
          <div className="team-grid">
            {team.map((member, index) => (
              <div key={index} className="team-member">
                <div className="member-avatar">
                  <img src={member.avatar} alt={member.name} />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="position">{member.position}</p>
                  <p className="bio">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="milestones-section">
        <div className="container">
          <h2>Hành trình phát triển</h2>
          <div className="timeline">
            {milestones.map((milestone, index) => (
              <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-content">
                  <div className="timeline-year">{milestone.year}</div>
                  <h3>{milestone.title}</h3>
                  <p>{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="values-section">
        <div className="container">
          <h2>Giá trị cốt lõi</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">🎓</div>
              <h3>Chất lượng</h3>
              <p>Chúng tôi cam kết mang đến những khóa học chất lượng cao nhất, được kiểm duyệt nghiêm ngặt</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🤝</div>
              <h3>Hợp tác</h3>
              <p>Chúng tôi tin vào sức mạnh của cộng đồng và sự hợp tác để tạo ra giá trị lớn hơn</p>
            </div>
            <div className="value-card">
              <div className="value-icon">💡</div>
              <h3>Đổi mới</h3>
              <p>Chúng tôi không ngừng đổi mới và cải tiến để mang đến trải nghiệm học tập tốt nhất</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>Toàn cầu</h3>
              <p>Chúng tôi kết nối mọi người từ khắp nơi trên thế giới thông qua giáo dục</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Sẵn sàng bắt đầu hành trình học tập?</h2>
            <p>Tham gia cùng hàng nghìn học viên khác và khám phá tiềm năng của bạn</p>
            <div className="cta-buttons">
              <Link to="/courses" className="cta-btn primary">
                Khám phá khóa học
              </Link>
              <Link to="/contact" className="cta-btn secondary">
                Liên hệ với chúng tôi
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default About;
