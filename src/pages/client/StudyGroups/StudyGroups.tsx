import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StudyGroup, CreateGroupForm } from '../../../types/index';
import './StudyGroups.css';

const StudyGroups: React.FC = () => {
  const [groups, setGroups] = useState<StudyGroup[]>([]);
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [availableGroups, setAvailableGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'my-groups' | 'discover' | 'create'>('my-groups');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCourse, setFilterCourse] = useState('');
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [createForm, setCreateForm] = useState<CreateGroupForm>({
    name: '',
    description: '',
    courseId: '',
    maxMembers: 10,
    isPrivate: false,
    tags: []
  });

  const [availableCourses] = useState([
    { _id: 'course1', title: 'React Advanced Patterns', thumbnail: '/images/course1.jpg' },
    { _id: 'course2', title: 'Node.js Backend Development', thumbnail: '/images/course2.jpg' },
    { _id: 'course3', title: 'UI/UX Design Fundamentals', thumbnail: '/images/course3.jpg' },
    { _id: 'course4', title: 'Machine Learning with Python', thumbnail: '/images/course4.jpg' }
  ]);

  const [availableTags] = useState([
    'React', 'Node.js', 'Python', 'Design', 'Machine Learning', 'Web Development', 'Mobile', 'Data Science'
  ]);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      const mockGroups: StudyGroup[] = [
        {
          _id: 'group1',
          name: 'React Masters',
          description: 'Nhóm học tập React nâng cao, chia sẻ kinh nghiệm và thực hành cùng nhau',
          courseId: 'course1',
          courseTitle: 'React Advanced Patterns',
          thumbnail: '/images/course1.jpg',
          maxMembers: 15,
          currentMembers: 12,
          isPrivate: false,
          createdAt: '2024-01-10T10:00:00Z',
          lastActivity: '2024-01-20T15:30:00Z',
          tags: ['React', 'Web Development'],
          owner: {
            _id: 'user1',
            name: 'Hieu Doan',
            avatar: '/images/avatar1.jpg'
          },
          members: [
            { _id: 'user1', name: 'Hieu Doan', avatar: '/images/avatar1.jpg', role: 'owner', joinedAt: '2024-01-10T10:00:00Z' },
            { _id: 'user2', name: 'Minh Nguyen', avatar: '/images/avatar2.jpg', role: 'admin', joinedAt: '2024-01-11T09:00:00Z' },
            { _id: 'user3', name: 'Lan Tran', avatar: '/images/avatar3.jpg', role: 'member', joinedAt: '2024-01-12T14:00:00Z' }
          ],
          recentDiscussions: [
            { _id: 'disc1', title: 'Custom Hooks best practices', author: 'Minh Nguyen', lastReply: '2024-01-20T15:30:00Z', repliesCount: 8 },
            { _id: 'disc2', title: 'State management với Context API', author: 'Lan Tran', lastReply: '2024-01-19T11:20:00Z', repliesCount: 12 }
          ]
        },
        {
          _id: 'group2',
          name: 'Backend Developers',
          description: 'Nhóm học Node.js và backend development, thảo luận về API design và database',
          courseId: 'course2',
          courseTitle: 'Node.js Backend Development',
          thumbnail: '/images/course2.jpg',
          maxMembers: 20,
          currentMembers: 18,
          isPrivate: false,
          createdAt: '2024-01-08T14:00:00Z',
          lastActivity: '2024-01-20T16:45:00Z',
          tags: ['Node.js', 'Backend Development'],
          owner: {
            _id: 'user2',
            name: 'Minh Nguyen',
            avatar: '/images/avatar2.jpg'
          },
          members: [
            { _id: 'user2', name: 'Minh Nguyen', avatar: '/images/avatar2.jpg', role: 'owner', joinedAt: '2024-01-08T14:00:00Z' },
            { _id: 'user1', name: 'Hieu Doan', avatar: '/images/avatar1.jpg', role: 'member', joinedAt: '2024-01-09T10:00:00Z' }
          ],
          recentDiscussions: [
            { _id: 'disc3', title: 'Express.js middleware patterns', author: 'Hieu Doan', lastReply: '2024-01-20T16:45:00Z', repliesCount: 15 },
            { _id: 'disc4', title: 'Database optimization tips', author: 'Minh Nguyen', lastReply: '2024-01-18T13:15:00Z', repliesCount: 9 }
          ]
        },
        {
          _id: 'group3',
          name: 'Design Thinkers',
          description: 'Nhóm học UI/UX design, chia sẻ inspiration và feedback cho nhau',
          courseId: 'course3',
          courseTitle: 'UI/UX Design Fundamentals',
          thumbnail: '/images/course3.jpg',
          maxMembers: 12,
          currentMembers: 8,
          isPrivate: true,
          createdAt: '2024-01-05T16:00:00Z',
          lastActivity: '2024-01-19T17:20:00Z',
          tags: ['Design', 'UI/UX'],
          owner: {
            _id: 'user3',
            name: 'Lan Tran',
            avatar: '/images/avatar3.jpg'
          },
          members: [
            { _id: 'user3', name: 'Lan Tran', avatar: '/images/avatar3.jpg', role: 'owner', joinedAt: '2024-01-05T16:00:00Z' },
            { _id: 'user1', name: 'Hieu Doan', avatar: '/images/avatar1.jpg', role: 'member', joinedAt: '2024-01-06T11:00:00Z' }
          ],
          recentDiscussions: [
            { _id: 'disc5', title: 'Color theory trong design', author: 'Lan Tran', lastReply: '2024-01-19T17:20:00Z', repliesCount: 6 },
            { _id: 'disc6', title: 'Prototyping tools comparison', author: 'Hieu Doan', lastReply: '2024-01-17T14:30:00Z', repliesCount: 11 }
          ]
        }
      ];

      // Separate groups into my groups and available groups
      const myGroupsData = mockGroups.filter(group => 
        group.members.some(member => member._id === 'user1')
      );
      const availableGroupsData = mockGroups.filter(group => 
        !group.members.some(member => member._id === 'user1')
      );

      setGroups(mockGroups);
      setMyGroups(myGroupsData);
      setAvailableGroups(availableGroupsData);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newGroup: StudyGroup = {
      _id: `group${Date.now()}`,
      name: createForm.name,
      description: createForm.description,
      courseId: createForm.courseId,
      courseTitle: availableCourses.find(c => c._id === createForm.courseId)?.title || '',
      thumbnail: availableCourses.find(c => c._id === createForm.courseId)?.thumbnail || '',
      maxMembers: createForm.maxMembers,
      currentMembers: 1,
      isPrivate: createForm.isPrivate,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      tags: createForm.tags,
      owner: {
        _id: 'user1',
        name: 'Hieu Doan',
        avatar: '/images/avatar1.jpg'
      },
      members: [{
        _id: 'user1',
        name: 'Hieu Doan',
        avatar: '/images/avatar1.jpg',
        role: 'owner',
        joinedAt: new Date().toISOString()
      }],
      recentDiscussions: []
    };

    setMyGroups(prev => [newGroup, ...prev]);
    setGroups(prev => [newGroup, ...prev]);
    
    // Reset form
    setCreateForm({
      name: '',
      description: '',
      courseId: '',
      maxMembers: 10,
      isPrivate: false,
      tags: []
    });
    
    setShowCreateForm(false);
    setActiveTab('my-groups');
  };

  const joinGroup = (groupId: string) => {
    const group = availableGroups.find(g => g._id === groupId);
    if (!group) return;

    const updatedGroup = {
      ...group,
      currentMembers: group.currentMembers + 1,
      members: [...group.members, {
        _id: 'user1',
        name: 'Hieu Doan',
        avatar: '/images/avatar1.jpg',
        role: 'member',
        joinedAt: new Date().toISOString()
      }]
    };

    setMyGroups(prev => [updatedGroup, ...prev]);
    setAvailableGroups(prev => prev.filter(g => g._id !== groupId));
    setGroups(prev => prev.map(g => g._id === groupId ? updatedGroup : g));
  };

  const leaveGroup = (groupId: string) => {
    const group = myGroups.find(g => g._id === groupId);
    if (!group) return;

    const updatedGroup = {
      ...group,
      currentMembers: group.currentMembers - 1,
      members: group.members.filter(m => m._id !== 'user1')
    };

    if (group.members.length === 1) {
      // If only one member left, remove the group entirely
      setMyGroups(prev => prev.filter(g => g._id !== groupId));
      setGroups(prev => prev.filter(g => g._id !== groupId));
    } else {
      setMyGroups(prev => prev.map(g => g._id === groupId ? updatedGroup : g));
      setGroups(prev => prev.map(g => g._id === groupId ? updatedGroup : g));
    }
  };

  const toggleTag = (tag: string) => {
    setFilterTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredGroups = (groupsToFilter: StudyGroup[]) => {
    return groupsToFilter.filter(group => {
      const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           group.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCourse = !filterCourse || group.courseId === filterCourse;
      
      const matchesTags = filterTags.length === 0 || 
                         filterTags.some(tag => group.tags.includes(tag));
      
      return matchesSearch && matchesCourse && matchesTags;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} ngày trước`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="study-groups-page">
        <div className="groups-loading">
          <div className="loading-spinner"></div>
          <p>Đang tải nhóm học tập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="study-groups-page">
      <div className="groups-header">
        <h1>Nhóm học tập 👥</h1>
        <p>Tham gia nhóm học tập để chia sẻ kiến thức và hỗ trợ lẫn nhau</p>
      </div>

      {/* Stats */}
      <div className="groups-stats">
        <div className="stat-item">
          <span className="stat-number">{myGroups.length}</span>
          <span className="stat-label">Nhóm của tôi</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{availableGroups.length}</span>
          <span className="stat-label">Nhóm có thể tham gia</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">
            {myGroups.reduce((total, group) => total + group.currentMembers, 0)}
          </span>
          <span className="stat-label">Tổng thành viên</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="groups-tabs">
        <button 
          className={`tab-btn ${activeTab === 'my-groups' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-groups')}
        >
          👥 Nhóm của tôi ({myGroups.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'discover' ? 'active' : ''}`}
          onClick={() => setActiveTab('discover')}
        >
          🔍 Khám phá ({availableGroups.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          ➕ Tạo nhóm mới
        </button>
      </div>

      {/* Search and Filters */}
      <div className="groups-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm nhóm..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters">
          <select 
            value={filterCourse} 
            onChange={(e) => setFilterCourse(e.target.value)}
            className="course-filter"
          >
            <option value="">Tất cả khóa học</option>
            {availableCourses.map(course => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>

          <div className="tags-filter">
            {availableTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`tag-btn ${filterTags.includes(tag) ? 'active' : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'my-groups' && (
        <div className="my-groups">
          {filteredGroups(myGroups).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">👥</div>
              <h3>Bạn chưa tham gia nhóm nào</h3>
              <p>Khám phá và tham gia các nhóm học tập để bắt đầu</p>
              <button 
                onClick={() => setActiveTab('discover')}
                className="discover-btn"
              >
                🔍 Khám phá nhóm
              </button>
            </div>
          ) : (
            <div className="groups-grid">
              {filteredGroups(myGroups).map(group => (
                <div key={group._id} className="group-card my-group">
                  <div className="group-header">
                    <div className="group-thumbnail">
                      <img src={group.thumbnail} alt={group.courseTitle} />
                    </div>
                    <div className="group-info">
                      <h3 className="group-name">{group.name}</h3>
                      <p className="course-title">{group.courseTitle}</p>
                      <div className="group-meta">
                        <span className="members-count">
                          👥 {group.currentMembers}/{group.maxMembers} thành viên
                        </span>
                        <span className="privacy">
                          {group.isPrivate ? '🔒 Riêng tư' : '🌐 Công khai'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="group-description">{group.description}</p>

                  <div className="group-tags">
                    {group.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>

                  <div className="group-activity">
                    <span className="last-activity">
                      Hoạt động cuối: {formatRelativeTime(group.lastActivity)}
                    </span>
                  </div>

                  <div className="recent-discussions">
                    <h4>Thảo luận gần đây:</h4>
                    {group.recentDiscussions.slice(0, 2).map(discussion => (
                      <div key={discussion._id} className="discussion-item">
                        <span className="discussion-title">{discussion.title}</span>
                        <span className="discussion-meta">
                          {discussion.author} • {discussion.repliesCount} trả lời
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="group-actions">
                    <Link to={`/groups/${group._id}`} className="view-group-btn">
                      👁️ Xem nhóm
                    </Link>
                    <button 
                      onClick={() => leaveGroup(group._id)}
                      className="leave-group-btn"
                    >
                      🚪 Rời nhóm
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'discover' && (
        <div className="discover-groups">
          {filteredGroups(availableGroups).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <h3>Không tìm thấy nhóm phù hợp</h3>
              <p>Thử thay đổi bộ lọc hoặc tạo nhóm mới</p>
              <button 
                onClick={() => setActiveTab('create')}
                className="create-group-btn"
              >
                ➕ Tạo nhóm mới
              </button>
            </div>
          ) : (
            <div className="groups-grid">
              {filteredGroups(availableGroups).map(group => (
                <div key={group._id} className="group-card available-group">
                  <div className="group-header">
                    <div className="group-thumbnail">
                      <img src={group.thumbnail} alt={group.courseTitle} />
                    </div>
                    <div className="group-info">
                      <h3 className="group-name">{group.name}</h3>
                      <p className="course-title">{group.courseTitle}</p>
                      <div className="group-meta">
                        <span className="members-count">
                          👥 {group.currentMembers}/{group.maxMembers} thành viên
                        </span>
                        <span className="privacy">
                          {group.isPrivate ? '🔒 Riêng tư' : '🌐 Công khai'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="group-description">{group.description}</p>

                  <div className="group-tags">
                    {group.tags.map(tag => (
                      <span key={tag} className="tag">{tag}</span>
                    ))}
                  </div>

                  <div className="group-owner">
                    <span className="owner-label">Chủ nhóm:</span>
                    <div className="owner-info">
                      <img src={group.owner.avatar} alt={group.owner.name} className="owner-avatar" />
                      <span className="owner-name">{group.owner.name}</span>
                    </div>
                  </div>

                  <div className="group-actions">
                    <button 
                      onClick={() => joinGroup(group._id)}
                      className="join-group-btn"
                      disabled={group.currentMembers >= group.maxMembers}
                    >
                      {group.currentMembers >= group.maxMembers ? 'Đã đầy' : '➕ Tham gia'}
                    </button>
                    <Link to={`/groups/${group._id}`} className="view-group-btn">
                      👁️ Xem chi tiết
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'create' && (
        <div className="create-group">
          <div className="create-form-container">
            <h3>Tạo nhóm học tập mới</h3>
            <form onSubmit={handleCreateGroup} className="create-form">
              <div className="form-group">
                <label htmlFor="groupName">Tên nhóm *</label>
                <input
                  type="text"
                  id="groupName"
                  value={createForm.name}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nhập tên nhóm..."
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="groupDescription">Mô tả *</label>
                <textarea
                  id="groupDescription"
                  value={createForm.description}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Mô tả mục đích và hoạt động của nhóm..."
                  required
                  rows={4}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label htmlFor="courseSelect">Khóa học *</label>
                <select
                  id="courseSelect"
                  value={createForm.courseId}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, courseId: e.target.value }))}
                  required
                  className="form-select"
                >
                  <option value="">Chọn khóa học</option>
                  {availableCourses.map(course => (
                    <option key={course._id} value={course._id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="maxMembers">Số thành viên tối đa</label>
                  <input
                    type="number"
                    id="maxMembers"
                    value={createForm.maxMembers}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                    min="2"
                    max="50"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={createForm.isPrivate}
                      onChange={(e) => setCreateForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                      className="form-checkbox"
                    />
                    Nhóm riêng tư
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <div className="tags-selection">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setCreateForm(prev => ({
                          ...prev,
                          tags: prev.tags.includes(tag)
                            ? prev.tags.filter(t => t !== tag)
                            : [...prev.tags, tag]
                        }));
                      }}
                      className={`tag-select-btn ${createForm.tags.includes(tag) ? 'selected' : ''}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="create-btn">
                  ➕ Tạo nhóm
                </button>
                <button 
                  type="button" 
                  onClick={() => setActiveTab('my-groups')}
                  className="cancel-btn"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <Link to="/dashboard" className="back-dashboard-btn">
          🏠 Về Dashboard
        </Link>
        <Link to="/dashboard/courses" className="my-courses-btn">
          📚 Khóa học của tôi
        </Link>
        <Link to="/dashboard/calendar" className="calendar-btn">
          📅 Lịch học
        </Link>
      </div>
    </div>
  );
};

export default StudyGroups;
