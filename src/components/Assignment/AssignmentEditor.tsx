import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Stack,
  Typography,
  Switch,
  FormControlLabel,
  Button,
  Chip,
  IconButton,
  Paper,
  Divider,
  Alert,
  InputAdornment,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  AttachFile as AttachFileIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import FileUpload, { FileUploadResult } from '../File/FileUpload';

export interface AssignmentFormData {
  title: string;
  description: string;
  instructions: string;
  type: 'file' | 'quiz' | 'text' | 'code' | 'video' | 'audio' | 'mixed';
  dueDate: Date | null;
  maxScore: number;
  timeLimit?: number;
  attempts: number;
  // Settings
  allowLateSubmission: boolean;
  latePenalty: number;
  autoGrade: boolean;
  peerReview: boolean;
  groupAssignment: boolean;
  anonymousGrading: boolean;
  plagiarismCheck: boolean;
  // Attachments
  attachments: Array<{
    name: string;
    url: string;
    size: number;
    type: string;
  }>;
  // Resources
  resources: Array<{
    name: string;
    url: string;
    type: 'link' | 'file';
  }>;
  rubricUrl?: string;
}

interface AssignmentEditorProps {
  initialData?: Partial<AssignmentFormData>;
  onChange?: (data: AssignmentFormData) => void;
  onSave?: (data: AssignmentFormData) => void;
  lessonId?: string;
}

