import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    Box,
    Container,
    Typography,
    Breadcrumbs,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Stack,
    IconButton
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Publish as PublishIcon,
    Unpublished as UnpublishIcon,
    Visibility as VisibilityIcon,
    Quiz as QuizIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';

interface Course { _id: string; title: string; description: string; thumbnail: string; isPublished: boolean; studentCount: number }
interface QuizQuestion { _id: string; question: string; type: 'multiple_choice' | 'true_false' | 'short_answer'; options?: string[]; correctAnswer: string | string[]; points: number }
interface Assignment { _id: string; title: string; description: string; type: 'file' | 'quiz'; dueDate: string; maxScore: number; isPublished: boolean; createdAt: string; updatedAt: string; submissionsCount: number; averageScore: number; courseId: string; fileUrl?: string; fileName?: string; fileSize?: number; questions?: QuizQuestion[]; timeLimit?: number }
interface Lesson { _id: string; title: string; courseTitle: string; sectionTitle: string }

const AssignmentsManager: React.FC = () => {
    const { lessonId } = useParams<{ lessonId: string }>();

    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [lesson, setLesson] = useState<Lesson | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);

    const [showAddAssignment, setShowAddAssignment] = useState<boolean>(false);
    const [previewAssignmentId, setPreviewAssignmentId] = useState<string | null>(null);
    const [newAssignment, setNewAssignment] = useState<{ title: string; description: string; type: 'file' | 'quiz'; dueDate: string; maxScore: number; fileUrl?: string; fileName?: string; timeLimit?: number; questions: QuizQuestion[] }>({
        title: '',
        description: '',
        type: 'file',
        dueDate: '',
        maxScore: 100,
        fileUrl: '',
        fileName: '',
        timeLimit: 30,
        questions: []
    });

    useEffect(() => {
        // mock load courses
        setTimeout(() => {
            const mockCourses: Course[] = [
                { _id: 'course1', title: 'React Advanced Patterns', description: 'Học React từ cơ bản đến nâng cao', thumbnail: '/images/react-course.jpg', isPublished: true, studentCount: 45 },
                { _id: 'course2', title: 'Node.js Backend Development', description: 'Xây dựng backend với Node.js và Express', thumbnail: '/images/nodejs-course.jpg', isPublished: true, studentCount: 32 },
                { _id: 'course3', title: 'Python Data Science', description: 'Phân tích dữ liệu với Python', thumbnail: '/images/python-course.jpg', isPublished: false, studentCount: 28 }
            ];
            setCourses(mockCourses);
            if (mockCourses.length > 0) {
                setSelectedCourseId(mockCourses[0]._id);
                setSelectedCourse(mockCourses[0]);
            }
        }, 500);
    }, []);

    useEffect(() => {
        if (!selectedCourseId) return;
        setTimeout(() => {
            const lessonMock: Lesson = { _id: lessonId || '1', title: 'React Hooks Fundamentals', courseTitle: selectedCourse?.title || '', sectionTitle: 'React Hooks Nâng cao' };
            const assignmentsMock: Assignment[] = [
                { _id: 'a1', title: 'Bài tập thực hành useState', description: 'Tạo một ứng dụng counter sử dụng useState hook...', type: 'file', dueDate: '2024-02-01T23:59:00Z', maxScore: 100, isPublished: true, createdAt: '2024-01-15T00:00:00Z', updatedAt: '2024-01-15T00:00:00Z', submissionsCount: 15, averageScore: 87.5, courseId: selectedCourseId, fileUrl: 'https://example.com/assignment1.pdf', fileName: 'useState_Practice.pdf', fileSize: 2048576 },
                { _id: 'a2', title: 'Quiz kiểm tra kiến thức Hooks', description: 'Bài quiz kiểm tra hiểu biết về React Hooks cơ bản.', type: 'quiz', dueDate: '2024-02-05T23:59:00Z', maxScore: 50, isPublished: true, createdAt: '2024-01-16T00:00:00Z', updatedAt: '2024-01-16T00:00:00Z', submissionsCount: 12, averageScore: 42.3, courseId: selectedCourseId, timeLimit: 45, questions: [{ _id: 'q1', question: 'useState hook dùng để?', type: 'multiple_choice', options: ['Quản lý effects', 'Quản lý state', 'Tối ưu hiệu suất', 'Lifecycle'], correctAnswer: 'Quản lý state', points: 10 }, { _id: 'q2', question: 'useEffect chạy sau mỗi render.', type: 'true_false', correctAnswer: 'true', points: 5 }] }
            ];
            setLesson(lessonMock);
            setAssignments(assignmentsMock);
        }, 400);
    }, [selectedCourseId, selectedCourse, lessonId]);

    const handleCourseChange = (courseId: string) => {
        setSelectedCourseId(courseId);
        setSelectedCourse(courses.find(c => c._id === courseId) || null);
        setAssignments([]);
        setLesson(null);
    };

    const handleCreateAssignment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newAssignment.title.trim() || !selectedCourseId) return;
        const created: Assignment = {
            _id: `a${Date.now()}`,
            title: newAssignment.title,
            description: newAssignment.description,
            type: newAssignment.type,
            dueDate: newAssignment.dueDate,
            maxScore: newAssignment.maxScore,
            isPublished: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            submissionsCount: 0,
            averageScore: 0,
            courseId: selectedCourseId,
            fileUrl: newAssignment.fileUrl,
            fileName: newAssignment.fileName,
            timeLimit: newAssignment.timeLimit,
            questions: newAssignment.questions
        };
        setAssignments(prev => [...prev, created]);
        setNewAssignment({ title: '', description: '', type: 'file', dueDate: '', maxScore: 100, fileUrl: '', fileName: '', timeLimit: 30, questions: [] });
        setShowAddAssignment(false);
    };

    const togglePublish = (id: string) => {
        setAssignments(prev => prev.map(a => a._id === id ? { ...a, isPublished: !a.isPublished, updatedAt: new Date().toISOString() } : a));
    };
    const deleteAssignment = (id: string) => {
        if (confirm('Xóa bài tập này?')) setAssignments(prev => prev.filter(a => a._id !== id));
    };

    const formatDate = (s: string) => new Date(s).toLocaleString('vi-VN');
    const formatBytes = (bytes?: number) => {
        if (!bytes) return '';
        const units = ['B', 'KB', 'MB', 'GB'];
        let i = 0; let b = bytes;
        while (b >= 1024 && i < units.length - 1) { b /= 1024; i++; }
        return `${b.toFixed(1)} ${units[i]}`;
    };

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">Lessons</Typography>
                    <Typography color="text.secondary">Assignments</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Quản lý bài tập</Typography>
            </Box>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Chọn khóa học</Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth>
                                <InputLabel>Khóa học</InputLabel>
                                <Select label="Khóa học" value={selectedCourseId} onChange={(e) => handleCourseChange(e.target.value)} MenuProps={{ disableScrollLock: true }}>
                                    {courses.map(c => (
                                        <MenuItem key={c._id} value={c._id}>{c.title}{!c.isPublished && ' (Bản nháp)'}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        {selectedCourse && (
                            <Grid item xs={12} md={6}>
                                <Card variant="outlined">
                                    <CardContent>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{selectedCourse.title}</Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{selectedCourse.description}</Typography>
                                        <Stack direction="row" spacing={2}>
                                            <Chip label={`${selectedCourse.studentCount} học viên`} size="small" />
                                            <Chip label={selectedCourse.isPublished ? 'Đã xuất bản' : 'Bản nháp'} color={selectedCourse.isPublished ? 'success' : 'default'} size="small" />
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            {selectedCourse && (
                <>
                    {lesson && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>{lesson.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">{lesson.courseTitle} • {lesson.sectionTitle}</Typography>
                                    </Box>
                                    <Stack direction="row" spacing={2}>
                                        <Chip label={`Bài tập: ${assignments.length}`} size="small" />
                                        <Chip label={`Lượt nộp: ${assignments.reduce((t, a) => t + a.submissionsCount, 0)}`} size="small" />
                                        <Chip label={`Điểm TB: ${assignments.length ? Math.round(assignments.reduce((t, a) => t + a.averageScore, 0) / assignments.length) : 0}%`} size="small" />
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>Danh sách bài tập</Typography>
                        <Button startIcon={<AddIcon />} variant="contained" onClick={() => setShowAddAssignment(true)}>Tạo bài tập mới</Button>
                    </Stack>

                    {showAddAssignment && (
                        <Card sx={{ mb: 3 }}>
                            <CardContent>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Tạo bài tập mới cho khóa học: {selectedCourse.title}</Typography>
                                    <IconButton onClick={() => setShowAddAssignment(false)}><CloseIcon /></IconButton>
                                </Stack>
                                <Box component="form" onSubmit={handleCreateAssignment}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <TextField fullWidth label="Tiêu đề bài tập" value={newAssignment.title} onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))} required />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Loại bài tập</InputLabel>
                                                <Select label="Loại bài tập" value={newAssignment.type} onChange={(e) => setNewAssignment(prev => ({ ...prev, type: e.target.value as 'file' | 'quiz' }))} MenuProps={{ disableScrollLock: true }}>
                                                    <MenuItem value="file">Nộp file</MenuItem>
                                                    <MenuItem value="quiz">Bài quiz</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField fullWidth label="Mô tả" multiline rows={3} value={newAssignment.description} onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField fullWidth type="datetime-local" label="Hạn nộp" InputLabelProps={{ shrink: true }} value={newAssignment.dueDate} onChange={(e) => setNewAssignment(prev => ({ ...prev, dueDate: e.target.value }))} />
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <TextField fullWidth type="number" label="Điểm tối đa" value={newAssignment.maxScore} onChange={(e) => setNewAssignment(prev => ({ ...prev, maxScore: parseInt(e.target.value, 10) || 0 }))} />
                                        </Grid>

                                        {newAssignment.type === 'file' && (
                                            <>
                                                <Grid item xs={12} md={6}>
                                                    <TextField fullWidth label="URL file bài tập" value={newAssignment.fileUrl} onChange={(e) => setNewAssignment(prev => ({ ...prev, fileUrl: e.target.value }))} />
                                                </Grid>
                                                <Grid item xs={12} md={6}>
                                                    <TextField fullWidth label="Tên file" value={newAssignment.fileName} onChange={(e) => setNewAssignment(prev => ({ ...prev, fileName: e.target.value }))} />
                                                </Grid>
                                            </>
                                        )}

                                        {newAssignment.type === 'quiz' && (
                                            <>
                                                <Grid item xs={12} md={4}>
                                                    <TextField fullWidth type="number" label="Thời gian (phút)" value={newAssignment.timeLimit} onChange={(e) => setNewAssignment(prev => ({ ...prev, timeLimit: parseInt(e.target.value, 10) || 0 }))} />
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                        <Typography variant="subtitle2">Câu hỏi ({newAssignment.questions.length})</Typography>
                                                        <Button size="small" startIcon={<AddIcon />} onClick={() => {
                                                            const q: QuizQuestion = { _id: `q${Date.now()}`, question: '', type: 'multiple_choice', options: ['', '', '', ''], correctAnswer: '', points: 10 };
                                                            setNewAssignment(prev => ({ ...prev, questions: [...prev.questions, q] }));
                                                        }}>Thêm câu hỏi</Button>
                                                    </Stack>
                                                </Grid>

                                                {newAssignment.questions.map((q, qi) => (
                                                    <Grid item xs={12} key={q._id}>
                                                        <Card variant="outlined">
                                                            <CardContent>
                                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                                    <Typography variant="subtitle2">Câu {qi + 1}</Typography>
                                                                    <IconButton size="small" onClick={() => setNewAssignment(prev => ({ ...prev, questions: prev.questions.filter((_, idx) => idx !== qi) }))}><DeleteIcon fontSize="small" /></IconButton>
                                                                </Stack>
                                                                <Grid container spacing={2}>
                                                                    <Grid item xs={12}>
                                                                        <TextField fullWidth label="Câu hỏi" multiline rows={2} value={q.question} onChange={(e) => setNewAssignment(prev => ({ ...prev, questions: prev.questions.map((qq, idx) => idx === qi ? { ...qq, question: e.target.value } : qq) }))} />
                                                                    </Grid>
                                                                    <Grid item xs={12} md={6}>
                                                                        <FormControl fullWidth>
                                                                            <InputLabel>Loại câu hỏi</InputLabel>
                                                                            <Select label="Loại câu hỏi" value={q.type} onChange={(e) => setNewAssignment(prev => ({ ...prev, questions: prev.questions.map((qq, idx) => idx === qi ? { ...qq, type: e.target.value as QuizQuestion['type'] } : qq) }))} MenuProps={{ disableScrollLock: true }}>
                                                                                <MenuItem value="multiple_choice">Trắc nghiệm</MenuItem>
                                                                                <MenuItem value="true_false">Đúng/Sai</MenuItem>
                                                                                <MenuItem value="short_answer">Tự luận ngắn</MenuItem>
                                                                            </Select>
                                                                        </FormControl>
                                                                    </Grid>
                                                                    <Grid item xs={12} md={6}>
                                                                        <TextField fullWidth type="number" label="Điểm" value={q.points} onChange={(e) => setNewAssignment(prev => ({ ...prev, questions: prev.questions.map((qq, idx) => idx === qi ? { ...qq, points: parseInt(e.target.value, 10) || 0 } : qq) }))} />
                                                                    </Grid>

                                                                    {q.type === 'multiple_choice' && (
                                                                        <Grid item xs={12}>
                                                                            <Grid container spacing={1}>
                                                                                {(q.options || []).map((opt, oi) => (
                                                                                    <Grid item xs={12} md={6} key={oi}>
                                                                                        <TextField fullWidth label={`Lựa chọn ${oi + 1}`} value={opt} onChange={(e) => setNewAssignment(prev => ({ ...prev, questions: prev.questions.map((qq, idx) => idx === qi ? { ...qq, options: (() => { const copy = [...(qq.options || [])]; copy[oi] = e.target.value; return copy; })() } : qq) }))} />
                                                                                    </Grid>
                                                                                ))}
                                                                            </Grid>
                                                                        </Grid>
                                                                    )}
                                                                </Grid>
                                                            </CardContent>
                                                        </Card>
                                                    </Grid>
                                                ))}
                                            </>
                                        )}
                                    </Grid>
                                    <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                                        <Button variant="outlined" onClick={() => setShowAddAssignment(false)}>Hủy</Button>
                                        <Button variant="contained" type="submit">Tạo bài tập</Button>
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    )}

                    {assignments.length === 0 ? (
                        <Card>
                            <CardContent>
                                <Typography align="center" color="text.secondary">Chưa có bài tập nào</Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <Stack spacing={2}>
                            {assignments.map(a => (
                                <Card key={a._id}>
                                    <CardContent>
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                            <Stack direction="row" spacing={2} alignItems="flex-start">
                                                <Box sx={{ mt: .5 }}>{a.type === 'file' ? <DescriptionIcon /> : <QuizIcon />}</Box>
                                                <Box>
                                                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{a.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{a.description}</Typography>
                                                    <Stack direction="row" spacing={2}>
                                                        <Chip size="small" label={`Hạn: ${formatDate(a.dueDate)}`} />
                                                        <Chip size="small" label={`Điểm tối đa: ${a.maxScore}`} />
                                                        <Chip size="small" label={`Lượt nộp: ${a.submissionsCount}`} />
                                                        {a.submissionsCount > 0 && <Chip size="small" label={`Điểm TB: ${a.averageScore.toFixed(1)}`} />}
                                                    </Stack>
                                                </Box>
                                            </Stack>
                                            <Stack direction="row" spacing={1}>
                                                <Button size="small" variant="outlined" startIcon={<VisibilityIcon />} onClick={() => setPreviewAssignmentId(previewAssignmentId === a._id ? null : a._id)}>{previewAssignmentId === a._id ? 'Ẩn xem trước' : 'Xem trước'}</Button>
                                                <Button size="small" variant="outlined" startIcon={<DeleteIcon />} color="error" onClick={() => deleteAssignment(a._id)}>Xóa</Button>
                                                <Button size="small" variant={a.isPublished ? 'outlined' : 'contained'} startIcon={a.isPublished ? <UnpublishIcon /> : <PublishIcon />} onClick={() => togglePublish(a._id)}>{a.isPublished ? 'Bỏ xuất bản' : 'Xuất bản'}</Button>
                                            </Stack>
                                        </Stack>

                                        {previewAssignmentId === a._id && (
                                            <Box sx={{ mt: 2, p: 2, borderRadius: 1, bgcolor: 'background.paper' }}>
                                                <Typography variant="subtitle2" sx={{ mb: 1 }}>Xem trước bài tập</Typography>
                                                {a.type === 'quiz' && a.questions ? (
                                                    <Stack spacing={1}>
                                                        {a.questions.map((q, idx) => (
                                                            <Box key={q._id}>
                                                                <Stack direction="row" spacing={1} alignItems="center">
                                                                    <Typography variant="body2">Câu {idx + 1} ({q.points}đ)</Typography>
                                                                </Stack>
                                                                <Typography variant="body2" sx={{ mb: .5 }}>{q.question}</Typography>
                                                            </Box>
                                                        ))}
                                                    </Stack>
                                                ) : (
                                                    <Typography variant="body2">Bài tập yêu cầu nộp file {a.fileName && `(${a.fileName}${a.fileSize ? `, ${formatBytes(a.fileSize)}` : ''})`}</Typography>
                                                )}
                                            </Box>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </Stack>
                    )}
                </>
            )}
        </Container>
    );
};

export default AssignmentsManager;
