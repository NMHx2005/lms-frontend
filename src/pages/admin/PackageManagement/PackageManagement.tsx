import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Stack,
    Grid,
    TextField,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    Chip,
    CircularProgress,
    Checkbox,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableContainer,

    TablePagination,
    Paper,
    Tooltip,
    IconButton,
    Alert,
    Snackbar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Switch,
    Divider,

    Avatar,

} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import AddIcon from '@mui/icons-material/Add';

import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import RefreshIcon from '@mui/icons-material/Refresh';

import InventoryIcon from '@mui/icons-material/Inventory';

import GroupIcon from '@mui/icons-material/Group';
import PackageService, { Package, PackageStats } from '../../../services/admin/packageService';
import { adminPackagesManagementService } from '../../../services/admin/packages-management.service';

// Local interface for filters state
interface PackageFiltersState {
    search: string;
    status: string;
    priceRange: string;
    duration: string;
    sortBy: string;
    sortOrder: 'asc' | 'desc';
}

const PackageManagement: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [filters, setFilters] = useState<PackageFiltersState>({
        search: '',
        status: 'all',
        priceRange: 'all',
        duration: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc'
    });
    const [selectedPackages, setSelectedPackages] = useState<string[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPackages, setTotalPackages] = useState(0);
    const [packageStats] = useState<PackageStats | null>(null);
    // Create/Edit form state
    const [createForm, setCreateForm] = useState({
        name: '',
        description: '',
        price: '',
        maxCourses: '',
        billingCycle: 'monthly',
        isActive: true,
    });
    const [editForm, setEditForm] = useState({
        name: '',
        description: '',
        price: '',
        maxCourses: '',
        billingCycle: 'monthly',
        isActive: true,
    });

    // Modal states
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [packageSubscribers, setPackageSubscribers] = useState<any[]>([]);
    const [subscribersLoading, setSubscribersLoading] = useState(false);
    const [subscribersPage, setSubscribersPage] = useState(0);
    const [subscribersTotal, setSubscribersTotal] = useState(0);
    // Per-package stats: { [packageId]: { totalSold, totalRevenue } }
    const [statsByPackage, setStatsByPackage] = useState<Record<string, { totalSold: number; totalRevenue: number }>>({});
    const [statsLoading, setStatsLoading] = useState(false);
    console.log(statsLoading);
    // Load packages data
    const loadPackages = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await PackageService.getPackages({
                search: filters.search,
                status: filters.status,
            } as any);
            if (response.success) {
                let list = Array.isArray(response.data) ? response.data : [];

                // Apply client-side filters
                if (filters.priceRange !== 'all') {
                    const [min, max] = filters.priceRange.split('-').map(Number);
                    list = list.filter(pkg => {
                        if (filters.priceRange.endsWith('+')) {
                            return pkg.price >= min;
                        }
                        return pkg.price >= min && pkg.price <= max;
                    });
                }

                if (filters.duration !== 'all') {
                    // Note: duration filter not applicable to current data structure
                    // Keeping for future compatibility
                }

                // Apply sorting
                list.sort((a, b) => {
                    let aValue, bValue;
                    switch (filters.sortBy) {
                        case 'name':
                            aValue = a.name.toLowerCase();
                            bValue = b.name.toLowerCase();
                            break;
                        case 'price':
                            aValue = a.price;
                            bValue = b.price;
                            break;
                        case 'createdAt':
                        default:
                            aValue = new Date(a.createdAt).getTime();
                            bValue = new Date(b.createdAt).getTime();
                            break;
                    }

                    if (filters.sortOrder === 'asc') {
                        return aValue > bValue ? 1 : -1;
                    } else {
                        return aValue < bValue ? 1 : -1;
                    }
                });

                setPackages(list);
                setTotalPackages(list.length);
            } else {
                setError(response.error || 'Không thể tải danh sách gói');
            }
        } catch (err: any) {
            console.error('Error loading packages:', err);
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    // Load package stats
    const loadVisiblePackagesStats = async () => {
        if (packages.length === 0) return;
        try {
            setStatsLoading(true);
            const start = page * rowsPerPage;
            const end = Math.min(start + rowsPerPage, packages.length);
            const visible = packages.slice(start, end);

            const results = await Promise.all(
                visible.map(async (pkg) => {
                    try {
                        // Query only to get total via pagination
                        const res = await adminPackagesManagementService.getPackageSubscribers(pkg._id, {
                            status: 'active',
                            page: 1,
                            limit: 1,
                        });
                        const total = res?.data?.pagination?.total ?? 0;
                        return [pkg._id, { totalSold: total, totalRevenue: total * (pkg as any).price }] as const;
                    } catch {
                        return [pkg._id, { totalSold: 0, totalRevenue: 0 }] as const;
                    }
                })
            );

            setStatsByPackage((prev) => {
                const next = { ...prev };
                for (const [id, s] of results) next[id] = s;
                return next;
            });
        } finally {
            setStatsLoading(false);
        }
    };


    useEffect(() => {
        loadPackages();
    }, [page, rowsPerPage, filters]);

    useEffect(() => {
        loadVisiblePackagesStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [packages, page, rowsPerPage]);

    const handleFilterChange = (newFilters: Partial<PackageFiltersState>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setPage(0);
    };

    const handlePackageSelection = (packageId: string) => {
        setSelectedPackages(prev =>
            prev.includes(packageId)
                ? prev.filter(id => id !== packageId)
                : [...prev, packageId]
        );
    };

    const handleSelectAll = () => {
        const pagePackageIds = packages.map(p => p._id);
        const allSelected = pagePackageIds.every(id => selectedPackages.includes(id));
        if (allSelected) {
            setSelectedPackages(prev => prev.filter(id => !pagePackageIds.includes(id)));
        } else {
            setSelectedPackages(prev => Array.from(new Set([...prev, ...pagePackageIds])));
        }
    };

    const handleCloseSnackbar = () => {
        setError(null);
        setSuccessMessage(null);
    };

    const handleRefresh = () => {
        loadPackages();
    };

    const handleExportCSV = async () => {
        try {
            setActionLoading(true);
            // Try server-side export first
            try {
                const blob = await PackageService.exportPackages({
                    search: filters.search,
                    status: filters.status,
                });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `packages_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
                setSuccessMessage('Xuất CSV thành công');
            } catch (serverError) {
                // Fallback to client-side export
                PackageService.exportPackagesToCSV(packages);
                setSuccessMessage('Xuất CSV thành công (client-side)');
            }
        } catch (err: any) {
            setError(err.message || 'Không thể xuất CSV');
        } finally {
            setActionLoading(false);
        }
    };

    const handleClearFilters = () => {
        setFilters({
            search: '',
            status: 'all',
            priceRange: 'all',
            duration: 'all',
            sortBy: 'createdAt',
            sortOrder: 'desc'
        });
        setPage(0);
    };

    const handleView = async (pkg: Package) => {
        console.log('handleView called with package:', pkg);
        setSelectedPackage(pkg);
        setShowViewModal(true);
        await loadPackageSubscribers(pkg._id);
    };

    const loadPackageSubscribers = async (packageId: string) => {
        try {
            console.log('loadPackageSubscribers called with packageId:', packageId);
            setSubscribersLoading(true);
            const response = await adminPackagesManagementService.getPackageSubscribers(packageId, {
                page: subscribersPage + 1,
                limit: 10
            });

            console.log('getPackageSubscribers response:', response);
            if (response.success) {
                setPackageSubscribers(response.data.subscriptions || []);
                setSubscribersTotal(response.data.pagination?.total || 0);
            }
        } catch (err: any) {
            console.error('Error loading subscribers:', err);
            setError('Có lỗi xảy ra khi tải danh sách giáo viên đã đăng ký');
        } finally {
            setSubscribersLoading(false);
        }
    };

    const handleEditOpen = (pkg: Package) => {
        setSelectedPackage(pkg);
        setEditForm({
            name: pkg.name || '',
            description: pkg.description || '',
            price: String((pkg as any).price ?? ''),
            maxCourses: String((pkg as any).maxCourses ?? ''),
            billingCycle: (pkg as any).billingCycle || 'monthly',
            isActive: Boolean(pkg.isActive),
        });
        setShowEditModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa gói này?')) return;
        try {
            setActionLoading(true);
            const res = await PackageService.deletePackage(id);
            if (res.success) {
                setSuccessMessage(res.message || 'Đã xóa gói');
                await loadPackages();
            } else {
                setError(res.error || 'Không thể xóa gói');
            }
        } catch (err: any) {
            setError(err.message || 'Không thể xóa gói');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCreate = async () => {
        try {
            setActionLoading(true);
            const payload: any = {
                name: createForm.name.trim(),
                description: createForm.description.trim(),
                maxCourses: Number(createForm.maxCourses || 0),
                price: Number(createForm.price || 0),
                billingCycle: createForm.billingCycle,
                isActive: createForm.isActive,
            };
            const res = await PackageService.createPackage(payload);
            if (res.success) {
                setSuccessMessage('Tạo gói thành công');
                setShowCreateModal(false);
                setCreateForm({ name: '', description: '', price: '', maxCourses: '', billingCycle: 'monthly', isActive: true });
                await loadPackages();
            } else {
                setError(res.error || 'Không thể tạo gói');
            }
        } catch (err: any) {
            setError(err.message || 'Không thể tạo gói');
        } finally {
            setActionLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!selectedPackage) return;
        try {
            setActionLoading(true);
            const payload: any = {
                name: editForm.name.trim(),
                description: editForm.description.trim(),
                maxCourses: Number(editForm.maxCourses || 0),
                price: Number(editForm.price || 0),
                billingCycle: editForm.billingCycle,
                isActive: editForm.isActive,
            };
            const res = await PackageService.updatePackage(selectedPackage._id, payload);
            if (res.success) {
                setSuccessMessage('Cập nhật gói thành công');
                setShowEditModal(false);
                setSelectedPackage(null);
                await loadPackages();
            } else {
                setError(res.error || 'Không thể cập nhật gói');
            }
        } catch (err: any) {
            setError(err.message || 'Không thể cập nhật gói');
        } finally {
            setActionLoading(false);
        }
    };

    const handleToggleActive = async (pkg: Package) => {
        try {
            const res = await PackageService.updatePackage(pkg._id, { isActive: !pkg.isActive } as any);
            if (res.success) {
                await loadPackages();
            }
        } catch {
            /* ignore */
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getStatusLabel = (isActive: boolean) => {
        return isActive ? 'Hoạt động' : 'Tạm dừng';
    };


    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Header */}
            <Card sx={{ background: 'linear-gradient(135deg, #5b8def 0%, #8b5cf6 100%)', color: 'white', borderRadius: 2 }}>
                <CardContent>
                    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between" spacing={2}>
                        <Box>
                            <Typography variant="h5" fontWeight={600}>Quản lý Gói Khóa Học</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9 }}>Quản lý các gói khóa học và gói đăng ký</Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="contained"
                                color="inherit"
                                startIcon={<FileDownloadIcon />}
                                sx={{ color: '#111827' }}
                                onClick={handleExportCSV}
                                disabled={actionLoading}
                            >
                                {actionLoading ? <CircularProgress size={20} /> : 'Xuất CSV'}
                            </Button>
                            <Button variant="contained" color="inherit" startIcon={<RefreshIcon />} sx={{ color: '#111827' }} onClick={handleRefresh}>
                                Làm mới
                            </Button>
                            <Button variant="contained" color="secondary" startIcon={<AddIcon />} onClick={() => setShowCreateModal(true)}>
                                Thêm Gói
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>

            {/* Stats */}
            {packageStats && (
                <Grid container spacing={2}>
                    <Grid item xs={6} md={2.4}>
                        <Card>
                            <CardContent>
                                <Stack alignItems="center">
                                    <Typography variant="h6" fontWeight={800}>{packageStats.totalPackages}</Typography>
                                    <Typography variant="caption">Tổng gói</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={2.4}>
                        <Card>
                            <CardContent>
                                <Stack alignItems="center">
                                    <Typography variant="h6" fontWeight={800}>{packageStats.activePackages}</Typography>
                                    <Typography variant="caption">Đang hoạt động</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={2.4}>
                        <Card>
                            <CardContent>
                                <Stack alignItems="center">
                                    <Typography variant="h6" fontWeight={800}>{formatPrice(packageStats.totalRevenue)}</Typography>
                                    <Typography variant="caption">Tổng doanh thu</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={2.4}>
                        <Card>
                            <CardContent>
                                <Stack alignItems="center">
                                    <Typography variant="h6" fontWeight={800}>{packageStats.totalSold}</Typography>
                                    <Typography variant="caption">Đã bán</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={6} md={2.4}>
                        <Card>
                            <CardContent>
                                <Stack alignItems="center">
                                    <Typography variant="h6" fontWeight={800}>{formatPrice(packageStats.averagePrice)}</Typography>
                                    <Typography variant="caption">Giá trung bình</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Filters */}
            <Paper sx={{ p: 2, borderRadius: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6">Bộ lọc</Typography>
                    <Stack direction="row" spacing={1}>
                        <Button variant="outlined" startIcon={<ClearIcon />} onClick={handleClearFilters}>
                            Xóa bộ lọc
                        </Button>
                    </Stack>
                </Stack>

                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Tìm kiếm theo tên gói..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange({ search: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                )
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Trạng thái</InputLabel>
                            <Select
                                label="Trạng thái"
                                value={filters.status}
                                onChange={(e) => handleFilterChange({ status: e.target.value })}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="active">Hoạt động</MenuItem>
                                <MenuItem value="inactive">Tạm dừng</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Khoảng giá</InputLabel>
                            <Select
                                label="Khoảng giá"
                                value={filters.priceRange}
                                onChange={(e) => handleFilterChange({ priceRange: e.target.value })}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                <MenuItem value="0-100000">0 - 100k</MenuItem>
                                <MenuItem value="100000-500000">100k - 500k</MenuItem>
                                <MenuItem value="500000-1000000">500k - 1M</MenuItem>
                                <MenuItem value="1000000+">Trên 1M</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Sắp xếp theo</InputLabel>
                            <Select
                                label="Sắp xếp theo"
                                value={filters.sortBy}
                                onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
                            >
                                <MenuItem value="createdAt">Ngày tạo</MenuItem>
                                <MenuItem value="name">Tên gói</MenuItem>
                                <MenuItem value="price">Giá</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6} md={2}>
                        <FormControl fullWidth>
                            <InputLabel>Thứ tự</InputLabel>
                            <Select
                                label="Thứ tự"
                                value={filters.sortOrder}
                                onChange={(e) => handleFilterChange({ sortOrder: e.target.value as 'asc' | 'desc' })}
                            >
                                <MenuItem value="desc">Giảm dần</MenuItem>
                                <MenuItem value="asc">Tăng dần</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Packages Table */}
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                )}
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="checkbox">
                                <Checkbox
                                    checked={packages.length > 0 && selectedPackages.length === packages.length}
                                    indeterminate={selectedPackages.length > 0 && selectedPackages.length < packages.length}
                                    onChange={handleSelectAll}
                                />
                            </TableCell>
                            <TableCell>Thông tin gói</TableCell>
                            <TableCell>Giá</TableCell>
                            <TableCell>Thời hạn</TableCell>
                            <TableCell>Học viên</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Thống kê</TableCell>
                            <TableCell>Ngày tạo</TableCell>
                            <TableCell>Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {packages.map((pkg) => (
                            <TableRow key={pkg._id} hover>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedPackages.includes(pkg._id)}
                                        onChange={() => handlePackageSelection(pkg._id)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar src={pkg.thumbnail} sx={{ bgcolor: 'primary.main' }}>
                                            <InventoryIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography fontWeight={700}>{pkg.name}</Typography>
                                            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>
                                                {pkg.description}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Stack>
                                        <Typography fontWeight={700}>{formatPrice(pkg.price)}</Typography>
                                        {pkg.originalPrice && (
                                            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                                                {formatPrice(pkg.originalPrice)}
                                            </Typography>
                                        )}
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <FormControlLabel
                                        control={<Switch size="small" checked={pkg.isActive} onChange={() => handleToggleActive(pkg)} />}
                                        label={getStatusLabel(pkg.isActive)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <GroupIcon fontSize="small" color="action" />
                                        <Typography variant="body2">{(pkg as any).maxCourses ?? 0} học viên</Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={getStatusLabel(pkg.isActive)}
                                        color={pkg.isActive ? 'success' : 'error'}
                                        variant={pkg.isActive ? 'filled' : 'outlined'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={2}>
                                        <Stack direction="row" spacing={1}>
                                            <Typography variant="body2" color="text.secondary">Bán:</Typography>
                                            <Typography variant="body2" fontWeight={700}>
                                                {statsByPackage[pkg._id]?.totalSold ?? 0}
                                            </Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1}>
                                            <Typography variant="body2" color="text.secondary">Doanh thu:</Typography>
                                            <Typography variant="body2" fontWeight={700}>
                                                {formatPrice(statsByPackage[pkg._id]?.totalRevenue ?? 0)}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </TableCell>
                                <TableCell>{formatDate(pkg.createdAt)}</TableCell>
                                <TableCell>
                                    <Stack direction="row" spacing={0.5}>
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton color="info" size="small" onClick={() => handleView(pkg)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Chỉnh sửa">
                                            <IconButton color="primary" size="small" onClick={() => handleEditOpen(pkg)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Xóa">
                                            <IconButton color="error" size="small" onClick={() => handleDelete(pkg._id)}>
                                                <DeleteOutlineIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalPackages}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => setRowsPerPage(parseInt(e.target.value, 10))}
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    sx={{ px: 2 }}
                />
            </TableContainer>

            {/* Empty State */}
            {packages.length === 0 && !loading && (
                <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
                    <InventoryIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>Chưa có gói khóa học nào</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Bắt đầu tạo gói khóa học đầu tiên của bạn
                    </Typography>
                </Paper>
            )}

            {/* Snackbars */}
            <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            </Snackbar>

            <Snackbar open={!!successMessage} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>

            {/* Create Package Modal */}
            <Dialog open={showCreateModal} onClose={() => setShowCreateModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>Tạo Gói Khóa Học Mới</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tên gói"
                                value={createForm.name}
                                onChange={(e) => setCreateForm(v => ({ ...v, name: e.target.value }))}
                                required
                                helperText="Tên gói khóa học"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô tả"
                                multiline
                                rows={3}
                                value={createForm.description}
                                onChange={(e) => setCreateForm(v => ({ ...v, description: e.target.value }))}
                                helperText="Mô tả chi tiết về gói khóa học"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Giá (VND)"
                                type="number"
                                value={createForm.price}
                                onChange={(e) => setCreateForm(v => ({ ...v, price: e.target.value }))}
                                required
                                helperText="Giá bán của gói"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Số học viên tối đa"
                                type="text"
                                inputMode="numeric"
                                value={createForm.maxCourses}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '');
                                    setCreateForm(v => ({ ...v, maxCourses: digits }));
                                }}
                                helperText="Số học viên tối đa được phép"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Chu kỳ thanh toán</InputLabel>
                                <Select
                                    label="Chu kỳ thanh toán"
                                    value={createForm.billingCycle}
                                    onChange={(e) => setCreateForm(v => ({ ...v, billingCycle: e.target.value as any }))}
                                >
                                    <MenuItem value="monthly">Hàng tháng</MenuItem>
                                    <MenuItem value="yearly">Hàng năm</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={createForm.isActive} onChange={(e) => setCreateForm(v => ({ ...v, isActive: e.target.checked }))} />}
                                label="Trạng thái hoạt động"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowCreateModal(false)}>Hủy</Button>
                    <Button variant="contained" disabled={actionLoading} onClick={handleCreate}>
                        {actionLoading ? <CircularProgress size={20} /> : 'Tạo Gói'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Edit Package Modal */}
            <Dialog open={showEditModal} onClose={() => setShowEditModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chỉnh sửa Gói Khóa Học</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Tên gói"
                                value={editForm.name}
                                onChange={(e) => setEditForm(v => ({ ...v, name: e.target.value }))}
                                required
                                helperText="Tên gói khóa học"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Mô tả"
                                multiline
                                rows={3}
                                value={editForm.description}
                                onChange={(e) => setEditForm(v => ({ ...v, description: e.target.value }))}
                                helperText="Mô tả chi tiết về gói khóa học"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Giá (VND)"
                                type="number"
                                value={editForm.price}
                                onChange={(e) => setEditForm(v => ({ ...v, price: e.target.value }))}
                                required
                                helperText="Giá bán của gói"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Số học viên tối đa"
                                type="text"
                                inputMode="numeric"
                                value={editForm.maxCourses}
                                onChange={(e) => {
                                    const digits = e.target.value.replace(/\D/g, '');
                                    setEditForm(v => ({ ...v, maxCourses: digits }));
                                }}
                                helperText="Số học viên tối đa được phép"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Chu kỳ thanh toán</InputLabel>
                                <Select
                                    label="Chu kỳ thanh toán"
                                    value={editForm.billingCycle}
                                    onChange={(e) => setEditForm(v => ({ ...v, billingCycle: e.target.value as any }))}
                                >
                                    <MenuItem value="monthly">Hàng tháng</MenuItem>
                                    <MenuItem value="yearly">Hàng năm</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={editForm.isActive} onChange={(e) => setEditForm(v => ({ ...v, isActive: e.target.checked }))} />}
                                label="Trạng thái hoạt động"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowEditModal(false)}>Hủy</Button>
                    <Button variant="contained" disabled={actionLoading} onClick={handleUpdate}>
                        {actionLoading ? <CircularProgress size={20} /> : 'Cập nhật'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Package Modal */}
            <Dialog open={showViewModal} onClose={() => setShowViewModal(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết Gói Khóa Học</DialogTitle>
                <DialogContent>
                    {selectedPackage && (
                        <Grid container spacing={2} sx={{ mt: 1 }}>
                            <Grid item xs={12} sm={4}>
                                <Avatar src={selectedPackage.thumbnail} sx={{ width: 100, height: 100, mx: 'auto' }}>
                                    <InventoryIcon />
                                </Avatar>
                            </Grid>
                            <Grid item xs={12} sm={8}>
                                <Typography variant="h6" gutterBottom>{selectedPackage.name}</Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {selectedPackage.description}
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                    <Chip
                                        label={getStatusLabel(selectedPackage.isActive)}
                                        color={selectedPackage.isActive ? 'success' : 'error'}
                                        size="small"
                                    />
                                </Stack>
                            </Grid>
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>Thông tin chi tiết</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Giá:</Typography>
                                <Typography variant="h6">{formatPrice(selectedPackage.price)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Chu kỳ thanh toán:</Typography>
                                <Typography variant="h6">
                                    {(selectedPackage as any).billingCycle === 'monthly' ? 'Hàng tháng' : 'Hàng năm'}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Số học viên tối đa:</Typography>
                                <Typography variant="h6">{(selectedPackage as any).maxCourses || 0} học viên</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Phiên bản:</Typography>
                                <Typography variant="h6">v{(selectedPackage as any).version || 1}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Ngày tạo:</Typography>
                                <Typography variant="body2">{formatDate(selectedPackage.createdAt)}</Typography>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="body2" color="text.secondary">Cập nhật lần cuối:</Typography>
                                <Typography variant="body2">{formatDate(selectedPackage.updatedAt)}</Typography>
                            </Grid>
                            {(selectedPackage as any).features && (selectedPackage as any).features.length > 0 && (
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="h6" gutterBottom>Tính năng</Typography>
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        {(selectedPackage as any).features.map((feature: string, index: number) => (
                                            <Chip key={index} label={feature} size="small" variant="outlined" />
                                        ))}
                                    </Stack>
                                </Grid>
                            )}

                            {/* Danh sách giáo viên đã đăng ký */}
                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Giáo viên đã đăng ký ({subscribersTotal})
                                </Typography>

                                {subscribersLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
                                        <CircularProgress size={24} />
                                    </Box>
                                ) : packageSubscribers.length > 0 ? (
                                    <TableContainer component={Paper} variant="outlined">
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>Giáo viên</TableCell>
                                                    <TableCell>Trạng thái</TableCell>
                                                    <TableCell>Ngày bắt đầu</TableCell>
                                                    <TableCell>Ngày kết thúc</TableCell>
                                                    <TableCell>Ngày đăng ký</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {packageSubscribers.map((subscriber) => (
                                                    <TableRow key={subscriber.id}>
                                                        <TableCell>
                                                            <Stack direction="row" spacing={1} alignItems="center">
                                                                <Avatar
                                                                    src={subscriber.teacher?.avatar}
                                                                    sx={{ width: 32, height: 32 }}
                                                                >
                                                                    {subscriber.teacher?.firstName?.[0]}{subscriber.teacher?.lastName?.[0]}
                                                                </Avatar>
                                                                <Box>
                                                                    <Typography variant="body2" fontWeight={600}>
                                                                        {subscriber.teacher?.firstName} {subscriber.teacher?.lastName}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {subscriber.teacher?.email}
                                                                    </Typography>
                                                                </Box>
                                                            </Stack>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip
                                                                label={
                                                                    subscriber.status === 'active' ? 'Hoạt động' :
                                                                        subscriber.status === 'cancelled' ? 'Đã hủy' :
                                                                            subscriber.status === 'expired' ? 'Hết hạn' : subscriber.status
                                                                }
                                                                color={
                                                                    subscriber.status === 'active' ? 'success' :
                                                                        subscriber.status === 'cancelled' ? 'error' :
                                                                            subscriber.status === 'expired' ? 'warning' : 'default'
                                                                }
                                                                size="small"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {formatDate(subscriber.startAt)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {formatDate(subscriber.endAt)}
                                                            </Typography>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Typography variant="body2">
                                                                {formatDate(subscriber.createdAt)}
                                                            </Typography>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                        {subscribersTotal > 10 && (
                                            <TablePagination
                                                component="div"
                                                count={subscribersTotal}
                                                page={subscribersPage}
                                                onPageChange={(_, newPage) => {
                                                    setSubscribersPage(newPage);
                                                    if (selectedPackage) {
                                                        loadPackageSubscribers(selectedPackage._id);
                                                    }
                                                }}
                                                rowsPerPage={10}
                                                rowsPerPageOptions={[10]}
                                                labelRowsPerPage="Số dòng mỗi trang:"
                                                labelDisplayedRows={({ from, to, count }) =>
                                                    `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
                                                }
                                            />
                                        )}
                                    </TableContainer>
                                ) : (
                                    <Box sx={{ textAlign: 'center', py: 3 }}>
                                        <GroupIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Chưa có giáo viên nào đăng ký gói này
                                        </Typography>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowViewModal(false)}>Đóng</Button>
                    <Button onClick={() => {
                        setShowViewModal(false);
                        setShowEditModal(true);
                    }} variant="contained">
                        Chỉnh sửa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default PackageManagement;
