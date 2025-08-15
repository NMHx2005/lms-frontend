import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  joinDate: string;
  language: string;
  timezone: string;
  bio: string;
}

const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Mock data
  const userProfile: UserProfile = {
    id: '1',
    fullName: 'Hieu Doan',
    email: 'hieu@gmail.com',
    phone: '+84 123 456 789',
    avatar: '/images/default-avatar.png',
    role: 'Student',
    joinDate: '2024-01-01',
    language: 'Tiếng Việt',
    timezone: 'Asia/Ho_Chi_Minh',
    bio: 'Học viên đam mê công nghệ và phát triển phần mềm. Luôn tìm kiếm cơ hội học hỏi và phát triển kỹ năng mới.'
  };

  const [formData, setFormData] = useState({
    fullName: userProfile.fullName,
    email: userProfile.email,
    phone: userProfile.phone,
    bio: userProfile.bio,
    language: userProfile.language,
    timezone: userProfile.timezone
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // Mock function - in real app this would call API
    console.log('Saving profile:', formData);
    setIsEditing(false);
    alert('Cập nhật thông tin thành công!');
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
      return;
    }
    // Mock function - in real app this would call API
    console.log('Changing password:', passwordData);
    setIsChangingPassword(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    alert('Đổi mật khẩu thành công!');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <div className="dashboard__breadcrumbs">
          <Link to="/dashboard">Dashboard</Link>
          <span>Hồ sơ cá nhân</span>
        </div>
        <h1 className="dashboard__title">Hồ sơ cá nhân</h1>
      </div>

      <div className="dashboard__content">
        {/* Tabs */}
        <div className="dashboard__tabs">
          <button
            className={`dashboard__tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Thông tin cá nhân
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            Bảo mật
          </button>
          <button
            className={`dashboard__tab ${activeTab === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Cài đặt
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="dashboard__profile">
            <div className="profile__header">
              <div className="profile__avatar-section">
                <div className="profile__avatar">
                  <img src={userProfile.avatar} alt="User Avatar" />
                  <button className="profile__avatar-edit">
                    📷
                  </button>
                </div>
                <div className="profile__info">
                  <h3>{userProfile.fullName}</h3>
                  <p className="profile__role">{userProfile.role}</p>
                  <p className="profile__join-date">Tham gia từ {formatDate(userProfile.joinDate)}</p>
                </div>
              </div>
              <div className="profile__actions">
                {!isEditing ? (
                  <button 
                    className="dashboard__btn dashboard__btn--primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Chỉnh sửa
                  </button>
                ) : (
                  <div className="profile__edit-actions">
                    <button 
                      className="dashboard__btn dashboard__btn--primary"
                      onClick={handleSaveProfile}
                    >
                      Lưu
                    </button>
                    <button 
                      className="dashboard__btn dashboard__btn--outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          fullName: userProfile.fullName,
                          email: userProfile.email,
                          phone: userProfile.phone,
                          bio: userProfile.bio,
                          language: userProfile.language,
                          timezone: userProfile.timezone
                        });
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="profile__form">
              <div className="form-section">
                <h4>Thông tin cơ bản</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="form-group">
                    <label>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h4>Giới thiệu</h4>
                <div className="form-group">
                  <label>Mô tả về bản thân</label>
                  <textarea
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    rows={4}
                    placeholder="Viết một vài dòng giới thiệu về bản thân..."
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="dashboard__security">
            <div className="security__section">
              <h3>Đổi mật khẩu</h3>
              <p>Đảm bảo mật khẩu của bạn an toàn và khó đoán</p>
              
              {!isChangingPassword ? (
                <button 
                  className="dashboard__btn dashboard__btn--primary"
                  onClick={() => setIsChangingPassword(true)}
                >
                  Đổi mật khẩu
                </button>
              ) : (
                <div className="password-form">
                  <div className="form-group">
                    <label>Mật khẩu hiện tại</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                  </div>
                  <div className="form-group">
                    <label>Mật khẩu mới</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập mật khẩu mới"
                    />
                  </div>
                  <div className="form-group">
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      placeholder="Nhập lại mật khẩu mới"
                    />
                  </div>
                  <div className="form-actions">
                    <button 
                      className="dashboard__btn dashboard__btn--primary"
                      onClick={handleChangePassword}
                    >
                      Cập nhật mật khẩu
                    </button>
                    <button 
                      className="dashboard__btn dashboard__btn--outline"
                      onClick={() => {
                        setIsChangingPassword(false);
                        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="security__section">
              <h3>Bảo mật tài khoản</h3>
              <div className="security__options">
                <div className="security__option">
                  <div className="security__option-info">
                    <h4>Xác thực 2 yếu tố</h4>
                    <p>Bảo vệ tài khoản bằng mã xác thực từ ứng dụng</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="security__option">
                  <div className="security__option-info">
                    <h4>Thông báo đăng nhập</h4>
                    <p>Nhận email khi có đăng nhập mới</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="dashboard__preferences">
            <div className="preferences__section">
              <h3>Cài đặt ngôn ngữ & khu vực</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label>Ngôn ngữ</label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleInputChange}
                  >
                    <option value="Tiếng Việt">Tiếng Việt</option>
                    <option value="English">English</option>
                    <option value="日本語">日本語</option>
                    <option value="한국어">한국어</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Múi giờ</label>
                  <select
                    name="timezone"
                    value={formData.timezone}
                    onChange={handleInputChange}
                  >
                    <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh (GMT+7)</option>
                    <option value="Asia/Tokyo">Asia/Tokyo (GMT+9)</option>
                    <option value="Asia/Seoul">Asia/Seoul (GMT+9)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="preferences__section">
              <h3>Cài đặt thông báo</h3>
              <div className="preferences__options">
                <div className="preference__option">
                  <div className="preference__option-info">
                    <h4>Thông báo email</h4>
                    <p>Nhận thông báo qua email</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="preference__option">
                  <div className="preference__option-info">
                    <h4>Thông báo push</h4>
                    <p>Nhận thông báo trên trình duyệt</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <div className="preference__option">
                  <div className="preference__option-info">
                    <h4>Thông báo khóa học</h4>
                    <p>Thông báo về khóa học mới và cập nhật</p>
                  </div>
                  <label className="toggle-switch">
                    <input type="checkbox" defaultChecked />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
