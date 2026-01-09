import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Assignment as AssignmentIcon,
} from '@mui/icons-material';
import AssignmentGrading from '@/components/Assignment/AssignmentGrading';
import AssignmentAnalytics from '@/components/Assignment/AssignmentAnalytics';
import { assignmentGradingService } from '@/services/client/assignment-grading.service';
import { assignmentAnalyticsService } from '@/services/client/assignment-analytics.service';
import { toast } from 'react-hot-toast';

const AssignmentGradingPage: React.FC = () => {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [assignment, setAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'grading' | 'analytics'>('grading');

  useEffect(() => {
    if (assignmentId) {
      loadData();
    }
  }, [assignmentId]);

  const loadData = async () => {
    if (!assignmentId) return;

    try {
      setLoading(true);
      setError(null);

      // Load assignment (you might need to create this endpoint)
      // For now, we'll use the assignmentId directly
      // Load submissions
      const submissionsResponse = await assignmentGradingService.getSubmissions(assignmentId);
      if (submissionsResponse.success) {
        setSubmissions(submissionsResponse.data || []);
      }

      // Load analytics
      const analyticsResponse = await assignmentAnalyticsService.getAnalytics(assignmentId);
      if (analyticsResponse.success) {
        setAnalytics(analyticsResponse.data);
      }

      // Set assignment data (you might need to fetch this separately)
      setAssignment({
        _id: assignmentId,
        title: 'Assignment', // This should come from API
        maxScore: 100,
        anonymousGrading: false,
      });
    } catch (error: any) {
      setError(error.message || 'Lỗi khi tải dữ liệu');
      toast.error('Lỗi khi tải dữ liệu bài tập');
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async (submissionId: string, score: number, feedback: string, rubricScore?: any[]) => {
    try {
      await assignmentGradingService.gradeSubmission(submissionId, {
        score,
        feedback,
        rubricScore,
      });
      toast.success('Chấm điểm thành công!');
      loadData(); // Reload data
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi chấm điểm');
      throw error;
    }
  };

  const handleBulkGrade = async (submissionIds: string[], score: number, feedback: string) => {
    try {
      await assignmentGradingService.bulkGrade(submissionIds, score, feedback);
      toast.success(`Đã chấm ${submissionIds.length} bài nộp!`);
      loadData(); // Reload data
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi chấm điểm hàng loạt');
      throw error;
    }
  };

  const handleExport = async () => {
    try {
      // Implement export functionality
      toast.success('Đang xuất file Excel...');
    } catch (error: any) {
      toast.error('Lỗi khi xuất file');
    }
  };

  const handleDownloadAll = async () => {
    try {
      // Implement download all files functionality
      toast.success('Đang tải tất cả files...');
    } catch (error: any) {
      toast.error('Lỗi khi tải files');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!assignment) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="warning">Không tìm thấy bài tập</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link
          color="inherit"
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(-1);
          }}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          <ArrowBackIcon fontSize="small" />
          Quay lại
        </Link>
        <Typography color="text.primary">Chấm bài tập</Typography>
      </Breadcrumbs>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <AssignmentIcon color="primary" />
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {assignment.title}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography
            variant="body1"
            sx={{
              cursor: 'pointer',
              fontWeight: activeTab === 'grading' ? 600 : 400,
              borderBottom: activeTab === 'grading' ? '2px solid' : 'none',
              pb: 1,
            }}
            onClick={() => setActiveTab('grading')}
          >
            Chấm bài
          </Typography>
          <Typography
            variant="body1"
            sx={{
              cursor: 'pointer',
              fontWeight: activeTab === 'analytics' ? 600 : 400,
              borderBottom: activeTab === 'analytics' ? '2px solid' : 'none',
              pb: 1,
            }}
            onClick={() => setActiveTab('analytics')}
          >
            Phân tích
          </Typography>
        </Box>
      </Paper>

      {activeTab === 'grading' ? (
        <AssignmentGrading
          assignment={assignment}
          submissions={submissions}
          onGrade={handleGrade}
          onBulkGrade={handleBulkGrade}
          onExport={handleExport}
          onDownloadAll={handleDownloadAll}
        />
      ) : (
        analytics && (
          <AssignmentAnalytics
            assignment={assignment}
            analytics={analytics}
          />
        )
      )}
    </Container>
  );
};

export default AssignmentGradingPage;
