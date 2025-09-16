import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StudyGroup, CreateGroupForm } from '../../../types/index';
import { clientStudyGroupsService } from '../../../services/client/study-groups.service';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Typography,
  Button,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Avatar,
  Divider,
  Checkbox,
  FormControlLabel,
  Breadcrumbs,
  Link as MuiLink,
  CircularProgress,
} from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const StudyGroups: React.FC = () => {
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
    tags: [],
  });

  const [availableCourses] = useState([
    { _id: 'course1', title: 'React Advanced Patterns', thumbnail: '/images/course1.jpg' },
    { _id: 'course2', title: 'Node.js Backend Development', thumbnail: '/images/course2.jpg' },
    { _id: 'course3', title: 'UI/UX Design Fundamentals', thumbnail: '/images/course3.jpg' },
    { _id: 'course4', title: 'Machine Learning with Python', thumbnail: '/images/course4.jpg' },
  ]);

  const [availableTags] = useState([
    'React', 'Node.js', 'Python', 'Design', 'Machine Learning', 'Web Development', 'Mobile', 'Data Science',
  ]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Always load public groups first
      const pubRes = await Promise.allSettled([
        clientStudyGroupsService.listPublic({ page: 1, limit: 20 })
      ]);
      const pub = pubRes[0].status === 'fulfilled' ? pubRes[0].value : { data: { items: [] } } as any;

      // Check if user is authenticated
      const isAuthenticated = localStorage.getItem('token') || document.cookie.includes('token');

      let myItems: any[] = [];

      if (isAuthenticated) {
        // Try to load user's groups only if authenticated
        const [mineRes, joinedRes] = await Promise.allSettled([
          clientStudyGroupsService.listMine({ page: 1, limit: 20 }),
          clientStudyGroupsService.listJoined({ page: 1, limit: 20 })
        ]);

        const mine = mineRes.status === 'fulfilled' ? mineRes.value : null;
        const joined = joinedRes.status === 'fulfilled' ? joinedRes.value : null;

        myItems = ([] as any[])
          .concat(mine?.data?.items || [])
          .concat(joined?.data?.items || []);
      }

      const myMap: Record<string, any> = {};
      myItems.forEach((g: any) => { myMap[g._id] = g; });

      setMyGroups(myItems.map(mapApiGroupToUi));

      const allPublic = pub?.data?.items || [];
      setAvailableGroups(allPublic.filter((g: any) => !myMap[g._id]).map(mapApiGroupToUi));

      setLoading(false);
    };
    load();
  }, []);

  const mapApiGroupToUi = (g: any): StudyGroup => ({
    _id: g._id,
    name: g.name,
    description: g.description || '',
    courseId: g.courseId || '',
    courseTitle: g.course?.title || '',
    thumbnail: g.course?.thumbnail || '/images/course1.jpg',
    maxMembers: g.maxMembers || 20,
    currentMembers: (g.members || []).length,
    isPrivate: !!g.isPrivate,
    createdAt: g.createdAt,
    lastActivity: g.updatedAt || g.createdAt,
    tags: g.tags || [],
    owner: { _id: g.creatorId, name: g.creator?.name || 'Chủ nhóm', avatar: g.creator?.avatar || '/images/avatar1.jpg' },
    members: (g.members || []).map((m: any) => ({ _id: m, name: 'Thành viên', avatar: '/images/avatar1.jpg', role: 'member', joinedAt: g.createdAt })),
    recentDiscussions: [],
  });

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await clientStudyGroupsService.create({
        name: createForm.name,
        description: createForm.description,
        courseId: createForm.courseId,
        maxMembers: createForm.maxMembers,
        isPrivate: createForm.isPrivate,
        tags: createForm.tags,
      });
      const created = mapApiGroupToUi(res.data);
      setMyGroups(prev => [created, ...prev]);
    } catch (err) {
      // no-op: could show toast
    }

    setCreateForm({
      name: '',
      description: '',
      courseId: '',
      maxMembers: 10,
      isPrivate: false,
      tags: [],
    });

    setShowCreateForm(false);
    setActiveTab('my-groups');
  };

  const joinGroup = async (groupId: string) => {
    try {
      await clientStudyGroupsService.join(groupId);
      const group = availableGroups.find(g => g._id === groupId);
      if (!group) return;
      const updated: StudyGroup = { ...group, currentMembers: group.currentMembers + 1, members: group.members };
      setMyGroups(prev => [updated, ...prev]);
      setAvailableGroups(prev => prev.filter(g => g._id !== groupId));
    } catch { }
  };

  const leaveGroup = async (groupId: string) => {
    try {
      await clientStudyGroupsService.leave(groupId);
      const group = myGroups.find(g => g._id === groupId);
      if (!group) return;
      setMyGroups(prev => prev.filter(g => g._id !== groupId));
    } catch { }
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
      year: 'numeric',
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
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={400}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography variant="h6">Đang tải nhóm học tập...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink color="inherit" href="/dashboard">Dashboard</MuiLink>
        <Typography color="text.primary">Nhóm học tập</Typography>
      </Breadcrumbs>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Nhóm học tập
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Tham gia nhóm để chia sẻ kiến thức và hỗ trợ lẫn nhau
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}><GroupIcon /></Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800} lineHeight={1}>{myGroups.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Nhóm của tôi</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'success.main', color: 'white' }}><PublicIcon /></Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800} lineHeight={1}>{availableGroups.length}</Typography>
                  <Typography variant="body2" color="text.secondary">Nhóm có thể tham gia</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar sx={{ bgcolor: 'warning.main', color: 'white' }}><PeopleAltIcon /></Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800} lineHeight={1}>
                    {myGroups.reduce((t, g) => t + g.currentMembers, 0)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">Tổng thành viên</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => { setActiveTab(v); setShowCreateForm(v === 'create'); }}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          <Tab value="my-groups" label={`Nhóm của tôi (${myGroups.length})`} icon={<GroupIcon />} iconPosition="start" />
          <Tab value="discover" label={`Khám phá (${availableGroups.length})`} icon={<SearchIcon />} iconPosition="start" />
          <Tab value="create" label="Tạo nhóm mới" icon={<AddIcon />} iconPosition="start" />
        </Tabs>
      </Card>

      {/* Controls */}
      <Card sx={{ borderRadius: 3, mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>Bộ lọc và tìm kiếm</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Tìm kiếm và lọc nhóm học tập theo nhu cầu
          </Typography>

          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Tìm kiếm nhóm"
                placeholder="Nhập tên nhóm hoặc mô tả..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Khóa học</InputLabel>
                <Select
                  value={filterCourse}
                  label="Khóa học"
                  onChange={(e) => setFilterCourse(e.target.value)}
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="">Tất cả khóa học</MenuItem>
                  {availableCourses.map(c => (
                    <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
              Lọc theo tags
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableTags.map(tag => (
                <Chip
                  key={tag}
                  label={tag}
                  color={filterTags.includes(tag) ? 'primary' : 'default'}
                  variant={filterTags.includes(tag) ? 'filled' : 'outlined'}
                  onClick={() => toggleTag(tag)}
                  size="small"
                  sx={{
                    mb: 0.5,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: 2
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* My Groups */}
      {activeTab === 'my-groups' && (
        <Box>
          {filteredGroups(myGroups).length === 0 ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box textAlign="center" py={6}>
                  <GroupIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>Bạn chưa tham gia nhóm nào</Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>Khám phá và tham gia các nhóm học tập để bắt đầu</Typography>
                  <Button variant="contained" startIcon={<SearchIcon />} onClick={() => { setActiveTab('discover'); setShowCreateForm(false); }}>
                    Khám phá nhóm
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {filteredGroups(myGroups).map(group => (
                <Grid key={group._id} item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: 'all .2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia component="img" height={160} image={group.thumbnail} alt={group.courseTitle} />
                      <Stack direction="row" spacing={1} sx={{ position: 'absolute', top: 12, left: 12 }}>
                        <Chip size="small" label={group.courseTitle} color="secondary" />
                      </Stack>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom noWrap>{group.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>
                        {group.description}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip size="small" icon={<PeopleAltIcon />} label={`${group.currentMembers}/${group.maxMembers}`} />
                        <Chip size="small" icon={group.isPrivate ? <LockIcon /> : <PublicIcon />} label={group.isPrivate ? 'Riêng tư' : 'Công khai'} />
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {group.tags.slice(0, 4).map(tag => (
                          <Chip key={tag} size="small" label={tag} variant="outlined" />
                        ))}
                      </Stack>
                      <Divider sx={{ my: 1.5 }} />
                      <Typography variant="caption" color="text.secondary">Hoạt động cuối: {formatRelativeTime(group.lastActivity)}</Typography>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                      <Button component={Link} to={`/groups/${group._id}`} variant="outlined" startIcon={<VisibilityIcon />} sx={{ flex: 1 }}>
                        Xem nhóm
                      </Button>
                      <Button onClick={() => leaveGroup(group._id)} color="error" variant="contained" startIcon={<LogoutIcon />}>Rời nhóm</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Discover */}
      {activeTab === 'discover' && (
        <Box>
          {filteredGroups(availableGroups).length === 0 ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box textAlign="center" py={6}>
                  <SearchIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>Không tìm thấy nhóm phù hợp</Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>Thử thay đổi bộ lọc hoặc tạo nhóm mới</Typography>
                  <Button variant="contained" startIcon={<AddIcon />} onClick={() => { setActiveTab('create'); setShowCreateForm(true); }}>
                    Tạo nhóm mới
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {filteredGroups(availableGroups).map(group => (
                <Grid key={group._id} item xs={12} sm={6} md={4}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: 'all .2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia component="img" height={160} image={group.thumbnail} alt={group.courseTitle} />
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" fontWeight={700} gutterBottom noWrap>{group.name}</Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }} noWrap>{group.courseTitle}</Typography>
                      <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                        <Chip size="small" icon={<PeopleAltIcon />} label={`${group.currentMembers}/${group.maxMembers}`} />
                        <Chip size="small" icon={group.isPrivate ? <LockIcon /> : <PublicIcon />} label={group.isPrivate ? 'Riêng tư' : 'Công khai'} />
                      </Stack>
                      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                        {group.tags.slice(0, 4).map(tag => (
                          <Chip key={tag} size="small" label={tag} variant="outlined" />
                        ))}
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                      <Button onClick={() => joinGroup(group._id)} variant="contained" startIcon={<LoginIcon />} disabled={group.currentMembers >= group.maxMembers} sx={{ flex: 1 }}>
                        {group.currentMembers >= group.maxMembers ? 'Đã đầy' : 'Tham gia'}
                      </Button>
                      <Button component={Link} to={`/groups/${group._id}`} variant="outlined" startIcon={<VisibilityIcon />}>Xem chi tiết</Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {/* Create */}
      {activeTab === 'create' && showCreateForm && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Tạo nhóm học tập mới</Typography>
            <Box component="form" onSubmit={handleCreateGroup}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Tên nhóm *"
                    value={createForm.name}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Khóa học *</InputLabel>
                    <Select
                      value={createForm.courseId}
                      label="Khóa học *"
                      onChange={(e) => setCreateForm(prev => ({ ...prev, courseId: e.target.value }))}
                      required
                      MenuProps={{ disableScrollLock: true }}
                    >
                      <MenuItem value="">Chọn khóa học</MenuItem>
                      {availableCourses.map(course => (
                        <MenuItem key={course._id} value={course._id}>{course.title}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Mô tả *"
                    value={createForm.description}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, description: e.target.value }))}
                    required
                    multiline
                    rows={4}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Số thành viên tối đa"
                    value={createForm.maxMembers}
                    inputProps={{ min: 2, max: 50 }}
                    onChange={(e) => setCreateForm(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={createForm.isPrivate}
                        onChange={(e) => setCreateForm(prev => ({ ...prev, isPrivate: e.target.checked }))}
                      />
                    }
                    label="Nhóm riêng tư"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Tags</Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                    {availableTags.map(tag => (
                      <Chip
                        key={tag}
                        label={tag}
                        color={createForm.tags.includes(tag) ? 'primary' : 'default'}
                        variant={createForm.tags.includes(tag) ? 'filled' : 'outlined'}
                        onClick={() => {
                          setCreateForm(prev => ({
                            ...prev,
                            tags: prev.tags.includes(tag)
                              ? prev.tags.filter(t => t !== tag)
                              : [...prev.tags, tag],
                          }));
                        }}
                      />
                    ))}
                  </Stack>
                </Grid>
              </Grid>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
                <Button type="submit" variant="contained" startIcon={<AddIcon />} sx={{ flex: 1 }}>Tạo nhóm</Button>
                <Button type="button" variant="outlined" onClick={() => { setActiveTab('my-groups'); setShowCreateForm(false); }} sx={{ flex: 1 }}>Hủy</Button>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <Card sx={{ mt: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>Hành động nhanh</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button component={Link} to="/dashboard" variant="outlined" startIcon={<HomeIcon />} sx={{ flex: 1 }}>Về Dashboard</Button>
            <Button component={Link} to="/dashboard/courses" variant="outlined" startIcon={<SchoolIcon />} sx={{ flex: 1 }}>Khóa học của tôi</Button>
            <Button component={Link} to="/dashboard/calendar" variant="outlined" startIcon={<CalendarMonthIcon />} sx={{ flex: 1 }}>Lịch học</Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default StudyGroups;