const AssignmentEditor: React.FC<AssignmentEditorProps> = ({
  initialData,
  onChange,
  onSave,
  lessonId,
}) => {
  const [formData, setFormData] = useState<AssignmentFormData>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    instructions: initialData?.instructions || '',
    type: initialData?.type || 'file',
    dueDate: initialData?.dueDate || null,
    maxScore: initialData?.maxScore || 100,
    timeLimit: initialData?.timeLimit,
    attempts: initialData?.attempts || 1,
    allowLateSubmission: initialData?.allowLateSubmission || false,
    latePenalty: initialData?.latePenalty || 0,
    autoGrade: initialData?.autoGrade || false,
    peerReview: initialData?.peerReview || false,
    groupAssignment: initialData?.groupAssignment || false,
    anonymousGrading: initialData?.anonymousGrading || false,
    plagiarismCheck: initialData?.plagiarismCheck || false,
    attachments: initialData?.attachments || [],
    resources: initialData?.resources || [],
    rubricUrl: initialData?.rubricUrl,
  });

  const [newResource, setNewResource] = useState({ name: '', url: '', type: 'link' as 'link' | 'file' });

  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  const handleFieldChange = (field: keyof AssignmentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAttachmentUpload = (result: FileUploadResult) => {
    if (result.secureUrl) {
      const newAttachment = {
        name: result.originalName || 'File',
        url: result.secureUrl,
        size: result.size || 0,
        type: result.mimeType || 'application/octet-stream',
      };
      setFormData(prev => ({
        ...prev,
        attachments: [...prev.attachments, newAttachment],
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const addResource = () => {
    if (newResource.name && newResource.url) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, { ...newResource }],
      }));
      setNewResource({ name: '', url: '', type: 'link' });
    }
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const parseDateFromInput = (value: string): Date | null => {
    if (!value) return null;
    return new Date(value);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Basic Information */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Thông tin cơ bản
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Tiêu đề bài tập"
                value={formData.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Mô tả bài tập
              </Typography>
              <RichTextEditor
                value={formData.description}
                onChange={(value) => handleFieldChange('description', value)}
                placeholder="Nhập mô tả chi tiết về bài tập..."
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Hướng dẫn làm bài
              </Typography>
              <RichTextEditor
                value={formData.instructions}
                onChange={(value) => handleFieldChange('instructions', value)}
                placeholder="Nhập hướng dẫn chi tiết cách làm bài..."
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Loại bài tập</InputLabel>
                <Select
                  value={formData.type}
                  onChange={(e) => handleFieldChange('type', e.target.value)}
                  label="Loại bài tập"
                >
                  <MenuItem value="file">Nộp file</MenuItem>
                  <MenuItem value="text">Nộp văn bản</MenuItem>
                  <MenuItem value="quiz">Quiz</MenuItem>
                  <MenuItem value="code">Nộp code</MenuItem>
                  <MenuItem value="video">Nộp video</MenuItem>
                  <MenuItem value="audio">Nộp audio</MenuItem>
                  <MenuItem value="mixed">Hỗn hợp</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="datetime-local"
                label="Hạn nộp bài"
                value={formatDateForInput(formData.dueDate)}
                onChange={(e) => handleFieldChange('dueDate', parseDateFromInput(e.target.value))}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                type="number"
                label="Điểm tối đa"
                value={formData.maxScore}
                onChange={(e) => handleFieldChange('maxScore', Number(e.target.value))}
                InputProps={{ inputProps: { min: 1, max: 1000 } }}
              />
            </Grid>
            {formData.type === 'quiz' && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Thời gian làm bài (phút)"
                  value={formData.timeLimit || ''}
                  onChange={(e) => handleFieldChange('timeLimit', e.target.value ? Number(e.target.value) : undefined)}
                  InputProps={{ inputProps: { min: 1 } }}
                  helperText="Để trống nếu không giới hạn thời gian"
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="number"
                label="Số lần nộp tối đa"
                value={formData.attempts}
                onChange={(e) => handleFieldChange('attempts', Number(e.target.value))}
                InputProps={{ inputProps: { min: 1, max: 10 } }}
                helperText="Nhập 0 để cho phép nộp không giới hạn"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Assignment Settings */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Cài đặt bài tập
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.allowLateSubmission}
                    onChange={(e) => handleFieldChange('allowLateSubmission', e.target.checked)}
                  />
                }
                label="Cho phép nộp muộn"
              />
            </Grid>
            {formData.allowLateSubmission && (
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Phạt trừ điểm mỗi ngày (%)"
                  value={formData.latePenalty}
                  onChange={(e) => handleFieldChange('latePenalty', Number(e.target.value))}
                  InputProps={{
                    inputProps: { min: 0, max: 100 },
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Grid>
            )}
            {formData.type === 'quiz' && (
              <Grid item xs={12} md={6}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.autoGrade}
                      onChange={(e) => handleFieldChange('autoGrade', e.target.checked)}
                    />
                  }
                  label="Tự động chấm điểm"
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.peerReview}
                    onChange={(e) => handleFieldChange('peerReview', e.target.checked)}
                  />
                }
                label="Học sinh chấm lẫn nhau"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.groupAssignment}
                    onChange={(e) => handleFieldChange('groupAssignment', e.target.checked)}
                  />
                }
                label="Bài tập nhóm"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.anonymousGrading}
                    onChange={(e) => handleFieldChange('anonymousGrading', e.target.checked)}
                  />
                }
                label="Chấm ẩn danh"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.plagiarismCheck}
                    onChange={(e) => handleFieldChange('plagiarismCheck', e.target.checked)}
                  />
                }
                label="Kiểm tra đạo văn"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Link đến rubric (nếu có)"
                value={formData.rubricUrl || ''}
                onChange={(e) => handleFieldChange('rubricUrl', e.target.value)}
                placeholder="https://..."
                helperText="Link đến file rubric hoặc tài liệu hướng dẫn chấm điểm"
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Attachments */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            File đính kèm (Rubrics, Examples, Templates)
          </Typography>
          <FileUpload
            folder={lessonId ? `lms/assignments/${lessonId}/attachments` : 'lms/assignments/attachments'}
            multiple={true}
            onUploadComplete={(result) => {
              if (result && result.secureUrl) {
                handleAttachmentUpload(result);
              }
            }}
          />
          {formData.attachments.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Files đã tải lên:
              </Typography>
              <Stack spacing={1}>
                {formData.attachments.map((attachment, index) => (
                  <Chip
                    key={index}
                    label={`${attachment.name} (${(attachment.size / 1024).toFixed(2)} KB)`}
                    onDelete={() => removeAttachment(index)}
                    icon={<AttachFileIcon />}
                    sx={{ justifyContent: 'flex-start' }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Paper>

        {/* Resources */}
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Tài liệu tham khảo
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Tên tài liệu"
                value={newResource.name}
                onChange={(e) => setNewResource(prev => ({ ...prev, name: e.target.value }))}
                size="small"
              />
            </Grid>
            <Grid item xs={12} md={5}>
              <TextField
                fullWidth
                label="URL"
                value={newResource.url}
                onChange={(e) => setNewResource(prev => ({ ...prev, url: e.target.value }))}
                size="small"
                placeholder="https://..."
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Loại</InputLabel>
                <Select
                  value={newResource.type}
                  onChange={(e) => setNewResource(prev => ({ ...prev, type: e.target.value as 'link' | 'file' }))}
                  label="Loại"
                >
                  <MenuItem value="link">Link</MenuItem>
                  <MenuItem value="file">File</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={addResource}
                disabled={!newResource.name || !newResource.url}
              >
                Thêm tài liệu
              </Button>
            </Grid>
          </Grid>
          {formData.resources.length > 0 && (
            <Stack spacing={1}>
              {formData.resources.map((resource, index) => (
                <Chip
                  key={index}
                  label={`${resource.name} (${resource.type})`}
                  onDelete={() => removeResource(index)}
                  icon={resource.type === 'link' ? <LinkIcon /> : <AttachFileIcon />}
                  sx={{ justifyContent: 'flex-start' }}
                />
              ))}
            </Stack>
          )}
        </Paper>

        {onSave && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button variant="outlined" onClick={() => setFormData(initialData as AssignmentFormData || {
              title: '',
              description: '',
              instructions: '',
              type: 'file',
              dueDate: null,
              maxScore: 100,
              attempts: 1,
              allowLateSubmission: false,
              latePenalty: 0,
              autoGrade: false,
              peerReview: false,
              groupAssignment: false,
              anonymousGrading: false,
              plagiarismCheck: false,
              attachments: [],
              resources: [],
            })}>
              Hủy
            </Button>
            <Button variant="contained" onClick={() => onSave(formData)}>
              Lưu bài tập
            </Button>
          </Box>
        )}
      </Box>
  );
};

export default AssignmentEditor;
