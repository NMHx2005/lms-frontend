import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './CourseEditor.css';

interface CourseData {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  domain: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  price: number;
  status: 'draft' | 'published' | 'pending' | 'rejected';
  tags: string[];
  requirements: string[];
  objectives: string[];
}

interface SectionConfig {
  id: string;
  title: string;
  icon: string;
  visible: boolean;
  type: 'tags' | 'requirements' | 'objectives' | 'custom';
  data: string[];
}

const CourseEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<CourseData>>({});
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  
  console.log(course, thumbnailFile);
  // Quản lý hiển thị các section
  const [sections, setSections] = useState<SectionConfig[]>([
    { id: 'tags', title: 'Tags', icon: '🏷️', visible: true, type: 'tags', data: [''] },
    { id: 'requirements', title: 'Yêu cầu đầu vào', icon: '📋', visible: true, type: 'requirements', data: [''] },
    { id: 'objectives', title: 'Mục tiêu học tập', icon: '🎯', visible: true, type: 'objectives', data: [''] }
  ]);

  // State cho section mới
  const [showAddSectionForm, setShowAddSectionForm] = useState(false);
  const [newSection, setNewSection] = useState({
    title: '',
    icon: '📝',
    type: 'custom' as const
  });

  useEffect(() => {
    // Check if this is create mode (no id) or edit mode
    if (!id || id === 'new') {
      // Create mode - set default values
      const defaultCourse: Partial<CourseData> = {
        title: '',
        description: '',
        thumbnail: '',
        domain: '',
        level: 'beginner',
        price: 0,
        status: 'draft',
        tags: [''],
        requirements: [''],
        objectives: ['']
      };
      setCourse(null);
      setFormData(defaultCourse);
      setThumbnailPreview('');
      setLoading(false);
    } else {
      // Edit mode - fetch existing course data
      setTimeout(() => {
        const mockCourse: CourseData = {
          _id: id,
          title: 'React Advanced Patterns',
          description: 'Khóa học nâng cao về React, bao gồm các pattern và best practices để xây dựng ứng dụng web hiện đại.',
          thumbnail: '/images/apollo.png',
          domain: 'Web Development',
          level: 'advanced',
          price: 299000,
          status: 'draft',
          tags: ['React', 'JavaScript', 'Frontend', 'Advanced'],
          requirements: ['Kiến thức cơ bản về React', 'JavaScript ES6+', 'HTML/CSS'],
          objectives: ['Hiểu sâu về React patterns', 'Xây dựng ứng dụng scalable', 'Tối ưu hiệu suất']
        };
        setCourse(mockCourse);
        setFormData(mockCourse);
        setThumbnailPreview(mockCourse.thumbnail);
        setLoading(false);
      }, 1000);
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...(formData.tags || [])];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    setFormData(prev => ({
      ...prev,
      tags: [...(prev.tags || []), '']
    }));
  };

  const removeTag = (index: number) => {
    const newTags = [...(formData.tags || [])];
    newTags.splice(index, 1);
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...(formData.requirements || [])];
    newRequirements[index] = value;
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const addRequirement = () => {
    setFormData(prev => ({
      ...prev,
      requirements: [...(prev.requirements || []), '']
    }));
  };

  const removeRequirement = (index: number) => {
    const newRequirements = [...(formData.requirements || [])];
    newRequirements.splice(index, 1);
    setFormData(prev => ({ ...prev, requirements: newRequirements }));
  };

  const handleObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...(formData.objectives || [])];
    newObjectives[index] = value;
    setFormData(prev => ({ ...prev, objectives: newObjectives }));
  };

  const addObjective = () => {
    setFormData(prev => ({
      ...prev,
      objectives: [...(prev.objectives || []), '']
    }));
  };

  const removeObjective = (index: number) => {
    const newObjectives = [...(formData.objectives || [])];
    newObjectives.splice(index, 1);
    setFormData(prev => ({ ...prev, objectives: newObjectives }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setSaving(false);
    alert('Khóa học đã được lưu thành công!');
  };

  const handlePublish = async () => {
    if (confirm('Bạn có chắc chắn muốn xuất bản khóa học này?')) {
      setSaving(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSaving(false);
      alert('Khóa học đã được xuất bản thành công!');
      navigate('/teacher/courses');
    }
  };

  // Quản lý hiển thị section
  // const toggleSection = (sectionId: string) => {
  //   setSections(prev => prev.map(section => 
  //     section.id === sectionId 
  //       ? { ...section, visible: !section.visible }
  //       : section
  //   ));
  // };

  const addSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, visible: true }
        : section
    ));
  };

  const removeSection = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, visible: false }
        : section
    ));
  };

  // Thêm section mới
  const addNewSection = () => {
    if (newSection.title.trim()) {
      const newSectionConfig: SectionConfig = {
        id: `custom-${Date.now()}`,
        title: newSection.title.trim(),
        icon: newSection.icon,
        visible: true,
        type: 'custom',
        data: ['']
      };
      
      setSections(prev => [...prev, newSectionConfig]);
      setNewSection({ title: '', icon: '📝', type: 'custom' });
      setShowAddSectionForm(false);
    }
  };

  // Xóa section hoàn toàn
  const deleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
  };

  // Quản lý data của custom section
  const handleCustomSectionChange = (sectionId: string, index: number, value: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, data: section.data.map((item, i) => i === index ? value : item) }
        : section
    ));
  };

  const addCustomSectionItem = (sectionId: string) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, data: [...section.data, ''] }
        : section
    ));
  };

  const removeCustomSectionItem = (sectionId: string, index: number) => {
    setSections(prev => prev.map(section => 
      section.id === sectionId 
        ? { ...section, data: section.data.filter((_, i) => i !== index) }
        : section
    ));
  };

  if (loading) {
    return (
      <div className="teacher-dashboard">
        <div className="teacher-dashboard__header">
          <div className="teacher-dashboard__breadcrumbs">
            <span>Teacher Dashboard</span>
            <span>/</span>
            <span>Course Studio</span>
            <span>/</span>
            <span>Chỉnh sửa khóa học</span>
          </div>
          <h1 className="teacher-dashboard__title">Chỉnh sửa khóa học</h1>
        </div>
        <div className="teacher-dashboard__content">
          <div className="dashboard__loading">
            <div className="dashboard__loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="teacher-dashboard">
      <div className="teacher-dashboard__header">
        <div className="teacher-dashboard__breadcrumbs">
          <span>Teacher Dashboard</span>
          <span>/</span>
          <span>Course Studio</span>
          <span>/</span>
          <span>{!id || id === 'new' ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}</span>
        </div>
        <h1 className="teacher-dashboard__title">
          {!id || id === 'new' ? 'Tạo khóa học mới' : 'Chỉnh sửa khóa học'}
        </h1>
      </div>

      <div className="teacher-dashboard__content">
        <form className="course-editor__form" onSubmit={(e) => e.preventDefault()}>
          {/* Basic Information */}
          <div className="form-section">
            <h3 className="form-section__title">📝 Thông tin cơ bản</h3>
            
            <div className="form-group">
              <label htmlFor="title">Tên khóa học *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleInputChange}
                placeholder="Nhập tên khóa học"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả khóa học *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleInputChange}
                placeholder="Mô tả chi tiết về khóa học"
                rows={4}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="domain">Lĩnh vực *</label>
                <select
                  id="domain"
                  name="domain"
                  value={formData.domain || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn lĩnh vực</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Data Science">Data Science</option>
                  <option value="Design">Design</option>
                  <option value="Business">Business</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level">Cấp độ *</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level || ''}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Chọn cấp độ</option>
                  <option value="beginner">Cơ bản</option>
                  <option value="intermediate">Trung cấp</option>
                  <option value="advanced">Nâng cao</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Giá (VND) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Thumbnail */}
          <div className="form-section">
            <h3 className="form-section__title">🖼️ Thumbnail</h3>
            
            <div className="thumbnail-upload">
              <div className="thumbnail-preview">
                <img src={thumbnailPreview} alt="Thumbnail preview" />
              </div>
              <div className="thumbnail-actions">
                <input
                  type="file"
                  id="thumbnail"
                  accept="image/*"
                  onChange={handleThumbnailChange}
                  className="thumbnail-input"
                />
                <label htmlFor="thumbnail" className="thumbnail-btn">
                  📁 Chọn ảnh
                </label>
                <p className="thumbnail-hint">
                  Kích thước khuyến nghị: 1280x720px, định dạng: JPG, PNG
                </p>
              </div>
            </div>
          </div>

          {/* Section Management */}
          <div className="form-section">
            <h3 className="form-section__title">⚙️ Quản lý các section</h3>
            <p className="section-description">
              Bật/tắt các section để tùy chỉnh giao diện khóa học
            </p>
            
            <div className="section-controls">
              {sections.map((section) => (
                <div key={section.id} className="section-control-item">
                  <div className="section-control-info">
                    <span className="section-icon">{section.icon}</span>
                    <span className="section-title">{section.title}</span>
                    {section.type === 'custom' && (
                      <span className="section-type-badge">Tùy chỉnh</span>
                    )}
                  </div>
                  <div className="section-control-actions">
                    {section.visible ? (
                      <button
                        type="button"
                        onClick={() => removeSection(section.id)}
                        className="section-control-btn section-control-btn--hide"
                        title={`Ẩn section ${section.title}`}
                      >
                        👁️ Ẩn
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addSection(section.id)}
                        className="section-control-btn section-control-btn--show"
                        title={`Hiện section ${section.title}`}
                      >
                        👁️‍🗨️ Hiện
                      </button>
                    )}
                    {section.type === 'custom' && (
                      <button
                        type="button"
                        onClick={() => deleteSection(section.id)}
                        className="section-control-btn section-control-btn--delete"
                        title={`Xóa section ${section.title}`}
                      >
                        🗑️ Xóa
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add New Section Form */}
            <div className="add-section-section">
              <button
                type="button"
                onClick={() => setShowAddSectionForm(!showAddSectionForm)}
                className="add-section-toggle-btn"
              >
                {showAddSectionForm ? '❌ Hủy' : '➕ Thêm section mới'}
              </button>
              
              {showAddSectionForm && (
                <div className="add-section-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="newSectionIcon">Icon</label>
                      <select
                        id="newSectionIcon"
                        value={newSection.icon}
                        onChange={(e) => setNewSection(prev => ({ ...prev, icon: e.target.value }))}
                      >
                        <option value="📝">📝 Văn bản</option>
                        <option value="📚">📚 Tài liệu</option>
                        <option value="🎬">🎬 Video</option>
                        <option value="🔗">🔗 Liên kết</option>
                        <option value="📊">📊 Thống kê</option>
                        <option value="💡">💡 Gợi ý</option>
                        <option value="⚠️">⚠️ Lưu ý</option>
                        <option value="✅">✅ Checklist</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="newSectionTitle">Tên section *</label>
                      <input
                        type="text"
                        id="newSectionTitle"
                        value={newSection.title}
                        onChange={(e) => setNewSection(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Nhập tên section mới"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={addNewSection}
                    className="add-section-submit-btn"
                    disabled={!newSection.title.trim()}
                  >
                    ➕ Tạo section mới
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          {sections.find(s => s.id === 'tags')?.visible && (
            <div className="form-section">
              <div className="form-section__header">
                <h3 className="form-section__title">🏷️ Tags</h3>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, tags: [] }))}
                  className="section-remove-btn"
                  title="Xóa toàn bộ section Tags"
                >
                  🗑️ Xóa section
                </button>
              </div>
              
              <div className="tags-container">
                {(formData.tags || []).map((tag, index) => (
                  <div key={index} className="tag-input-group">
                    <input
                      type="text"
                      value={tag}
                      onChange={(e) => handleTagChange(index, e.target.value)}
                      placeholder="Nhập tag"
                      className="tag-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeTag(index)}
                      className="tag-remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addTag} className="add-tag-btn">
                  ➕ Thêm tag
                </button>
              </div>
            </div>
          )}

          {/* Requirements */}
          {sections.find(s => s.id === 'requirements')?.visible && (
            <div className="form-section">
              <div className="form-section__header">
                <h3 className="form-section__title">📋 Yêu cầu đầu vào</h3>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, requirements: [] }))}
                  className="section-remove-btn"
                  title="Xóa toàn bộ section Yêu cầu đầu vào"
                >
                  🗑️ Xóa section
                </button>
              </div>
              
              <div className="requirements-container">
                {(formData.requirements || []).map((req, index) => (
                  <div key={index} className="requirement-input-group">
                    <textarea
                      value={req}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      placeholder="Nhập yêu cầu"
                      rows={2}
                      className="requirement-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="requirement-remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addRequirement} className="add-requirement-btn">
                  ➕ Thêm yêu cầu
                </button>
              </div>
            </div>
          )}

          {/* Learning Objectives */}
          {sections.find(s => s.id === 'objectives')?.visible && (
            <div className="form-section">
              <div className="form-section__header">
                <h3 className="form-section__title">🎯 Mục tiêu học tập</h3>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, objectives: [] }))}
                  className="section-remove-btn"
                  title="Xóa toàn bộ section Mục tiêu học tập"
                >
                  🗑️ Xóa section
                </button>
              </div>
              
              <div className="objectives-container">
                {(formData.objectives || []).map((obj, index) => (
                  <div key={index} className="objective-input-group">
                    <textarea
                      value={obj}
                      onChange={(e) => handleObjectiveChange(index, e.target.value)}
                      placeholder="Nhập mục tiêu học tập"
                      rows={2}
                      className="objective-input"
                    />
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="objective-remove-btn"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addObjective} className="add-objective-btn">
                  ➕ Thêm mục tiêu
                </button>
              </div>
            </div>
          )}

          {/* Custom Sections */}
          {sections
            .filter(section => section.type === 'custom' && section.visible)
            .map((section) => (
              <div key={section.id} className="form-section">
                <div className="form-section__header">
                  <h3 className="form-section__title">{section.icon} {section.title}</h3>
                  <button
                    type="button"
                    onClick={() => setSections(prev => prev.map(s => 
                      s.id === section.id ? { ...s, data: [] } : s
                    ))}
                    className="section-remove-btn"
                    title={`Xóa toàn bộ ${section.title}`}
                  >
                    🗑️ Xóa section
                  </button>
                </div>
                
                <div className="custom-section-container">
                  {section.data.map((item, index) => (
                    <div key={index} className="custom-section-input-group">
                      <textarea
                        value={item}
                        onChange={(e) => handleCustomSectionChange(section.id, index, e.target.value)}
                        placeholder={`Nhập ${section.title.toLowerCase()}`}
                        rows={2}
                        className="custom-section-input"
                      />
                      <button
                        type="button"
                        onClick={() => removeCustomSectionItem(section.id, index)}
                        className="custom-section-remove-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <button 
                    type="button" 
                    onClick={() => addCustomSectionItem(section.id)} 
                    className="add-custom-section-btn"
                  >
                    ➕ Thêm {section.title.toLowerCase()}
                  </button>
                </div>
              </div>
            ))}

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate('/teacher/courses')}
              className="teacher-dashboard__btn teacher-dashboard__btn--outline"
            >
              ↩️ Quay lại
            </button>
            <div className="form-actions__right">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="teacher-dashboard__btn teacher-dashboard__btn--secondary"
              >
                {saving ? '💾 Đang lưu...' : (!id || id === 'new' ? '💾 Tạo khóa học' : '💾 Lưu bản nháp')}
              </button>
              <button
                type="button"
                onClick={handlePublish}
                disabled={saving}
                className="teacher-dashboard__btn teacher-dashboard__btn--primary"
              >
                {saving ? '🚀 Đang xuất bản...' : '🚀 Xuất bản khóa học'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseEditor;
