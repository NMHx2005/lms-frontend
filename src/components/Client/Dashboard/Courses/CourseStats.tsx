import React, { useMemo } from 'react';
import { Course } from '@/types';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/CollectionsBookmark';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

interface CourseStatsProps { courses: Course[] }

const CourseStats: React.FC<CourseStatsProps> = ({ courses }) => {
  const totalCourses = courses.length;
  const totalUpvotes = useMemo(() => courses.reduce((sum, course) => sum + (course.upvotes || 0), 0), [courses]);
  const totalValue = useMemo(() => courses.reduce((sum, course) => sum + (course.price || 0), 0), [courses]);
  const mainDomain = useMemo(() => {
    if (totalCourses === 0) return 'N/A';
    const domainCounts: Record<string, number> = {};
    for (const course of courses) {
      domainCounts[course.domain] = (domainCounts[course.domain] || 0) + 1;
    }
    return Object.entries(domainCounts).sort((a, b) => b[1] - a[1])[0][0];
  }, [courses, totalCourses]);

  const stats = [
    { label: 'Khóa học đã mua', value: totalCourses, icon: <SchoolIcon />, color: 'primary.main' },
    { label: 'Tổng giá trị', value: `${(totalValue / 1000).toFixed(0)}k`, icon: <MonetizationOnIcon />, color: 'success.main' },
    { label: 'Tổng đánh giá', value: totalUpvotes, icon: <StarIcon />, color: 'warning.main' },
    { label: 'Lĩnh vực chính', value: mainDomain, icon: <LocalOfferIcon />, color: 'secondary.main' },
  ] as const;

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid key={index} item xs={12} sm={6} md={3}>
            <Card sx={{ borderRadius: 3, border: (t) => `1px solid ${t.palette.divider}` }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    bgcolor: (t) => `${stat.color}`,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 1,
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800} lineHeight={1}>{stat.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{stat.label}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack spacing={1.5}>
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip label="Gợi ý" color="info" size="small" />
              <Typography>
                {totalCourses > 0
                  ? `Bạn đã mua ${totalCourses} khóa học. Hãy tiếp tục học tập để nâng cao kỹ năng!`
                  : 'Bạn chưa mua khóa học nào. Hãy khám phá và đăng ký khóa học phù hợp!'}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Chip label="Tổng giá trị" color="success" size="small" />
              <Typography>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalValue)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {totalCourses > 0 && (
          <>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip label="Lĩnh vực chính" color="secondary" size="small" />
                  <Typography>{mainDomain}</Typography>
                </Stack>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardContent>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Chip label="Đánh giá TB/khóa" color="warning" size="small" />
                  <Typography>
                    {totalUpvotes > 0 ? Math.round(totalUpvotes / totalCourses) : 0}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </>
        )}
      </Stack>
    </Box>
  );
};

export default CourseStats;
