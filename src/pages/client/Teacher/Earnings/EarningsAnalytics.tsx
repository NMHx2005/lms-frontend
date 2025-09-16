import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Breadcrumbs, Grid, Card, CardContent, Chip, Stack, LinearProgress } from '@mui/material';

interface Series { month: string; revenue: number; refunds: number; payouts: number }

const EarningsAnalytics: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [series, setSeries] = useState<Series[]>([]);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setSeries([
                { month: 'Jan', revenue: 3200, refunds: 200, payouts: 2800 },
                { month: 'Feb', revenue: 4100, refunds: 150, payouts: 3600 },
                { month: 'Mar', revenue: 3800, refunds: 300, payouts: 3300 },
                { month: 'Apr', revenue: 5200, refunds: 220, payouts: 4700 },
                { month: 'May', revenue: 4800, refunds: 180, payouts: 4300 },
                { month: 'Jun', revenue: 6100, refunds: 240, payouts: 5600 },
            ]);
            setLoading(false);
        }, 600);
    }, []);

    if (loading) {
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Typography>Đang tải...</Typography>
            </Container>
        );
    }

    const totalRevenue = series.reduce((s, d) => s + d.revenue, 0);
    const totalRefunds = series.reduce((s, d) => s + d.refunds, 0);
    const totalPayouts = series.reduce((s, d) => s + d.payouts, 0);

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">Doanh thu - Phân tích</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Phân tích doanh thu</Typography>
            </Box>

            {/* KPIs */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid item xs={12} md={4}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="subtitle2" color="text.secondary">Tổng doanh thu 6 tháng</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(totalRevenue)}</Typography></CardContent></Card></Grid>
                <Grid item xs={12} md={4}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="subtitle2" color="text.secondary">Tổng hoàn tiền</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(totalRefunds)}</Typography></CardContent></Card></Grid>
                <Grid item xs={12} md={4}><Card><CardContent sx={{ textAlign: 'center' }}><Typography variant="subtitle2" color="text.secondary">Tổng chi trả</Typography><Typography variant="h5" sx={{ fontWeight: 700 }}>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(totalPayouts)}</Typography></CardContent></Card></Grid>
            </Grid>

            {/* Charts placeholders */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}><Card><CardContent><Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Doanh thu theo tháng</Typography><Stack spacing={1}>{series.map(d => (<Box key={d.month}><Stack direction="row" justifyContent="space-between"><Typography variant="body2">{d.month}</Typography><Typography variant="body2" color="text.secondary">${d.revenue}</Typography></Stack><LinearProgress variant="determinate" value={Math.min(100, (d.revenue / 6500) * 100)} sx={{ height: 8, borderRadius: 4 }} /></Box>))}</Stack></CardContent></Card></Grid>
                <Grid item xs={12} md={6}><Card><CardContent><Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Hoàn tiền và chi trả</Typography><Stack spacing={1}>{series.map(d => (<Box key={d.month}><Typography variant="body2" sx={{ mb: .5 }}>{d.month}</Typography><Stack direction="row" spacing={1} alignItems="center"><LinearProgress variant="determinate" value={Math.min(100, (d.refunds / 800) * 100)} color="warning" sx={{ height: 8, borderRadius: 4, flex: 1 }} /><Chip size="small" label={`Refund $${d.refunds}`} /></Stack><Stack direction="row" spacing={1} alignItems="center" sx={{ mt: .5 }}><LinearProgress variant="determinate" value={Math.min(100, (d.payouts / 6500) * 100)} color="success" sx={{ height: 8, borderRadius: 4, flex: 1 }} /><Chip size="small" label={`Payout $${d.payouts}`} /></Stack></Box>))}</Stack></CardContent></Card></Grid>
            </Grid>
        </Container>
    );
};

export default EarningsAnalytics;
