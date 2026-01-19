import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Switch,
  Slider,
  Button,
  Typography,
  Grid,
  Tabs,
  Tab,
  TextField,
  Chip,
  LinearProgress,
  Alert,
  Paper,
  FormControlLabel,
  Divider,
  CircularProgress
} from '@mui/material';
import {
  SmartToy as RobotIcon,
  FlashOn as ThunderboltIcon,
  CheckCircle as CheckCircleIcon,
  Sync as SyncIcon,
  Settings as SettingsIcon,
  BarChart as BarChartIcon
} from '@mui/icons-material';
import api from '../../../services/api';
import { toast } from 'react-hot-toast';

interface AISettings {
  enabled: boolean;
  provider: 'openai' | 'gemini';
  model?: string;
  autoApproval: {
    enabled: boolean;
    threshold: number;
    minRequirements: {
      hasDescription: boolean;
      hasLearningObjectives: boolean;
      minLessons: number;
      minSections: number;
    };
  };
  rateLimit: {
    requestsPerDay: number;
    currentUsage: number;
    lastReset: Date;
  };
}

interface AIStatistics {
  settings: AISettings;
  evaluations: {
    total: number;
    processing: number;
    completed: number;
    failed: number;
  };
  decisions: {
    autoApproved: number;
    manualApproved: number;
    rejected: number;
    needsRevision: number;
    autoApprovalRate: string;
  };
  performance: {
    avgProcessingTime: number;
    avgAIScore: string;
    todayUsage: number;
  };
}

