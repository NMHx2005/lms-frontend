import { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '@/store';
import { toast } from 'react-hot-toast';
import { getProfile } from '@/store/authSlice';
import { clientAuthService } from '@/services';
import './profile.css';
import Header from '@/components/Layout/client/Header';
import Footer from '@/components/Layout/client/Footer';
import { sharedUploadService } from '@/services';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((s: RootState) => (s as any).auth);
  const [saving, setSaving] = useState(false);
  const [changingPwd, setChangingPwd] = useState(false);
  const [editMode, setEditMode] = useState(false);
  
  const initialForm = useMemo(() => ({
    name: String(user?.name || `${(user as any)?.firstName || ''} ${(user as any)?.lastName || ''}`.trim() || ''),
    email: String(user?.email || ''),
    phone: String((user as any)?.profile?.phone || (user as any)?.phone || ''),
    avatar: String((user as any)?.profile?.avatar || user?.avatar || ''),
    address: String((user as any)?.profile?.address || (user as any)?.address || ''),
    country: String((user as any)?.profile?.country || (user as any)?.country || ''),
    bio: String((user as any)?.profile?.bio || (user as any)?.bio || ''),
  }), [user]);
  
  const [form, setForm] = useState(initialForm);

  useEffect(() => { setForm(initialForm); }, [initialForm]);

  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Avatar input mode: 'url' | 'file'
  const [avatarMode, setAvatarMode] = useState<'url' | 'file'>('url');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarCacheBust, setAvatarCacheBust] = useState<number>(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value ?? '' }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPwdForm(prev => ({ ...prev, [name]: value ?? '' }));
  };

  const submitProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);

      let avatarUrl = form.avatar || '';
      if (avatarMode === 'file' && avatarFile) {
        try {
          const uploaded: any = await sharedUploadService.uploadProfilePicture(avatarFile);
          avatarUrl = uploaded?.url || uploaded?.data?.url || uploaded?.secure_url || uploaded?.data?.secure_url || avatarUrl;
          if (avatarUrl) {
            setForm(prev => ({ ...prev, avatar: String(avatarUrl) }));
            setAvatarCacheBust(Date.now());
          }
        } catch (uploadErr: any) {
          toast.error('Tải ảnh đại diện thất bại');
          return;
        }
      }

      const payload: any = {
        name: form.name || undefined,
        profile: {
          avatar: (avatarMode === 'url' ? (form.avatar || undefined) : (avatarUrl || undefined)),
          phone: form.phone || undefined,
          address: form.address || undefined,
          country: form.country || undefined,
          bio: form.bio || undefined,
        },
      };

      await clientAuthService.updateProfile(payload);
      // Refresh user data
      await dispatch<any>(getProfile());
      setEditMode(false);
      toast.success('Cập nhật hồ sơ thành công');
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || err?.response?.data?.message || 'Cập nhật hồ sơ thất bại';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const submitChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pwdForm.newPassword || pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp');
      return;
    }
    try {
      setChangingPwd(true);
      await clientAuthService.changePassword(pwdForm);
      toast.success('Đổi mật khẩu thành công');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err: any) {
      const message = err?.response?.data?.error?.message || err?.response?.data?.message || 'Đổi mật khẩu thất bại';
      toast.error(message);
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

  const avatarSrcBase = form.avatar || (user as any)?.profile?.avatar || user?.avatar || '/images/default-avatar.png';
  const avatarSrc = avatarSrcBase ? `${avatarSrcBase}${avatarSrcBase.includes('?') ? '&' : '?'}v=${avatarCacheBust}` : '/images/default-avatar.png';

  return (
    <>
        <Header/>
          <div className="profile-container">
              <h1 className="profile-title">Hồ sơ cá nhân</h1>

              {/* Summary Card */}
              <div className="profile-card profile-summary">
                  <div>
                      <img src={avatarSrc} alt="avatar" className="profile-avatar" />
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
                    <div className="info-row"><span className="info-label">Số điện thoại</span><span className="info-value">{(user as any)?.profile?.phone || (user as any)?.phone || '-'}</span></div>
                    <div className="info-row"><span className="info-label">Quốc gia</span><span className="info-value">{(user as any)?.profile?.country || (user as any)?.country || '-'}</span></div>
                    <div className="info-row"><span className="info-label">Địa chỉ</span><span className="info-value">{(user as any)?.profile?.address || (user as any)?.address || '-'}</span></div>
                    <div className="info-row col-span-2"><span className="info-label">Giới thiệu</span><span className="info-value">{(user as any)?.profile?.bio || (user as any)?.bio || '-'}</span></div>
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
                            <input className="form-input" name="name" value={form.name ?? ''} onChange={handleChange} placeholder="Họ và tên" />
                        </div>
                        <div>
                            <label className="form-label">Email</label>
                            <input className="form-input" name="email" value={form.email ?? ''} onChange={handleChange} placeholder="Email" type="email" />
                        </div>
                        <div>
                            <label className="form-label">Số điện thoại</label>
                            <input className="form-input" name="phone" value={form.phone ?? ''} onChange={handleChange} placeholder="Số điện thoại" />
                        </div>
                        <div>
                            <label className="form-label">Quốc gia</label>
                            <input className="form-input" name="country" value={form.country ?? ''} onChange={handleChange} placeholder="Quốc gia" />
                        </div>
                        <div>
                            <label className="form-label">Ảnh đại diện</label>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <input type="radio" name="avatarMode" value="url" checked={avatarMode === 'url'} onChange={() => setAvatarMode('url')} /> URL
                              </label>
                              <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <input type="radio" name="avatarMode" value="file" checked={avatarMode === 'file'} onChange={() => setAvatarMode('file')} /> Upload file
                              </label>
                            </div>
                            {avatarMode === 'url' ? (
                              <input className="form-input" name="avatar" value={form.avatar ?? ''} onChange={(e) => { handleChange(e as any); setAvatarCacheBust(Date.now()); }} placeholder="https://..." />
                            ) : (
                              <input className="form-input" type="file" accept="image/*" onChange={(e) => { setAvatarFile(e.target.files?.[0] || null); }} />
                            )}
                        </div>
                        <div className="col-span-2">
                            <label className="form-label">Địa chỉ</label>
                            <input className="form-input" name="address" value={form.address ?? ''} onChange={handleChange} placeholder="Địa chỉ" />
                        </div>
                        <div className="col-span-2">
                            <label className="form-label">Giới thiệu</label>
                            <textarea className="form-input" name="bio" value={form.bio ?? ''} onChange={handleChange} placeholder="Giới thiệu ngắn" rows={3} />
                        </div>
                    </div>
                    <div className="profile-actions">
                      <button className="btn" type="button" onClick={() => { setEditMode(false); setForm(initialForm); setAvatarFile(null); setAvatarMode('url'); setAvatarCacheBust(Date.now()); }}>Hủy</button>
                      <button className="btn btn--orange" type="submit" disabled={saving || loading}>{saving || loading ? 'Đang lưu...' : 'Lưu thay đổi'}</button>
                    </div>
                </form>
              )}

              {/* Change password */}
              <form onSubmit={submitChangePassword} className="profile-card">
                  <h2 className="profile-section-title">Đổi mật khẩu</h2>
                  <div className="grid-3">
                      <div>
                          <label className="form-label">Mật khẩu hiện tại</label>
                          <input className="form-input" type="password" name="currentPassword" value={pwdForm.currentPassword} onChange={handlePasswordChange} placeholder="••••••••" />
                      </div>
                      <div>
                          <label className="form-label">Mật khẩu mới</label>
                          <input className="form-input" type="password" name="newPassword" value={pwdForm.newPassword} onChange={handlePasswordChange} placeholder="Ít nhất 8 ký tự, hoa/thường/số/ký tự đặc biệt" />
                      </div>
                      <div>
                          <label className="form-label">Xác nhận mật khẩu</label>
                          <input className="form-input" type="password" name="confirmPassword" value={pwdForm.confirmPassword} onChange={handlePasswordChange} placeholder="Nhập lại mật khẩu mới" />
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