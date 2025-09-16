import React, { useEffect, useMemo, useState } from 'react';
import { Container, Box, Typography, Breadcrumbs, Grid, Card, CardContent, FormControl, InputLabel, Select, MenuItem, TextField, Stack, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Chip } from '@mui/material';

interface Txn { id: string; courseTitle: string; studentName: string; amount: number; type: 'purchase' | 'refund' | 'commission'; status: 'completed' | 'pending' | 'failed'; date: string; transactionId: string }

const EarningsTransactions: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [txns, setTxns] = useState<Txn[]>([]);
    const [typeFilter, setTypeFilter] = useState<'all' | 'purchase' | 'refund' | 'commission'>('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');
    const [query, setQuery] = useState('');

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setTxns([
                { id: '1', courseTitle: 'React Advanced Patterns', studentName: 'Nguyễn Văn A', amount: 299000, type: 'purchase', status: 'completed', date: '2024-01-15T10:30:00Z', transactionId: 'TXN_001' },
                { id: '2', courseTitle: 'Python Data Science', studentName: 'Trần Thị B', amount: 499000, type: 'purchase', status: 'completed', date: '2024-01-14T14:20:00Z', transactionId: 'TXN_002' },
                { id: '3', courseTitle: 'React Advanced Patterns', studentName: 'Lê Văn C', amount: 299000, type: 'refund', status: 'completed', date: '2024-01-13T16:45:00Z', transactionId: 'TXN_003' },
                { id: '4', courseTitle: 'UI/UX Design Fundamentals', studentName: 'Phạm Thị D', amount: 199000, type: 'purchase', status: 'pending', date: '2024-01-12T08:15:00Z', transactionId: 'TXN_004' }
            ]);
            setLoading(false);
        }, 600);
    }, []);

    const formatCurrency = (n: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
    const formatDate = (s: string) => new Date(s).toLocaleString('vi-VN');

    const filtered = useMemo(() => txns.filter(t => {
        const matchesType = typeFilter === 'all' || t.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        const matchesQuery = [t.courseTitle, t.studentName, t.transactionId].some(v => v.toLowerCase().includes(query.toLowerCase()));
        return matchesType && matchesStatus && matchesQuery;
    }), [txns, typeFilter, statusFilter, query]);

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">Giao dịch</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Giao dịch</Typography>
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}><TextField fullWidth label="Tìm kiếm" placeholder="Tên khóa học, học viên, ID..." value={query} onChange={(e) => setQuery(e.target.value)} /></Grid>
                        <Grid item xs={12} md={4}><FormControl fullWidth><InputLabel>Loại</InputLabel><Select label="Loại" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả</MenuItem><MenuItem value="purchase">Mua</MenuItem><MenuItem value="refund">Hoàn tiền</MenuItem><MenuItem value="commission">Hoa hồng</MenuItem></Select></FormControl></Grid>
                        <Grid item xs={12} md={4}><FormControl fullWidth><InputLabel>Trạng thái</InputLabel><Select label="Trạng thái" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả</MenuItem><MenuItem value="completed">Hoàn thành</MenuItem><MenuItem value="pending">Chờ xử lý</MenuItem><MenuItem value="failed">Thất bại</MenuItem></Select></FormControl></Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card>
                <CardContent>
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Khóa học</TableCell>
                                    <TableCell>Học viên</TableCell>
                                    <TableCell align="right">Số tiền</TableCell>
                                    <TableCell>Loại</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                    <TableCell>Thời gian</TableCell>
                                    <TableCell>ID giao dịch</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filtered.map(t => (
                                    <TableRow key={t.id} hover>
                                        <TableCell>{t.courseTitle}</TableCell>
                                        <TableCell>{t.studentName}</TableCell>
                                        <TableCell align="right">{(t.type === 'refund' ? '-' : '+')}{formatCurrency(t.amount)}</TableCell>
                                        <TableCell><Chip size="small" label={t.type === 'purchase' ? 'Mua' : t.type === 'refund' ? 'Hoàn tiền' : 'Hoa hồng'} color={t.type === 'refund' ? 'warning' : 'primary'} /></TableCell>
                                        <TableCell><Chip size="small" label={t.status === 'completed' ? 'Hoàn thành' : t.status === 'pending' ? 'Chờ xử lý' : 'Thất bại'} color={t.status === 'completed' ? 'success' : t.status === 'pending' ? 'warning' : 'error'} /></TableCell>
                                        <TableCell>{formatDate(t.date)}</TableCell>
                                        <TableCell>{t.transactionId}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Container>
    );
};

export default EarningsTransactions;
