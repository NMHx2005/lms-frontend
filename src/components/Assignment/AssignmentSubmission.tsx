import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  TextField,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Checkbox,
} from '@mui/material';
import {
  Save as SaveIcon,
  Send as SendIcon,
  AccessTime as AccessTimeIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { toast } from 'react-hot-toast';
import RichTextEditor from '../RichTextEditor/RichTextEditor';
import FileUpload, { FileUploadResult } from '../File/FileUpload';

export interface AssignmentSubmissionProps {
  assignment: {
    _id: string;
    title: string;
    description: string;
    instructions: string;
    type: 'file' | 'quiz' | 'text' | 'code' | 'video' | 'audio' | 'mixed';
    dueDate?: string;
    maxScore: number;
    timeLimit?: number;
    attempts: number;
    allowLateSubmission?: boolean;
    latePenalty?: number;
  };
  existingSubmission?: {
    _id: string;
    status: 'draft' | 'submitted' | 'graded' | 'late' | 'overdue' | 'returned';
    fileUrl?: string;
    textAnswer?: string;
    score?: number;
    feedback?: string;
    submittedAt?: string;
    attemptNumber: number;
  };
  onSaveDraft?: (data: any) => Promise<void>;
  onSubmit?: (data: any) => Promise<void>;
  onViewHistory?: () => void;
}

const AssignmentSubmission: React.FC<AssignmentSubmissionProps> = ({
  assignment,
  existingSubmission,
  onSaveDraft,
  onSubmit,
  onViewHistory,
}) => {
  const [submissionData, setSubmissionData] = useState({
    fileUrl: existingSubmission?.fileUrl || '',
    textAnswer: existingSubmission?.textAnswer || '',
    comment: '',
  });
  const [isDraft, setIsDraft] = useState(existingSubmission?.status === 'draft');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState(existingSubmission?.attemptNumber || 0);
  const [_submissionHistory, _setSubmissionHistory] = useState<any[]>([]);
  const autoSaveIntervalRef = useRef<number | null>(null);

  // Calculate time remaining
  useEffect(() => {
    if (assignment.dueDate) {
      const updateTimeRemaining = () => {
        const now = new Date().getTime();
        const due = new Date(assignment.dueDate!).getTime();
        const remaining = Math.max(0, due - now);
        setTimeRemaining(remaining);
      };
      updateTimeRemaining();
      const interval = setInterval(updateTimeRemaining, 1000);
      return () => clearInterval(interval);
    }
  }, [assignment.dueDate]);

  // Auto-save draft
  useEffect(() => {
    if (isDraft && (onSaveDraft || onSubmit)) {
      autoSaveIntervalRef.current = setInterval(() => {
        handleSaveDraft();
      }, 30000); // Auto-save every 30 seconds
      return () => {
        if (autoSaveIntervalRef.current) {
          clearInterval(autoSaveIntervalRef.current);
        }
      };
    }
  }, [isDraft, submissionData]);

  const formatTimeRemaining = (ms: number): string => {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (days > 0) return `${days} ngày ${hours} giờ ${minutes} phút`;
    if (hours > 0) return `${hours} giờ ${minutes} phút ${seconds} giây`;
    if (minutes > 0) return `${minutes} phút ${seconds} giây`;
    return `${seconds} giây`;
  };

  const handleFileUpload = async (files: FileUploadResult[]) => {
    if (!files || files.length === 0) return;
    const result = files[0];
    if (result && result.secureUrl) {
      setSubmissionData(prev => ({ ...prev, fileUrl: result.secureUrl! }));
      toast.success('Tải file thành công!');
    }
  };

  const handleSaveDraft = async () => {
    if (!onSaveDraft && !onSubmit) return;
    
    setIsSaving(true);
    try {
      const draftData = {
        assignmentId: assignment._id,
        ...submissionData,
        isDraft: true,
        status: 'draft',
      };
      
      if (onSaveDraft) {
        await onSaveDraft(draftData);
      } else if (onSubmit) {
        // If no onSaveDraft, use onSubmit with draft flag
        await onSubmit({ ...draftData, submit: false });
      }
      
      setIsDraft(true);
      toast.success('Đã lưu bản nháp');
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi lưu bản nháp');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (assignment.type === 'file' && !submissionData.fileUrl) {
      toast.error('Vui lòng tải file để nộp bài');
      return;
    }
    if (assignment.type === 'text' && !submissionData.textAnswer.trim()) {
      toast.error('Vui lòng nhập nội dung bài làm');
      return;
    }
    if (assignment.attempts > 0 && attemptCount >= assignment.attempts) {
      toast.error(`Bạn đã đạt giới hạn số lần nộp (${assignment.attempts})`);
      return;
    }

    if (!onSubmit) return;

    setIsSubmitting(true);
    try {
      const submitData = {
        assignmentId: assignment._id,
        ...submissionData,
        isDraft: false,
        status: 'submitted',
        attemptNumber: attemptCount + 1,
      };
      
      await onSubmit(submitData);
      setIsDraft(false);
      setAttemptCount(prev => prev + 1);
      toast.success('Nộp bài thành công!');
    } catch (error: any) {
      toast.error(error.message || 'Lỗi khi nộp bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateSubmission = (): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    if (assignment.type === 'file' && !submissionData.fileUrl) {
      errors.push('Vui lòng tải file để nộp bài');
    }
    if (assignment.type === 'text' && !submissionData.textAnswer.trim()) {
      errors.push('Vui lòng nhập nội dung bài làm');
    }
    if (assignment.attempts > 0 && attemptCount >= assignment.attempts) {
      errors.push(`Bạn đã đạt giới hạn số lần nộp (${assignment.attempts})`);
    }
    
    return { valid: errors.length === 0, errors };
  };

  const isLate = assignment.dueDate && timeRemaining !== null && timeRemaining === 0;
  const canSubmit = assignment.attempts === 0 || attemptCount < assignment.attempts;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Assignment Info */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          {assignment.title}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Box
          dangerouslySetInnerHTML={{ __html: assignment.description }}
          sx={{ mb: 2 }}
        />
        <Box
          dangerouslySetInnerHTML={{ __html: assignment.instructions }}
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <Chip
            icon={<AccessTimeIcon />}
            label={assignment.dueDate ? `Hạn nộp: ${new Date(assignment.dueDate).toLocaleString('vi-VN')}` : 'Không có hạn nộp'}
            color={isLate ? 'error' : 'default'}
          />
          <Chip label={`Điểm tối đa: ${assignment.maxScore}`} />
          <Chip label={`Lần nộp: ${attemptCount}/${assignment.attempts || '∞'}`} />
          {assignment.timeLimit && (
            <Chip label={`Thời gian: ${assignment.timeLimit} phút`} />
          )}
        </Stack>
      </Paper>

      {/* Time Remaining / Late Warning */}
      {assignment.dueDate && (
        <Alert
          severity={isLate ? 'error' : timeRemaining && timeRemaining < 3600000 ? 'warning' : 'info'}
        >
          {isLate ? (
            <>
              <strong>Đã quá hạn nộp!</strong>
              {assignment.allowLateSubmission ? (
                ` Bạn vẫn có thể nộp nhưng sẽ bị trừ ${assignment.latePenalty || 0}% điểm mỗi ngày.`
              ) : (
                ' Không thể nộp bài sau hạn.'
              )}
            </>
          ) : timeRemaining ? (
            <>
              <strong>Còn lại: {formatTimeRemaining(timeRemaining)}</strong>
            </>
          ) : null}
        </Alert>
      )}

      {/* Submission Status */}
      {existingSubmission && existingSubmission.status !== 'draft' && (
        <Alert severity={existingSubmission.status === 'graded' ? 'success' : 'info'}>
          {existingSubmission.status === 'graded' && (
            <>
              <strong>Đã chấm điểm!</strong> Điểm số: {existingSubmission.score}/{assignment.maxScore}
              {existingSubmission.feedback && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">Nhận xét:</Typography>
                  <Box dangerouslySetInnerHTML={{ __html: existingSubmission.feedback }} />
                </Box>
              )}
            </>
          )}
          {existingSubmission.status === 'returned' && (
            <>
              <strong>Bài làm đã được trả lại để sửa.</strong>
              {existingSubmission.feedback && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="subtitle2">Nhận xét:</Typography>
                  <Box dangerouslySetInnerHTML={{ __html: existingSubmission.feedback }} />
                </Box>
              )}
            </>
          )}
        </Alert>
      )}

      {/* Submission Form */}
      {(!existingSubmission || existingSubmission.status === 'draft' || existingSubmission.status === 'returned') && canSubmit && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Nộp bài
          </Typography>

          {/* File Upload */}
          {assignment.type === 'file' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Tải file bài làm
              </Typography>
              <FileUpload
                folder={`lms/assignments/${assignment._id}/submissions`}
                multiple={false}
                onUploadComplete={handleFileUpload}
              />
              {submissionData.fileUrl && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  File đã được tải lên thành công!
                </Alert>
              )}
            </Box>
          )}

          {/* Text Submission */}
          {assignment.type === 'text' && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                Nội dung bài làm
              </Typography>
              <RichTextEditor
                value={submissionData.textAnswer}
                onChange={(value) => setSubmissionData(prev => ({ ...prev, textAnswer: value }))}
                placeholder="Nhập nội dung bài làm của bạn..."
              />
            </Box>
          )}

          {/* Comment */}
          <TextField
            fullWidth
            label="Ghi chú (tùy chọn)"
            multiline
            rows={3}
            value={submissionData.comment}
            onChange={(e) => setSubmissionData(prev => ({ ...prev, comment: e.target.value }))}
            sx={{ mb: 3 }}
            placeholder="Thêm ghi chú cho giáo viên..."
          />

          {/* Submission Checklist */}
          <Paper variant="outlined" sx={{ p: 2, mb: 3, bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Kiểm tra trước khi nộp:
            </Typography>
            <List dense>
              <ListItem>
                <ListItemIcon>
                  <Checkbox
                    checked={assignment.type === 'file' ? !!submissionData.fileUrl : !!submissionData.textAnswer.trim()}
                    disabled
                  />
                </ListItemIcon>
                <ListItemText primary={assignment.type === 'file' ? 'Đã tải file bài làm' : 'Đã nhập nội dung bài làm'} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Checkbox checked={!isLate || assignment.allowLateSubmission} disabled />
                </ListItemIcon>
                <ListItemText primary={isLate ? 'Đã quá hạn nhưng được phép nộp muộn' : 'Nộp đúng hạn'} />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <Checkbox checked={canSubmit} disabled />
                </ListItemIcon>
                <ListItemText primary={`Còn lượt nộp (${attemptCount}/${assignment.attempts || '∞'})`} />
              </ListItem>
            </List>
          </Paper>

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={handleSaveDraft}
              disabled={isSaving || isSubmitting}
            >
              {isSaving ? 'Đang lưu...' : 'Lưu bản nháp'}
            </Button>
            <Button
              variant="contained"
              startIcon={<SendIcon />}
              onClick={handleSubmit}
              disabled={isSubmitting || isSaving || !validateSubmission().valid}
            >
              {isSubmitting ? 'Đang nộp...' : 'Nộp bài'}
            </Button>
          </Stack>
        </Paper>
      )}

      {/* Submission History */}
      {onViewHistory && attemptCount > 0 && (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Lịch sử nộp bài
            </Typography>
            <Button startIcon={<HistoryIcon />} onClick={onViewHistory}>
              Xem chi tiết
            </Button>
          </Stack>
          <Typography variant="body2" color="text.secondary">
            Bạn đã nộp {attemptCount} lần. Click "Xem chi tiết" để xem tất cả các lần nộp.
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default AssignmentSubmission;
