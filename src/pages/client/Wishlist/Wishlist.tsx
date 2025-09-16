import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { WishlistItem } from '../../../types/index';
import { wishlistService } from '../../../services/client/wishlist.service';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Alert,
  CircularProgress,
  Avatar,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Breadcrumbs,
  Link as MuiLink,
} from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import ExploreIcon from '@mui/icons-material/Explore';
import HomeIcon from '@mui/icons-material/Home';

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortBy, setSortBy] = useState<'addedAt' | 'price' | 'rating' | 'title'>('addedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState({
    totalItems: 0,
    totalValue: 0,
    onSaleCount: 0,
    categories: [] as string[]
  });
  const [error, setError] = useState<string | null>(null);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  // Fetch wishlist data
  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        sortBy,
        sortOrder,
        category: filterCategory || undefined,
        page: 1,
        limit: 100 // Get all items for now
      };

      const response = await wishlistService.getWishlist(params);

      if (response.success) {
        setWishlistItems(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch wishlist');
        toast.error(response.message || 'Failed to fetch wishlist');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to fetch wishlist';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error fetching wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist statistics
  const fetchWishlistStats = async () => {
    try {
      const response = await wishlistService.getWishlistStats();
      if (response.success) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching wishlist stats:', err);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchWishlist();
    fetchWishlistStats();
  }, []);

  // Filter and sort local data instead of refetching
  const filteredAndSortedItems = useMemo(() => {
    let filtered = wishlistItems;

    // Filter by category
    if (filterCategory) {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    // Sort items
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'addedAt':
          aValue = new Date(a.addedAt).getTime();
          bValue = new Date(b.addedAt).getTime();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [wishlistItems, filterCategory, sortBy, sortOrder]);

  // Remove item from wishlist
  const removeFromWishlist = async (itemId: string) => {
    try {
      const response = await wishlistService.removeFromWishlist(itemId);

      if (response.success) {
        setWishlistItems(prev => prev.filter(item => item._id !== itemId));
        toast.success('Course removed from wishlist');

        // Refresh stats after removal
        fetchWishlistStats();
      } else {
        toast.error(response.message || 'Failed to remove course');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to remove course';
      toast.error(errorMessage);
      console.error('Error removing from wishlist:', err);
    }
  };

  // Move item to cart
  const moveToCart = async (itemId: string) => {
    try {
      const response = await wishlistService.moveToCart(itemId);

      if (response.success) {
        toast.success('Course moved to cart successfully');
        // Optionally remove from wishlist after moving to cart
        setWishlistItems(prev => prev.filter(item => item._id !== itemId));
        fetchWishlistStats();
      } else {
        toast.error(response.message || 'Failed to move course to cart');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to move course to cart';
      toast.error(errorMessage);
      console.error('Error moving to cart:', err);
    }
  };

  // Clear all wishlist items
  const clearAllWishlist = async () => {
    try {
      const response = await wishlistService.clearWishlist();

      if (response.success) {
        setWishlistItems([]);
        setStats(prev => ({ ...prev, totalItems: 0, totalValue: 0, onSaleCount: 0 }));
        toast.success('Wishlist cleared successfully');
      } else {
        toast.error(response.message || 'Failed to clear wishlist');
      }
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || 'Failed to clear wishlist';
      toast.error(errorMessage);
      console.error('Error clearing wishlist:', err);
    }
  };

  // Get available categories from all items (not filtered)
  const categories = useMemo(() => {
    return [...new Set(wishlistItems.map(item => item.category))];
  }, [wishlistItems]);

  // Format date
  const formatDate = useCallback((dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }, []);

  // Format duration
  const formatDuration = useCallback((hours: number) => {
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return `${wholeHours}h ${minutes}m`;
  }, []);

  // Format price
  const formatPrice = useCallback((price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }, []);

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" alignItems="center" justifyContent="center" minHeight={400}>
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography variant="h6">Đang tải danh sách yêu thích...</Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Breadcrumbs sx={{ mb: 3 }}>
          <MuiLink color="inherit" href="/dashboard">Dashboard</MuiLink>
          <Typography color="text.primary">Danh sách yêu thích</Typography>
        </Breadcrumbs>

        <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
          Danh sách yêu thích
        </Typography>

        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="h6" gutterBottom>Đã xảy ra lỗi</Typography>
          <Typography>{error}</Typography>
        </Alert>

        <Button variant="contained" onClick={fetchWishlist}>
          🔄 Thử lại
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Breadcrumbs sx={{ mb: 3 }}>
        <MuiLink color="inherit" href="/dashboard">Dashboard</MuiLink>
        <Typography color="text.primary">Danh sách yêu thích</Typography>
      </Breadcrumbs>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
        Danh sách yêu thích
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Quản lý các khóa học bạn quan tâm
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'primary.main', color: 'white' }}>
                  <FavoriteIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800} lineHeight={1}>{stats.totalItems}</Typography>
                  <Typography color="text.secondary" variant="body2">Khóa học yêu thích</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'success.main', color: 'white' }}>
                  <LocalOfferIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800} lineHeight={1}>{formatPrice(stats.totalValue)}</Typography>
                  <Typography color="text.secondary" variant="body2">Tổng giá trị</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar sx={{ bgcolor: 'warning.main', color: 'white' }}>
                  <LocalOfferIcon />
                </Avatar>
                <Box>
                  <Typography variant="h4" fontWeight={800} lineHeight={1}>{stats.onSaleCount}</Typography>
                  <Typography color="text.secondary" variant="body2">Đang giảm giá</Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters and Controls */}
      <Card sx={{ mb: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>Bộ lọc và sắp xếp</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  label="Danh mục"
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="">Tất cả danh mục</MenuItem>
                  {categories.map(category => (
                    <MenuItem key={category} value={category}>{category}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth>
                <InputLabel>Sắp xếp theo</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  label="Sắp xếp theo"
                  MenuProps={{ disableScrollLock: true }}
                >
                  <MenuItem value="addedAt">Ngày thêm</MenuItem>
                  <MenuItem value="price">Giá</MenuItem>
                  <MenuItem value="rating">Đánh giá</MenuItem>
                  <MenuItem value="title">Tên khóa học</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                startIcon={<SortIcon />}
                fullWidth
              >
                {sortOrder === 'asc' ? 'Tăng dần' : 'Giảm dần'}
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setClearDialogOpen(true)}
                disabled={wishlistItems.length === 0}
                startIcon={<DeleteIcon />}
                fullWidth
              >
                Xóa tất cả
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Wishlist Items */}
      {wishlistItems.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box textAlign="center" py={6}>
              <FavoriteBorderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>Danh sách yêu thích trống</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Bạn chưa có khóa học nào trong danh sách yêu thích
              </Typography>
              <Button component={Link} to="/courses" variant="contained" startIcon={<ExploreIcon />}>
                Khám phá khóa học
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : filteredAndSortedItems.length === 0 ? (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box textAlign="center" py={6}>
              <FavoriteBorderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" gutterBottom>Không tìm thấy khóa học</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Không có khóa học nào phù hợp với bộ lọc hiện tại
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setFilterCategory('');
                  setSortBy('addedAt');
                  setSortOrder('desc');
                }}
              >
                Xóa bộ lọc
              </Button>
            </Box>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredAndSortedItems.map((item) => (
            <Grid key={item._id} item xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', borderRadius: 3, transition: 'all 0.3s ease', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
                <Box sx={{ position: 'relative' }}>
                  <CardMedia component="img" height="200" image={item.thumbnail || '/images/default-course.jpg'} alt={item.title} />
                  {item.isOnSale && (
                    <Chip
                      label={`-${item.discountPercentage}%`}
                      color="error"
                      size="small"
                      sx={{ position: 'absolute', top: 12, left: 12, fontWeight: 600 }}
                    />
                  )}
                  <IconButton
                    onClick={() => removeFromWishlist(item._id)}
                    sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(0,0,0,0.5)', color: 'white', '&:hover': { bgcolor: 'rgba(0,0,0,0.7)' } }}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>

                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom noWrap>
                    <Link to={`/courses/${item.courseId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {item.title}
                    </Link>
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip size="small" icon={<PersonIcon />} label={item.instructor} variant="outlined" />
                    <Chip size="small" label={item.level} color="primary" variant="outlined" />
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2" color="text.secondary">
                      {formatDuration(item.duration)}
                    </Typography>
                  </Stack>

                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                    <StarIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                    <Typography variant="body2" color="text.secondary">
                      {item.rating} ({item.totalStudents} học viên)
                    </Typography>
                  </Stack>

                  <Chip label={item.category} size="small" color="secondary" sx={{ mb: 2 }} />

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    {item.isOnSale ? (
                      <Box>
                        <Typography variant="h6" color="error" fontWeight={600}>
                          {formatPrice(item.price)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                          {formatPrice(item.originalPrice || 0)}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="h6" color="primary" fontWeight={600}>
                        {formatPrice(item.price)}
                      </Typography>
                    )}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    Thêm vào: {formatDate(item.addedAt)}
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: 2, pb: 2, pt: 0, gap: 1 }}>
                  <Button
                    variant="outlined"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => moveToCart(item._id)}
                    sx={{ flex: 1 }}
                  >
                    Thêm vào giỏ
                  </Button>
                  <Button
                    component={Link}
                    to={`/checkout/${item.courseId}`}
                    variant="contained"
                    startIcon={<ShoppingCartCheckoutIcon />}
                  >
                    Mua ngay
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Quick Actions */}
      <Card sx={{ mt: 4, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={700} gutterBottom>Hành động nhanh</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button
              component={Link}
              to="/courses"
              variant="outlined"
              startIcon={<ExploreIcon />}
              sx={{ flex: 1 }}
            >
              Khám phá thêm khóa học
            </Button>
            <Button
              component={Link}
              to="/dashboard/courses"
              variant="outlined"
              startIcon={<SchoolIcon />}
              sx={{ flex: 1 }}
            >
              Khóa học của tôi
            </Button>
            <Button
              component={Link}
              to="/dashboard"
              variant="outlined"
              startIcon={<HomeIcon />}
              sx={{ flex: 1 }}
            >
              Về Dashboard
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Clear All Dialog */}
      <Dialog open={clearDialogOpen} onClose={() => setClearDialogOpen(false)}>
        <DialogTitle>Xác nhận xóa tất cả</DialogTitle>
        <DialogContent>
          <Typography>
            Bạn có chắc chắn muốn xóa tất cả khóa học khỏi danh sách yêu thích? Hành động này không thể hoàn tác.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialogOpen(false)}>Hủy</Button>
          <Button
            onClick={() => {
              clearAllWishlist();
              setClearDialogOpen(false);
            }}
            color="error"
            variant="contained"
          >
            Xóa tất cả
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Wishlist;
