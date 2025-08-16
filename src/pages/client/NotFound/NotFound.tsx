import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css';

const NotFound: React.FC = () => {
    return (
        <div className="not-found">
            <div className="not-found__container">
                <div className="not-found__content">
                    <div className="not-found__illustration">
                        <div className="error-code">404</div>
                        <div className="error-icon">��</div>
                    </div>

                    <h1 className="not-found__title">Trang không tồn tại</h1>
                    <p className="not-found__description">
                        Oops! Có vẻ như trang bạn đang tìm kiếm đã bay vào vũ trụ hoặc chưa được tạo.
                    </p>

                    <div className="not-found__actions">
                        <Link to="/" className="btn btn--primary">
                            <span className="btn-icon">🏠</span>
                            Về trang chủ
                        </Link>
                        <Link to="/courses" className="btn btn--secondary">
                            <span className="btn-icon">📚</span>
                            Khám phá khóa học
                        </Link>
                    </div>

                    <div className="not-found__help">
                        <h3>Bạn có thể thử:</h3>
                        <ul>
                            <li>Kiểm tra lại URL</li>
                            <li>Sử dụng thanh tìm kiếm</li>
                            <li>Duyệt qua menu chính</li>
                            <li>Liên hệ hỗ trợ nếu cần</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFound;