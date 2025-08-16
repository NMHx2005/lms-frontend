import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import "./style.css";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="header" role="banner">
      <div className="header__container">
        {/* Left */}
        <div className="header__left">
          {/* Logo */}
          <Link to="/" className="header__logo" aria-label="Logo" onClick={closeMobileMenu}>
            <img src="/images/logo.png" alt="Logo" width={142} height={32} />
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="header__nav-left">
            {/* <div className="header__nav-item nav-menu active">Trang chủ</div> */}
            {/* <div className="header__nav-item nav-menu">Khóa học</div> */}
            {/* <div className="header__nav-item nav-menu">Chương trình</div> */}
          </nav>
          
          {/* Desktop Search */}
          <div className="header__search">
            <div className="header__search-box">
              <span className="header__search-icon">
                <svg width="20" height="20" fill="none" stroke="#656D7A" strokeWidth="1.7" viewBox="0 0 20 20">
                  <circle cx="9" cy="9" r="7"/>
                  <path d="M15.5 15.5L13 13"/>
                </svg>
              </span>
              <input 
                type="text" 
                className="header__search-input" 
                placeholder="Tìm kiếm khóa học, nội dung..." 
              />
              <span className="header__search-help">
                <svg width="16" height="16" fill="none" stroke="#98A2B3" strokeWidth="1.3" viewBox="0 0 16 16">
                  <circle cx="8" cy="8" r="6.5"/>
                  <path d="M8 11v-1m0-4a1.5 1.5 0 0 1 1.5 1.5c0 .828-.672 1.5-1.5 1.5S6.5 8.328 6.5 7.5"/>
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="header__right">
          {/* Desktop Navigation */}
          <nav className="header__nav-right">
            <NavLink to="/" className={({isActive}) => `header__nav-item nav-menu${isActive ? ' active' : ''}`}>
              Trang chủ
            </NavLink>
            <NavLink to="/courses" className={({isActive}) => `header__nav-item nav-menu${isActive ? ' active' : ''}`}>
              Khóa Học
            </NavLink>
            <NavLink to="/contact" className={({isActive}) => `header__nav-item nav-menu${isActive ? ' active' : ''}`}>
              Liên Hệ
            </NavLink>
            <NavLink to="/about" className={({isActive}) => `header__nav-item nav-menu${isActive ? ' active' : ''}`}>
              Về chúng tôi
            </NavLink>
          </nav>

          {/* Desktop Buttons */}
          <div className="header__buttons">
            <Link to="/login" className="header__btn-login btn btn--outline-orange">
              Đăng nhập
            </Link>
            <Link to="/register" className="header__btn-register btn btn--orange">
              Đăng ký
            </Link>
          </div>

          {/* Language Switcher */}
          <div className="header__lang">
            <svg width="24" height="24" fill="none" stroke="#101846" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"/>
              <path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/>
            </svg>
            <div className="header__lang-menu">
              <div className="header__lang-item">
                <span className="mr-2">🇻🇳</span> Tiếng Việt
              </div>
              <div className="header__lang-item">
                <span className="mr-2">🇬🇧</span> English
              </div>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="header__mobile-menu-btn" 
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
            aria-expanded={isMobileMenuOpen}
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`header__mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="header__mobile-menu-content">
          {/* Mobile Search */}
          <div className="header__mobile-search">
            <div className="header__search-box">
              <span className="header__search-icon">
                <svg width="20" height="20" fill="none" stroke="#656D7A" strokeWidth="1.7" viewBox="0 0 20 20">
                  <circle cx="9" cy="9" r="7"/>
                  <path d="M15.5 15.5L13 13"/>
                </svg>
              </span>
              <input 
                type="text" 
                className="header__search-input" 
                placeholder="Tìm kiếm khóa học, nội dung..." 
              />
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="header__mobile-nav">
            <NavLink to="/" className={({isActive}) => `header__mobile-nav-item${isActive ? ' active' : ''}`} onClick={closeMobileMenu}>
              Trang chủ
            </NavLink>
            <NavLink to="/courses" className={({isActive}) => `header__mobile-nav-item${isActive ? ' active' : ''}`} onClick={closeMobileMenu}>
              Khóa Học
            </NavLink>
            <NavLink to="/contact" className={({isActive}) => `header__mobile-nav-item${isActive ? ' active' : ''}`} onClick={closeMobileMenu}>
              Liên Hệ
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `header__mobile-nav-item${isActive ? ' active' : ''}`} onClick={closeMobileMenu}>
              Về chúng tôi
            </NavLink>
          </nav>

          {/* Mobile Buttons */}
          <div className="header__mobile-buttons">
            <Link to="/login" className="header__mobile-btn-login btn btn--outline-orange">
              Đăng nhập
            </Link>
            <Link to="/register" className="header__mobile-btn-register btn btn--orange">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;