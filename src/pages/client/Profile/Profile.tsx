import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import api from '@/services/api';
import { toast } from 'react-hot-toast';
import { getProfile } from '@/store/authSlice';
import './profile.css';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';

interface ProfileForm {
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  address?: string;
  bio?: string;
}

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((s: RootState) => (s as any).auth);
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const initialForm: ProfileForm = useMemo(() => ({
    name: user?.name || `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    avatar: user?.avatar || '',
    address: (user as any)?.address || '',
    bio: (user as any)?.bio || '',
  }), [user]);
  const [form, setForm] = useState<ProfileForm>(initialForm);

  useEffect(() => { setForm(initialForm); }, [initialForm]);

  const [pwdCurrent, setPwdCurrent] = useState('');
  const [pwdNew, setPwdNew] = useState('');
  const [pwdConfirm, setPwdConfirm] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put('/auth/profile', form);
      toast.success('Cập nhật hồ sơ thành công');
      setEditMode(false);
      dispatch<any>(getProfile());
    } catch (err) {
      // toast đã hiển thị từ interceptor
    } finally {
      setSaving(false);
    }
  };

  const submitChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdNew || pwdNew !== pwdConfirm) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      setChangingPwd(true);
      await api.post('/auth/change-password', { currentPassword: pwdCurrent, newPassword: pwdNew });
      toast.success('Đổi mật khẩu thành công');
      setPwdCurrent(''); setPwdNew(''); setPwdConfirm('');
    } catch (err) {
      // toast từ interceptor
    } finally {
      setChangingPwd(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="profile-container">
        <h2>Vui lòng đăng nhập để xem hồ sơ</h2>
      </div>
    );
  }

  return (
    <>
        <Header/>
          <div className="profile-container">
              <h1 className="profile-title">Hồ sơ cá nhân</h1>

              {/* Summary Card */}
              <div className="profile-card profile-summary">
                  <div>
                      <img src={user?.avatar || '/images/default-avatar.png'} alt="avatar" className="profile-avatar" />
                  </div>
                  <div>
                      <div className="profile-name">{user?.name || user?.email}</div>
                      <div className="profile-email">{user?.email}</div>
                      <div className="profile-roles">
                          {(user?.roles || []).map((r: string) => (
                              <span key={r} className="profile-role-chip">{r}</span>
                          ))}
                      </div>
                  </div>
              </div>

              {/* View mode (default) */}
              {!editMode && (
                <div className="profile-card">
                  <div className="profile-section-title">Thông tin cá nhân</div>
                  <div className="info-grid">
                    <div className="info-row"><span className="info-label">Họ và tên</span><span className="info-value">{user?.name || '-'}</span></div>
                    <div className="info-row"><span className="info-label">Email</span><span className="info-value">{user?.email || '-'}</span></div>
                    <div className="info-row"><span className="info-label">Số điện thoại</span><span className="info-value">{(user as any)?.phone || '-'}</span></div>
                    <div className="info-row"><span className="info-label">Địa chỉ</span><span className="info-value">{(user as any)?.address || '-'}</span></div>
                    <div className="info-row col-span-2"><span className="info-label">Giới thiệu</span><span className="info-value">{(user as any)?.bio || '-'}</span></div>
                  </div>
                  <div className="profile-actions">
                    <button className="btn btn--outline-orange" onClick={() => setEditMode(true)}>Chỉnh sửa</button>
                  </div>
                </div>
              )}

              {/* Edit form */}
              {editMode && (
                <form onSubmit={submitProfile} className="profile-card">
                    <h2 className="profile-section-title">Cập nhật thông tin</h2>
                    <div className="grid-2">
                        <div>
                            <label className="form-label">Họ và tên</label>
                            <input className="form-input" name="name" value={form.name} onChange={handleChange} placeholder="Họ và tên" />
                        </div>
                        <div>
                            <label className="form-label">Email</label>
                            <input className="form-input" name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" />
                        </div>
                        <div>
                            <label className="form-label">Số điện thoại</label>
                            <input className="form-input" name="phone" value={form.phone || ''} onChange={handleChange} placeholder="Số điện thoại" />
                        </div>
                        <div>
                            <label className="form-label">Ảnh đại diện (URL)</label>
                            <input className="form-input" name="avatar" value={form.avatar || ''} onChange={handleChange} placeholder="https://..." />
                        </div>
                        <div className="col-span-2">
                            <label className="form-label">Địa chỉ</label>
                            <input className="form-input" name="address" value={form.address || ''} onChange={handleChange} placeholder="Địa chỉ" />
                        </div>
                        <div className="col-span-2">
                            <label className="form-label">Giới thiệu</label>
                            <textarea className="form-input" name="bio" value={form.bio || ''} onChange={handleChange} placeholder="Giới thiệu ngắn" rows={3} />
                        </div>
                    </div>
                    <div className="profile-actions">
                      <button className="btn" type="button" onClick={() => { setEditMode(false); setForm(initialForm); }}>Hủy</button>
                      <button className="btn btn--orange" type="submit" disabled={saving}>{saving ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
                    </div>
                </form>
              )}

              {/* Change password */}
              <form onSubmit={submitChangePassword} className="profile-card">
                  <h2 className="profile-section-title">Đổi mật khẩu</h2>
                  <div className="grid-3">
                      <div>
                          <label className="form-label">Mật khẩu hiện tại</label>
                          <input className="form-input" type="password" value={pwdCurrent} onChange={e => setPwdCurrent(e.target.value)} placeholder="••••••••" />
                      </div>
                      <div>
                          <label className="form-label">Mật khẩu mới</label>
                          <input className="form-input" type="password" value={pwdNew} onChange={e => setPwdNew(e.target.value)} placeholder="Ít nhất 8 ký tự, hoa/thường/số/ký tự đặc biệt" />
                      </div>
                      <div>
                          <label className="form-label">Xác nhận mật khẩu</label>
                          <input className="form-input" type="password" value={pwdConfirm} onChange={e => setPwdConfirm(e.target.value)} placeholder="Nhập lại mật khẩu mới" />
                      </div>
                  </div>
                  <div className="profile-actions">
                      <button className="btn btn--outline-orange" type="submit" disabled={changingPwd}>{changingPwd ? 'Đang đổi...' : 'Đổi mật khẩu'}</button>
                  </div>
              </form>
          </div>
          <Footer/>
    </>
  );
};

export default Profile;