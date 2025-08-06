import "./style.css";
const Header = () => {
  return (
    <header className="header" role="banner">
      <div className="header__container flex justify-between items-center" style={{height: 98}}>
        {/* Left */}
        <div className="header__left flex items-center" style={{gap: 16, flex: 1}}>
          {/* Logo */}
          <a href="/" className="header__logo" aria-label="Logo">
            <img src="./images/logo.png" alt="Logo" width={142} height={32} />
          </a>
          {/* Navigation menu */}
          <nav className="header__nav-left flex items-center" style={{gap: 8}}>
            {/* <div className="header__nav-item nav-menu active">Trang chủ</div> */}
            {/* <div className="header__nav-item nav-menu">Khóa học</div> */}
            {/* <div className="header__nav-item nav-menu">Chương trình</div> */}
          </nav>
          {/* Search */}
          <div className="header__search flex items-center" style={{flex: 1, maxWidth: 500, marginLeft: 16}}>
            <div className="header__search-box relative flex items-center w-full">
              <span className="header__search-icon">
                <svg width="20" height="20" fill="none" stroke="#656D7A" strokeWidth="1.7" viewBox="0 0 20 20"><circle cx="9" cy="9" r="7"/><path d="M15.5 15.5L13 13"/></svg>
              </span>
              <input type="text" className="header__search-input" placeholder="Tìm kiếm khóa học, nội dung..." />
              <span className="header__search-help ml-2">
                <svg width="16" height="16" fill="none" stroke="#98A2B3" strokeWidth="1.3" viewBox="0 0 16 16"><circle cx="8" cy="8" r="6.5"/><path d="M8 11v-1m0-4a1.5 1.5 0 0 1 1.5 1.5c0 .828-.672 1.5-1.5 1.5S6.5 8.328 6.5 7.5"/></svg>
              </span>
            </div>
          </div>
        </div>
        {/* Right */}
        <div className="header__right flex items-center" style={{gap: 16}}>
          <nav className="header__nav-right flex items-center" style={{gap: 8}}>
            <div className="header__nav-item nav-menu active">Trang chủ</div>
            <div className="header__nav-item nav-menu">Khóa Học</div>
            <div className="header__nav-item nav-menu">Liên Hệ</div>
          </nav>
          <button className="header__btn-login btn btn--outline-orange" type="button">Đăng nhập</button>
          <button className="header__btn-register btn btn--orange" type="button">Đăng ký</button>
          {/* Language switcher */}
          <div className="header__lang relative flex items-center cursor-pointer">
            <svg width="24" height="24" fill="none" stroke="#101846" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20"/></svg>
            <div className="header__lang-menu absolute z-10 bg-white border rounded shadow-md" style={{top: 36, right: 0, minWidth: 120, display: 'none'}}>
              <div className="header__lang-item flex items-center p-2 cursor-pointer">
                <span className="mr-2">🇻🇳</span> Tiếng Việt
              </div>
              <div className="header__lang-item flex items-center p-2 cursor-pointer">
                <span className="mr-2">🇬🇧</span> English
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;