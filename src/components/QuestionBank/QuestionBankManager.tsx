import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Stack,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Pagination
} from '@mui/material';
import { Autocomplete } from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import {
  getQuestionBank,
  createQuestionInBank,
  updateQuestionInBank,
  deleteQuestionFromBank,
  QuestionBankItem,
  QuestionBankFilters
} from '@/services/client/question-bank.service';

interface QuestionBankManagerProps {
  courseId?: string;
  onSelectQuestions?: (questions: QuestionBankItem[]) => void;
  mode?: 'select' | 'manage'; // 'select' for adding to lesson, 'manage' for full management
}

const QuestionBankManager: React.FC<QuestionBankManagerProps> = ({
  courseId,
  onSelectQuestions,
  mode = 'manage'
}) => {
  const [questions, setQuestions] = useState<QuestionBankItem[]>([]);
  const [_loading, setLoading] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionBankItem | null>(null);
  const [selectedQuestions, setSelectedQuestions] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<QuestionBankFilters>({
    courseId,
    page: 1,
    limit: 20
  });
  const [total, setTotal] = useState(0);
  const [newQuestion, setNewQuestion] = useState<Partial<QuestionBankItem>>({
    question: '',
    type: 'multiple-choice',
    answers: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 10,
    difficulty: 'medium',
    tags: [],
    isPublic: false
  });

  useEffect(() => {
    loadQuestions();
  }, [filters, courseId]);

  const loadQuestions = async () => {
    try {
      setLoading(true);
      const response = await getQuestionBank(filters);
      if (response.success && response.data) {
        setQuestions(response.data.questions);
        setTotal(response.data.total);
      }
    } catch (error: any) {
      console.error('Error loading questions:', error);
      toast.error('Lỗi khi tải câu hỏi');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    try {
      if (!newQuestion.question || !newQuestion.answers) {
        toast.error('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const response = await createQuestionInBank({
        ...newQuestion as any,
        teacherId: '', // Will be set by backend
        courseId: courseId || undefined
      });

      if (response.success) {
        toast.success('Đã thêm câu hỏi vào ngân hàng');
        setShowAddDialog(false);
        resetNewQuestion();
        loadQuestions();
      }
    } catch (error: any) {
      console.error('Error creating question:', error);
      toast.error(error.response?.data?.error || 'Lỗi khi tạo câu hỏi');
    }
  };

  const handleUpdateQuestion = async () => {
    if (!editingQuestion?._id) return;

    try {
      const response = await updateQuestionInBank(editingQuestion._id, editingQuestion);
      if (response.success) {
        toast.success('Đã cập nhật câu hỏi');
        setEditingQuestion(null);
        loadQuestions();
      }
    } catch (error: any) {
      console.error('Error updating question:', error);
      toast.error(error.response?.data?.error || 'Lỗi khi cập nhật câu hỏi');
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa câu hỏi này?')) return;

    try {
      const response = await deleteQuestionFromBank(questionId);
      if (response.success) {
        toast.success('Đã xóa câu hỏi');
        loadQuestions();
      }
    } catch (error: any) {
      console.error('Error deleting question:', error);
      toast.error(error.response?.data?.error || 'Lỗi khi xóa câu hỏi');
    }
  };

  const handleSelectQuestions = () => {
    const selected = questions.filter(q => selectedQuestions.has(q._id || ''));
    if (onSelectQuestions) {
      onSelectQuestions(selected);
    }
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      question: '',
      type: 'multiple-choice',
      answers: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 10,
      difficulty: 'medium',
      tags: [],
      isPublic: false
    });
  };

  return (
    <Box>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Ngân Hàng Câu Hỏi</Typography>
        {mode === 'manage' && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowAddDialog(true)}
          >
            Thêm Câu Hỏi
          </Button>
        )}
        {mode === 'select' && selectedQuestions.size > 0 && (
          <Button
            variant="contained"
            onClick={handleSelectQuestions}
          >
            Chọn {selectedQuestions.size} câu hỏi
          </Button>
        )}
      </Stack>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              label="Tìm kiếm"
              value={filters.search || ''}
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Loại</InputLabel>
              <Select
                value={filters.type || ''}
                onChange={(e) => setFilters({ ...filters, type: e.target.value || undefined, page: 1 })}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                <MenuItem value="true-false">True/False</MenuItem>
                <MenuItem value="multiple-select">Multiple Select</MenuItem>
                <MenuItem value="fill-blank">Fill Blank</MenuItem>
                <MenuItem value="short-answer">Short Answer</MenuItem>
                <MenuItem value="essay">Essay</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Độ khó</InputLabel>
              <Select
                value={filters.difficulty || ''}
                onChange={(e) => setFilters({ ...filters, difficulty: e.target.value as any || undefined, page: 1 })}
              >
                <MenuItem value="">Tất cả</MenuItem>
                <MenuItem value="easy">Dễ</MenuItem>
                <MenuItem value="medium">Trung bình</MenuItem>
                <MenuItem value="hard">Khó</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Chủ đề</InputLabel>
              <TextField
                size="small"
                value={filters.topic || ''}
                onChange={(e) => setFilters({ ...filters, topic: e.target.value || undefined, page: 1 })}
                placeholder="Nhập chủ đề..."
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.isPublic || false}
                  onChange={(e) => setFilters({ ...filters, isPublic: e.target.checked || undefined, page: 1 })}
                />
              }
              label="Công khai"
            />
          </Grid>
        </Grid>
      </Paper>

      {/* Questions List */}
      <Grid container spacing={2}>
        {questions.map((question) => (
          <Grid item xs={12} md={6} key={question._id}>
            <Card>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 1 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      {question.question}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Chip label={question.type} size="small" />
                      <Chip label={question.difficulty} size="small" color={question.difficulty === 'hard' ? 'error' : question.difficulty === 'medium' ? 'warning' : 'success'} />
                      <Chip label={`${question.points} điểm`} size="small" />
                      {question.isPublic && <Chip label="Công khai" size="small" color="info" />}
                    </Stack>
                    {question.tags && question.tags.length > 0 && (
                      <Stack direction="row" spacing={0.5} sx={{ mb: 1 }}>
                        {question.tags.map((tag, idx) => (
                          <Chip key={idx} label={tag} size="small" variant="outlined" />
                        ))}
                      </Stack>
                    )}
                  </Box>
                  {mode === 'select' && (
                    <Checkbox
                      checked={selectedQuestions.has(question._id || '')}
                      onChange={(e) => {
                        const newSet = new Set(selectedQuestions);
                        if (e.target.checked) {
                          newSet.add(question._id || '');
                        } else {
                          newSet.delete(question._id || '');
                        }
                        setSelectedQuestions(newSet);
                      }}
                    />
                  )}
                  {mode === 'manage' && (
                    <Stack direction="row">
                      <IconButton size="small" onClick={() => setEditingQuestion(question)}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteQuestion(question._id || '')}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {total > (filters.limit || 20) && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <Pagination
            count={Math.ceil(total / (filters.limit || 20))}
            page={filters.page || 1}
            onChange={(_e, page) => setFilters({ ...filters, page })}
          />
        </Box>
      )}

      {/* Add/Edit Dialog */}
      <Dialog
        open={showAddDialog || !!editingQuestion}
        onClose={() => {
          setShowAddDialog(false);
          setEditingQuestion(null);
          resetNewQuestion();
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingQuestion ? 'Chỉnh Sửa Câu Hỏi' : 'Thêm Câu Hỏi Vào Ngân Hàng'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Câu hỏi"
              value={editingQuestion?.question || newQuestion.question || ''}
              onChange={(e) => {
                if (editingQuestion) {
                  setEditingQuestion({ ...editingQuestion, question: e.target.value });
                } else {
                  setNewQuestion({ ...newQuestion, question: e.target.value });
                }
              }}
              multiline
              rows={2}
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Loại</InputLabel>
                  <Select
                    value={editingQuestion?.type || newQuestion.type || 'multiple-choice'}
                    onChange={(e) => {
                      if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, type: e.target.value as any });
                      } else {
                        setNewQuestion({ ...newQuestion, type: e.target.value as any });
                      }
                    }}
                  >
                    <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
                    <MenuItem value="true-false">True/False</MenuItem>
                    <MenuItem value="multiple-select">Multiple Select</MenuItem>
                    <MenuItem value="fill-blank">Fill Blank</MenuItem>
                    <MenuItem value="short-answer">Short Answer</MenuItem>
                    <MenuItem value="essay">Essay</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  fullWidth
                  type="number"
                  label="Điểm"
                  value={editingQuestion?.points || newQuestion.points || 10}
                  onChange={(e) => {
                    if (editingQuestion) {
                      setEditingQuestion({ ...editingQuestion, points: Number(e.target.value) });
                    } else {
                      setNewQuestion({ ...newQuestion, points: Number(e.target.value) });
                    }
                  }}
                />
              </Grid>
              <Grid item xs={3}>
                <FormControl fullWidth>
                  <InputLabel>Độ khó</InputLabel>
                  <Select
                    value={editingQuestion?.difficulty || newQuestion.difficulty || 'medium'}
                    onChange={(e) => {
                      if (editingQuestion) {
                        setEditingQuestion({ ...editingQuestion, difficulty: e.target.value as any });
                      } else {
                        setNewQuestion({ ...newQuestion, difficulty: e.target.value as any });
                      }
                    }}
                  >
                    <MenuItem value="easy">Dễ</MenuItem>
                    <MenuItem value="medium">Trung bình</MenuItem>
                    <MenuItem value="hard">Khó</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Autocomplete
              multiple
              freeSolo
              options={[]}
              value={editingQuestion?.tags || newQuestion.tags || []}
              onChange={(_e, newValue) => {
                if (editingQuestion) {
                  setEditingQuestion({ ...editingQuestion, tags: newValue });
                } else {
                  setNewQuestion({ ...newQuestion, tags: newValue });
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Tags" placeholder="Nhập tag và nhấn Enter" />
              )}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={editingQuestion?.isPublic || newQuestion.isPublic || false}
                  onChange={(e) => {
                    if (editingQuestion) {
                      setEditingQuestion({ ...editingQuestion, isPublic: e.target.checked });
                    } else {
                      setNewQuestion({ ...newQuestion, isPublic: e.target.checked });
                    }
                  }}
                />
              }
              label="Chia sẻ công khai với giáo viên khác"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setShowAddDialog(false);
            setEditingQuestion(null);
            resetNewQuestion();
          }}>
            Hủy
          </Button>
          <Button
            variant="contained"
            onClick={editingQuestion ? handleUpdateQuestion : handleCreateQuestion}
          >
            {editingQuestion ? 'Cập nhật' : 'Thêm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default QuestionBankManager;
