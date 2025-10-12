import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { clientSystemSettingsService } from "@/services/client/system-settings.service";
import type { SystemSettingsData } from "@/services/admin/system-settings.service";

const Footer = () => {
  const [settings, setSettings] = useState<SystemSettingsData | null>(null);

  // Fetch system settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await clientSystemSettingsService.getPublicSettings();
        if (response.success) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch system settings:', error);
      }
    };
    fetchSettings();
  }, []);

  return (
    <footer className="footer-section" role="contentinfo">
      <div className="footer-section__container">
        <div className="footer-section__top">
          <div className="footer-section__brand">
            <img
              src={settings?.siteLogo || "./images/logo.png"}
              alt={`${settings?.siteName || "LMS"} logo`}
              className="footer-section__logo"
              width={142}
              height={32}
            />
            <p className="footer-section__desc">
              {settings?.siteDescription || "Cung cấp các chương trình đào tạo chất lượng cao, giúp bạn phát triển kỹ năng và sự nghiệp."}
            </p>
          </div>
          <div className="footer-section__links">
            <Link to="/" className="footer-section__link">Trang chủ</Link>
            <Link to="/courses" className="footer-section__link">Khóa học</Link>
            <Link to="/contact" className="footer-section__link">Liên hệ</Link>
            <Link to="/about" className="footer-section__link">Về chúng tôi</Link>
            <Link to={settings?.legal.termsOfServiceUrl || "/terms"} className="footer-section__link">Điều khoản</Link>
            <Link to={settings?.legal.privacyPolicyUrl || "/privacy"} className="footer-section__link">Chính sách</Link>
          </div>
        </div>

        <div className="footer-section__content">
          <div className="footer-section__info-col">
            <div className="footer-section__info-title">Liên hệ</div>
            {settings?.contactInfo.address && (
              <div className="footer-section__info-row">
                <span className="footer-section__info-icon">
                  <svg width="16" height="16" fill="none" stroke="#FDFEFF" strokeWidth="1.5" viewBox="0 0 16 16">
                    <path d="M8 14.667s5.333-4.667 5.333-8A5.333 5.333 0 0 0 2.667 6.667c0 3.333 5.333 8 5.333 8Z" />
                    <circle cx="8" cy="6.667" r="1.333" />
                  </svg>
                </span>
                <span className="footer-section__info-text">
                  {settings.contactInfo.address}
                  {settings.contactInfo.city && `, ${settings.contactInfo.city}`}
                  {settings.contactInfo.country && `, ${settings.contactInfo.country}`}
                </span>
              </div>
            )}
            <div className="footer-section__info-row">
              <span className="footer-section__info-icon">
                <svg width="16" height="16" fill="none" stroke="#FDFEFF" strokeWidth="1.5" viewBox="0 0 16 16">
                  <path d="M13.333 10.667v2a1.333 1.333 0 0 1-1.333 1.333A10.667 10.667 0 0 1 2.667 4a1.333 1.333 0 0 1 1.333-1.333h2A.667.667 0 0 1 6.667 3.2l.6 2a.667.667 0 0 1-.193.667l-.867.867a8.667 8.667 0 0 0 3.2 3.2l.867-.867a.667.667 0 0 1 .667-.193l2 .6a.667.667 0 0 1 .533.653Z" />
                </svg>
              </span>
              <span className="footer-section__info-text">
                {settings?.contactInfo.phone || "+84 123 456 789"}
              </span>
            </div>
            <div className="footer-section__info-row">
              <span className="footer-section__info-icon">
                <svg width="16" height="16" fill="none" stroke="#FDFEFF" strokeWidth="1.5" viewBox="0 0 16 16">
                  <rect x="2.667" y="4" width="10.667" height="8" rx="1.333" />
                  <path d="m3.333 4.667 4.667 4 4.667-4" />
                </svg>
              </span>
              <span className="footer-section__info-text">
                {settings?.contactInfo.email || "support@example.com"}
              </span>
            </div>
          </div>

          <div className="footer-section__info-col">
            <div className="footer-section__info-title">Thông tin</div>
            <Link to="/about" className="footer-section__link-item">Về chúng tôi</Link>
            <Link to="/contact" className="footer-section__link-item">Liên hệ</Link>
            <Link to={settings?.legal.termsOfServiceUrl || "/terms"} className="footer-section__link-item">Điều khoản dịch vụ</Link>
            <Link to={settings?.legal.privacyPolicyUrl || "/privacy"} className="footer-section__link-item">Chính sách bảo mật</Link>
            <Link to={settings?.legal.refundPolicyUrl || "/refund-policy"} className="footer-section__link-item">Chính sách hoàn tiền</Link>
          </div>

          <div className="footer-section__info-col">
            <div className="footer-section__info-title">Kết nối với chúng tôi</div>
            <div className="footer-section__social-links">
              {settings?.socialMedia.facebook && (
                <a
                  href={settings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-section__social-link-text"
                >
                  Facebook
                </a>
              )}
              {settings?.socialMedia.twitter && (
                <a
                  href={settings.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-section__social-link-text"
                >
                  Twitter
                </a>
              )}
              {settings?.socialMedia.linkedin && (
                <a
                  href={settings.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-section__social-link-text"
                >
                  LinkedIn
                </a>
              )}
              {settings?.socialMedia.youtube && (
                <a
                  href={settings.socialMedia.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-section__social-link-text"
                >
                  YouTube
                </a>
              )}
              {settings?.socialMedia.github && (
                <a
                  href={settings.socialMedia.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-section__social-link-text"
                >
                  GitHub
                </a>
              )}
              {settings?.socialMedia.instagram && (
                <a
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-section__social-link-text"
                >
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-section__divider"></div>

      <div className="footer-section__bottom">
        <div className="footer-section__copyright">
          {settings?.legal.copyrightText || "© 2025 LMS Platform. All rights reserved."}
        </div>
        <div className="footer-section__social">
          {settings?.socialMedia.twitter && (
            <a
              href={settings.socialMedia.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-section__social-link"
              aria-label="Twitter"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="#98A2B3" strokeWidth="1.5" d="M22 5.924a8.94 8.94 0 0 1-2.357.646A3.93 3.93 0 0 0 21.448 4.1a7.86 7.86 0 0 1-2.495.953A3.92 3.92 0 0 0 16.616 4c-2.18 0-3.95 1.77-3.95 3.95 0 .31.035.61.1.9A11.13 11.13 0 0 1 3.11 4.6a3.95 3.95 0 0 0-.535 1.99c0 1.37.7 2.58 1.77 3.29a3.93 3.93 0 0 1-1.79-.5v.05c0 1.91 1.36 3.5 3.17 3.86-.33.09-.68.14-1.04.14-.25 0-.5-.02-.74-.07.5 1.56 1.95 2.7 3.67 2.73A7.89 7.89 0 0 1 2 19.07c-.26 0-.51-.01-.77-.04A11.13 11.13 0 0 0 7.29 21c7.55 0 11.68-6.26 11.68-11.68 0-.18-.01-.36-.02-.54A8.18 8.18 0 0 0 22 5.92Z" />
              </svg>
            </a>
          )}
          {settings?.socialMedia.linkedin && (
            <a
              href={settings.socialMedia.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-section__social-link"
              aria-label="LinkedIn"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <rect width="24" height="24" rx="4" fill="none" />
                <path stroke="#98A2B3" strokeWidth="1.5" d="M16.5 8.5A3.5 3.5 0 0 1 20 12v3.5A3.5 3.5 0 0 1 16.5 19h-9A3.5 3.5 0 0 1 4 15.5V12a3.5 3.5 0 0 1 3.5-3.5h9Z" />
                <path stroke="#98A2B3" strokeWidth="1.5" d="M8 11v4" />
                <circle cx="8" cy="9" r="1" fill="#98A2B3" />
                <path stroke="#98A2B3" strokeWidth="1.5" d="M12 11v4" />
                <circle cx="12" cy="9" r="1" fill="#98A2B3" />
                <path stroke="#98A2B3" strokeWidth="1.5" d="M16 11v4" />
                <circle cx="16" cy="9" r="1" fill="#98A2B3" />
              </svg>
            </a>
          )}
          {settings?.socialMedia.github && (
            <a
              href={settings.socialMedia.github}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-section__social-link"
              aria-label="GitHub"
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="#98A2B3" strokeWidth="1.5" d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.09.66-.22.66-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.15-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.63-1.33-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.56 9.56 0 0 1 12 6.8c.85.004 1.71.115 2.51.337 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85v2.74c0 .27.16.58.67.48A10.01 10.01 0 0 0 22 12c0-5.52-4.48-10-10-10Z" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;