const AIManagement: React.FC = () => {
  const [settings, setSettings] = useState<AISettings | null>(null);
  const [statistics, setStatistics] = useState<AIStatistics | null>(null);
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadSettings();
    loadStatistics();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/ai-management/settings');
      const data = response.data.data;

      // Set default model if not exists
      if (!data.model) {
        data.model = 'gemini-2.0-flash';
      }

      setSettings(data);
    } catch (error: any) {
      toast.error('Không thể tải cấu hình AI');
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    try {
      const response = await api.get('/admin/ai-management/statistics');
      setStatistics(response.data.data);
    } catch (error: any) {
      console.error('Error loading statistics:', error);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await api.put('/admin/ai-management/settings', settings);
      toast.success('Đã lưu cấu hình AI');
      loadStatistics();
    } catch (error: any) {
      toast.error('Không thể lưu cấu hình');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    try {
      setTesting(true);
      const response = await api.post('/admin/ai-management/test-connection');
      if (response.data.data.success) {
        toast.success(`Kết nối ${response.data.data.provider} thành công!`);
      } else {
        toast.error(response.data.data.message || 'Kết nối thất bại');
      }
    } catch (error: any) {
      toast.error('Lỗi khi test kết nối');
    } finally {
      setTesting(false);
    }
  };

  if (loading || !settings) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="400px">
        <CircularProgress size={60} />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Đang tải cấu hình AI...
        </Typography>
      </Box>
    );
  }

  const usagePercentage = settings.rateLimit.requestsPerDay > 0
    ? (settings.rateLimit.currentUsage / settings.rateLimit.requestsPerDay) * 100
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          <RobotIcon fontSize="large" /> Quản lý AI Auto-Approval
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cấu hình hệ thống đánh giá và tự động duyệt khóa học bằng AI
        </Typography>
      </Box>

      {/* Statistics */}
      {statistics && (
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <BarChartIcon color="primary" />
                  <Typography variant="body2" color="text.secondary">
                    Tổng đánh giá
                  </Typography>
                </Box>
                <Typography variant="h4">{statistics.evaluations.total}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Tự động duyệt
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {statistics.decisions.autoApproved}
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    ({statistics.decisions.autoApprovalRate}%)
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <ThunderboltIcon sx={{ color: 'warning.main' }} />
                  <Typography variant="body2" color="text.secondary">
                    Điểm TB
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {statistics.performance.avgAIScore}
                  <Typography component="span" variant="body2" color="text.secondary">
                    / 100
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <SyncIcon color="info" />
                  <Typography variant="body2" color="text.secondary">
                    Sử dụng hôm nay
                  </Typography>
                </Box>
                <Typography variant="h4">
                  {statistics.performance.todayUsage}
                  <Typography component="span" variant="body2" color="text.secondary">
                    / {settings.rateLimit.requestsPerDay}
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={(_e, newValue) => setTabValue(newValue)}>
          <Tab icon={<SettingsIcon />} label="Cấu hình chung" />
          <Tab icon={<ThunderboltIcon />} label="Auto-Approval" />
        </Tabs>

        {/* Tab 1: General Settings */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            {/* Master Switch */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.enabled}
                    onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1">Bật AI đánh giá khóa học</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Sử dụng AI để tự động đánh giá chất lượng khóa học
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Provider Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                AI Provider
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Chọn dịch vụ AI để sử dụng
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip
                  label="Google Gemini (Miễn phí)"
                  color={settings.provider === 'gemini' ? 'primary' : 'default'}
                  onClick={() => setSettings({ ...settings, provider: 'gemini' })}
                  clickable
                />
                <Chip
                  label="OpenAI GPT-4 (Trả phí)"
                  color={settings.provider === 'openai' ? 'primary' : 'default'}
                  onClick={() => setSettings({ ...settings, provider: 'openai' })}
                  clickable
                />
              </Box>
            </Box>

            {/* Gemini Model Selection (only if Gemini is selected) */}
            {settings.provider === 'gemini' && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Gemini Model
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Chọn phiên bản Gemini (khác nhau về quota và tốc độ)
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  <Chip
                    label="Gemini 2.0 Flash (Khuyến nghị)"
                    color={settings.model === 'gemini-2.0-flash' ? 'success' : 'default'}
                    onClick={() => setSettings({ ...settings, model: 'gemini-2.0-flash', rateLimit: { ...settings.rateLimit, requestsPerDay: 1500 } })}
                    clickable
                  />
                  <Chip
                    label="Gemini 2.5 Flash (Mới nhất)"
                    color={settings.model === 'gemini-2.5-flash' ? 'primary' : 'default'}
                    onClick={() => setSettings({ ...settings, model: 'gemini-2.5-flash', rateLimit: { ...settings.rateLimit, requestsPerDay: 1500 } })}
                    clickable
                  />
                </Box>
                <Alert severity="info" sx={{ mt: 2 }}>
                  <strong>Gemini 2.0 Flash:</strong> Ổn định, khuyến nghị sử dụng<br />
                  <strong>Gemini 2.5 Flash:</strong> Phiên bản mới nhất với hiệu suất cao hơn
                </Alert>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Rate Limit */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Giới hạn sử dụng
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {settings.rateLimit.currentUsage} / {settings.rateLimit.requestsPerDay} requests hôm nay
              </Typography>
              <LinearProgress
                variant="determinate"
                value={usagePercentage}
                color={usagePercentage > 90 ? 'error' : 'primary'}
                sx={{ height: 8, borderRadius: 4 }}
              />
              {usagePercentage > 80 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Bạn đã sử dụng {Math.round(usagePercentage)}% quota hôm nay.
                  Hãy cân nhắc nâng cấp hoặc tắt auto-approval tạm thời.
                </Alert>
              )}
            </Box>
          </Box>
        )}

        {/* Tab 2: Auto-Approval */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            {/* Auto-Approval Switch */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoApproval.enabled}
                    disabled={!settings.enabled}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        autoApproval: { ...settings.autoApproval, enabled: e.target.checked }
                      })
                    }
                  />
                }
                label={
                  <Box>
                    <Typography variant="subtitle1">Bật Auto-Approval</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Tự động duyệt khóa học khi đạt ngưỡng điểm
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Threshold Slider */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Ngưỡng điểm tự động duyệt: {settings.autoApproval.threshold}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Khóa học có điểm AI ≥ {settings.autoApproval.threshold} sẽ được tự động duyệt
              </Typography>
              <Slider
                value={settings.autoApproval.threshold}
                onChange={(_e, value) =>
                  setSettings({
                    ...settings,
                    autoApproval: { ...settings.autoApproval, threshold: value as number }
                  })
                }
                disabled={!settings.autoApproval.enabled}
                min={50}
                max={100}
                step={5}
                marks={[
                  { value: 50, label: '50' },
                  { value: 70, label: '70' },
                  { value: 90, label: '90' },
                  { value: 100, label: '100' }
                ]}
                valueLabelDisplay="auto"
              />
              <Alert
                severity={
                  settings.autoApproval.threshold >= 80 ? 'warning' :
                    settings.autoApproval.threshold >= 70 ? 'success' : 'info'
                }
                sx={{ mt: 2 }}
              >
                {settings.autoApproval.threshold >= 80
                  ? 'Ngưỡng cao - Ít khóa học được tự động duyệt'
                  : settings.autoApproval.threshold >= 70
                    ? 'Ngưỡng cân bằng - Khuyến nghị'
                    : 'Ngưỡng thấp - Nhiều khóa học được tự động duyệt'}
              </Alert>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Minimum Requirements */}
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Yêu cầu tối thiểu
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Khóa học phải đáp ứng các yêu cầu này để được tự động duyệt
              </Typography>

              <Box display="flex" flexDirection="column" gap={2}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoApproval.minRequirements.hasDescription}
                      disabled={!settings.autoApproval.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          autoApproval: {
                            ...settings.autoApproval,
                            minRequirements: {
                              ...settings.autoApproval.minRequirements,
                              hasDescription: e.target.checked
                            }
                          }
                        })
                      }
                    />
                  }
                  label="Có mô tả (≥50 ký tự)"
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoApproval.minRequirements.hasLearningObjectives}
                      disabled={!settings.autoApproval.enabled}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          autoApproval: {
                            ...settings.autoApproval,
                            minRequirements: {
                              ...settings.autoApproval.minRequirements,
                              hasLearningObjectives: e.target.checked
                            }
                          }
                        })
                      }
                    />
                  }
                  label="Có mục tiêu học tập"
                />

                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" sx={{ minWidth: 200 }}>
                    Số bài học tối thiểu:
                  </Typography>
                  <TextField
                    type="number"
                    value={settings.autoApproval.minRequirements.minLessons}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        autoApproval: {
                          ...settings.autoApproval,
                          minRequirements: {
                            ...settings.autoApproval.minRequirements,
                            minLessons: parseInt(e.target.value) || 0
                          }
                        }
                      })
                    }
                    disabled={!settings.autoApproval.enabled}
                    size="small"
                    inputProps={{ min: 0, max: 50 }}
                    sx={{ width: 100 }}
                  />
                </Box>

                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body2" sx={{ minWidth: 200 }}>
                    Số chương tối thiểu:
                  </Typography>
                  <TextField
                    type="number"
                    value={settings.autoApproval.minRequirements.minSections}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        autoApproval: {
                          ...settings.autoApproval,
                          minRequirements: {
                            ...settings.autoApproval.minRequirements,
                            minSections: parseInt(e.target.value) || 0
                          }
                        }
                      })
                    }
                    disabled={!settings.autoApproval.enabled}
                    size="small"
                    inputProps={{ min: 0, max: 20 }}
                    sx={{ width: 100 }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Action Buttons */}
      <Box display="flex" gap={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          startIcon={testing ? <CircularProgress size={20} /> : <SyncIcon />}
          onClick={handleTest}
          disabled={testing}
        >
          Test kết nối
        </Button>
        <Button
          variant="contained"
          startIcon={saving ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          Lưu cấu hình
        </Button>
      </Box>
    </Box>
  );
};

export default AIManagement;
