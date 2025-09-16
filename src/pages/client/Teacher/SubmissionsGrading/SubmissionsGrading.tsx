import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Breadcrumbs, Grid, Card, CardContent, CardActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Avatar, Chip, Stack, Divider } from '@mui/material';

interface Course { _id: string; title: string; description: string; thumbnail: string; isPublished: boolean; studentCount: number }
interface QuizQuestion { _id: string; question: string; type: 'multiple_choice' | 'true_false' | 'short_answer'; options?: string[]; correctAnswer: string | string[]; points: number }
interface Assignment { _id: string; title: string; description: string; type: 'file' | 'quiz'; maxScore: number; dueDate: string; courseId: string; questions?: QuizQuestion[]; timeLimit?: number }
interface QuizAnswer { questionId: string; answer: string | string[]; isCorrect?: boolean; points?: number }
interface Submission { _id: string; studentId: string; studentName: string; studentEmail: string; studentAvatar: string; submittedAt: string; status: 'submitted' | 'graded' | 'late'; score: number; maxScore: number; feedback?: string; gradedBy?: string; gradedAt?: string; assignmentId: string; fileUrl?: string; fileName?: string; fileSize?: number; answers?: QuizAnswer[]; timeSpent?: number }

const SubmissionsGrading: React.FC = () => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [selectedCourseId, setSelectedCourseId] = useState<string>('');
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>('');
    const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSubmission, setSelectedSubmission] = useState<string | null>(null);
    const [gradingMode, setGradingMode] = useState<'list' | 'grading'>('list');
    const [currentGrading, setCurrentGrading] = useState<{ submissionId: string; score: number; feedback: string }>({ submissionId: '', score: 0, feedback: '' });

    useEffect(() => {
        setTimeout(() => {
            const mockCourses: Course[] = [
                { _id: 'course1', title: 'React Advanced Patterns', description: 'Học React từ cơ bản đến nâng cao', thumbnail: '/images/react-course.jpg', isPublished: true, studentCount: 45 },
                { _id: 'course2', title: 'Node.js Backend Development', description: 'Xây dựng backend với Node.js và Express', thumbnail: '/images/nodejs-course.jpg', isPublished: true, studentCount: 32 },
                { _id: 'course3', title: 'Python Data Science', description: 'Phân tích dữ liệu với Python', thumbnail: '/images/python-course.jpg', isPublished: false, studentCount: 28 }
            ];
            setCourses(mockCourses);
            if (mockCourses.length > 0) { setSelectedCourseId(mockCourses[0]._id); setSelectedCourse(mockCourses[0]); }
            setLoading(false);
        }, 600);
    }, []);

    useEffect(() => {
        if (!selectedCourseId) return;
        setTimeout(() => {
            const mockAssignments: Assignment[] = [
                { _id: 'assignment1', title: 'Bài tập thực hành useState', description: 'Tạo một ứng dụng counter sử dụng useState hook với các tính năng tăng, giảm và reset.', type: 'file', maxScore: 100, dueDate: '2024-02-01T23:59:00Z', courseId: selectedCourseId, questions: [{ _id: 'q1', question: 'useState hook được sử dụng để làm gì?', type: 'multiple_choice', options: ['Quản lý side effects', 'Quản lý state trong functional component', 'Tối ưu hiệu suất', 'Xử lý lifecycle'], correctAnswer: 'Quản lý state trong functional component', points: 10 }, { _id: 'q2', question: 'useEffect hook chạy sau mỗi lần render.', type: 'true_false', correctAnswer: 'true', points: 5 }] },
                { _id: 'assignment2', title: 'Quiz kiểm tra kiến thức Hooks', description: 'Bài quiz kiểm tra hiểu biết về React Hooks cơ bản.', type: 'quiz', maxScore: 50, dueDate: '2024-02-05T23:59:00Z', courseId: selectedCourseId, timeLimit: 45 }
            ];
            setAssignments(mockAssignments);
            if (mockAssignments.length > 0) { setSelectedAssignmentId(mockAssignments[0]._id); setSelectedAssignment(mockAssignments[0]); }
        }, 400);
    }, [selectedCourseId]);

    useEffect(() => {
        if (!selectedAssignmentId) return;
        setTimeout(() => {
            const mockSubmissions: Submission[] = [
                { _id: 's1', studentId: 'st1', studentName: 'Nguyễn Văn A', studentEmail: 'nguyenvana@example.com', studentAvatar: '/images/default-avatar.png', submittedAt: '2024-01-30T14:30:00Z', status: 'submitted', score: 0, maxScore: 100, assignmentId: selectedAssignmentId, fileUrl: 'https://example.com/submission1.zip', fileName: 'counter-app.zip', fileSize: 1048576 },
                { _id: 's2', studentId: 'st2', studentName: 'Trần Thị B', studentEmail: 'tranthib@example.com', studentAvatar: '/images/default-avatar.png', submittedAt: '2024-01-31T09:15:00Z', status: 'graded', score: 85, maxScore: 100, feedback: 'Bài làm tốt, code rõ ràng và có comment. Cần cải thiện về responsive design.', gradedBy: 'Hieu Doan', gradedAt: '2024-02-01T10:00:00Z', assignmentId: selectedAssignmentId, fileUrl: 'https://example.com/submission2.zip', fileName: 'react-counter.zip', fileSize: 2097152 },
                { _id: 's3', studentId: 'st3', studentName: 'Lê Văn C', studentEmail: 'levanc@example.com', studentAvatar: '/images/default-avatar.png', submittedAt: '2024-02-02T16:45:00Z', status: 'late', score: 0, maxScore: 100, assignmentId: selectedAssignmentId, fileUrl: 'https://example.com/submission3.zip', fileName: 'my-counter.zip', fileSize: 1572864 }
            ];
            setSubmissions(mockSubmissions);
        }, 300);
    }, [selectedAssignmentId]);

    const handleCourseChange = (courseId: string) => {
        setSelectedCourseId(courseId);
        setSelectedCourse(courses.find(c => c._id === courseId) || null);
        setAssignments([]);
        setSelectedAssignmentId('');
        setSelectedAssignment(null);
        setSubmissions([]);
    };

    const handleAssignmentChange = (assignmentId: string) => {
        setSelectedAssignmentId(assignmentId);
        setSelectedAssignment(assignments.find(a => a._id === assignmentId) || null);
        setSubmissions([]);
    };

    const handleGradeSubmission = (submissionId: string) => {
        const submission = submissions.find(s => s._id === submissionId);
        if (!submission || !selectedAssignment) return;
        setCurrentGrading({ submissionId, score: submission.score, feedback: submission.feedback || '' });
        setSelectedSubmission(submissionId);
        setGradingMode('grading');
    };

    const handleSaveGrade = () => {
        if (!selectedAssignment) return;
        if (currentGrading.score < 0 || currentGrading.score > selectedAssignment.maxScore) { alert(`Điểm phải từ 0 đến ${selectedAssignment.maxScore}`); return; }
        setSubmissions(prev => prev.map(s => s._id === currentGrading.submissionId ? { ...s, score: currentGrading.score, feedback: currentGrading.feedback, status: 'graded', gradedBy: 'Hieu Doan', gradedAt: new Date().toISOString() } : s));
        setGradingMode('list');
        setSelectedSubmission(null);
        setCurrentGrading({ submissionId: '', score: 0, feedback: '' });
    };

    const handleBackToList = () => { setGradingMode('list'); setSelectedSubmission(null); setCurrentGrading({ submissionId: '', score: 0, feedback: '' }); };
    const formatBytes = (bytes?: number) => { if (!bytes) return ''; const u = ['B', 'KB', 'MB', 'GB']; let i = 0, b = bytes; while (b >= 1024 && i < u.length - 1) { b /= 1024; i++; } return `${b.toFixed(1)} ${u[i]}`; };
    const formatDate = (s: string) => new Date(s).toLocaleString('vi-VN');
    const stats = (() => { const t = submissions.length; const sub = submissions.filter(s => s.status === 'submitted').length; const g = submissions.filter(s => s.status === 'graded').length; const l = submissions.filter(s => s.status === 'late').length; const avg = g > 0 ? (submissions.filter(s => s.status === 'graded').reduce((x, s) => x + s.score, 0) / g) : 0; return { total: t, submitted: sub, graded: g, late: l, avg }; })();

    if (loading) return (<Container maxWidth="xl" sx={{ py: 6 }}><Typography align="center">Đang tải dữ liệu...</Typography></Container>);
    if (courses.length === 0) return (<Container maxWidth="xl" sx={{ py: 3 }}><Typography variant="h5">Bạn chưa có khóa học nào</Typography><Typography color="text.secondary">Tạo khóa học đầu tiên để bắt đầu chấm bài nộp.</Typography></Container>);

    if (gradingMode === 'grading' && selectedSubmission) {
        const submission = submissions.find(s => s._id === selectedSubmission);
        if (!submission) return null;
        return (
            <Container maxWidth="xl" sx={{ py: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">Assignments</Typography>
                    <Typography color="text.secondary">Chấm điểm</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>Chấm điểm bài tập: {selectedAssignment?.title}</Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={4}>
                        <Card><CardContent>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                <Avatar src={submission.studentAvatar} alt={submission.studentName} />
                                <Box><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{submission.studentName}</Typography><Typography variant="body2" color="text.secondary">{submission.studentEmail}</Typography></Box>
                            </Stack>
                            <Stack spacing={1}>
                                <Stack direction="row" spacing={1}><Typography variant="body2" color="text.secondary">Nộp:</Typography><Typography variant="body2">{formatDate(submission.submittedAt)}</Typography></Stack>
                                <Stack direction="row" spacing={1}><Typography variant="body2" color="text.secondary">Trạng thái:</Typography><Chip size="small" label={submission.status === 'submitted' ? 'Chờ chấm' : submission.status === 'graded' ? 'Đã chấm' : 'Nộp muộn'} color={submission.status === 'graded' ? 'success' : submission.status === 'late' ? 'warning' : 'default'} /></Stack>
                                {submission.timeSpent && (<Stack direction="row" spacing={1}><Typography variant="body2" color="text.secondary">Thời gian làm:</Typography><Typography variant="body2">{submission.timeSpent} phút</Typography></Stack>)}
                            </Stack>
                        </CardContent></Card>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Card><CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>Nội dung bài tập</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{selectedAssignment?.description}</Typography>
                            {submission.fileUrl && (<Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}><Typography variant="body2">File:</Typography><Button size="small" onClick={() => window.open(submission.fileUrl, '_blank')}>{submission.fileName || 'Tải file bài nộp'} {submission.fileSize ? `(${formatBytes(submission.fileSize)})` : ''}</Button></Stack>)}
                            {selectedAssignment?.type === 'quiz' && submission.answers && (<Box><Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Đáp án của học viên</Typography><Stack spacing={2}>{submission.answers.map((ans, idx) => { const q = selectedAssignment.questions?.find(q => q._id === ans.questionId); if (!q) return null; return (<Box key={ans.questionId}><Stack direction="row" spacing={1} alignItems="center" sx={{ mb: .5 }}><Typography variant="body2" sx={{ fontWeight: 600 }}>Câu {idx + 1}</Typography><Typography variant="caption" color="text.secondary">({q.points} điểm)</Typography></Stack><Typography variant="body2" sx={{ mb: .5 }}>{q.question}</Typography><Typography variant="body2"><b>Đáp án học viên:</b> {Array.isArray(ans.answer) ? ans.answer.join(', ') : ans.answer}</Typography><Typography variant="body2" color="success.main"><b>Đáp án đúng:</b> {Array.isArray(q.correctAnswer) ? q.correctAnswer.join(', ') : q.correctAnswer}</Typography></Box>); })}</Stack></Box>)}
                        </CardContent></Card>
                    </Grid>
                    <Grid item xs={12}>
                        <Card><CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Chấm điểm</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={4}><TextField fullWidth type="number" label="Điểm số" value={currentGrading.score} onChange={(e) => setCurrentGrading(prev => ({ ...prev, score: parseInt(e.target.value, 10) || 0 }))} /></Grid>
                                <Grid item xs={12} md={8}><TextField fullWidth multiline rows={3} label="Nhận xét" placeholder="Nhập nhận xét và góp ý..." value={currentGrading.feedback} onChange={(e) => setCurrentGrading(prev => ({ ...prev, feedback: e.target.value }))} /></Grid>
                            </Grid>
                        </CardContent><CardActions><Button variant="outlined" onClick={handleBackToList}>Hủy</Button><Button variant="contained" onClick={handleSaveGrade}>Lưu điểm và nhận xét</Button></CardActions></Card>
                    </Grid>
                </Grid>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 3 }}>
            <Box sx={{ mb: 3 }}>
                <Breadcrumbs sx={{ mb: 1 }}>
                    <Typography color="text.primary">Teacher Dashboard</Typography>
                    <Typography color="text.secondary">Assignments</Typography>
                    <Typography color="text.secondary">Chấm điểm</Typography>
                </Breadcrumbs>
                <Typography variant="h4" sx={{ fontWeight: 700 }}>Chấm điểm bài tập</Typography>
            </Box>
            <Card sx={{ mb: 3 }}><CardContent>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Chọn khóa học</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}><FormControl fullWidth><InputLabel>Khóa học</InputLabel><Select label="Khóa học" value={selectedCourseId} onChange={(e) => handleCourseChange(e.target.value)} MenuProps={{ disableScrollLock: true }}>{courses.map(c => (<MenuItem key={c._id} value={c._id}>{c.title}{!c.isPublished && ' (Bản nháp)'}</MenuItem>))}</Select></FormControl></Grid>
                    {selectedCourse && (<Grid item xs={12} md={6}><Card variant="outlined"><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{selectedCourse.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{selectedCourse.description}</Typography><Stack direction="row" spacing={2}><Chip label={`${selectedCourse.studentCount} học viên`} size="small" /><Chip label={selectedCourse.isPublished ? 'Đã xuất bản' : 'Bản nháp'} color={selectedCourse.isPublished ? 'success' : 'default'} size="small" /></Stack></CardContent></Card></Grid>)}
                </Grid>
            </CardContent></Card>
            {selectedCourse && (<Card sx={{ mb: 3 }}><CardContent><Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Chọn bài tập</Typography><Grid container spacing={2}><Grid item xs={12} md={6}><FormControl fullWidth><InputLabel>Bài tập</InputLabel><Select label="Bài tập" value={selectedAssignmentId} onChange={(e) => handleAssignmentChange(e.target.value)} MenuProps={{ disableScrollLock: true }}><MenuItem value="">-- Chọn bài tập --</MenuItem>{assignments.map(a => (<MenuItem key={a._id} value={a._id}>{a.title} ({a.type === 'file' ? 'Nộp file' : 'Quiz'})</MenuItem>))}</Select></FormControl></Grid>{selectedAssignment && (<Grid item xs={12} md={6}><Card variant="outlined"><CardContent><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{selectedAssignment.title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{selectedAssignment.description}</Typography><Stack direction="row" spacing={2}><Chip label={`Điểm tối đa: ${selectedAssignment.maxScore}`} size="small" /><Chip label={`Hạn nộp: ${formatDate(selectedAssignment.dueDate)}`} size="small" /><Chip label={`Loại: ${selectedAssignment.type === 'file' ? 'Nộp file' : 'Quiz'}`} size="small" /></Stack></CardContent></Card></Grid>)}</Grid></CardContent></Card>)}
            {selectedAssignment && (<><Grid container spacing={3} sx={{ mb: 1 }}><Grid item xs={12} md={2}><Card variant="outlined"><CardContent><Typography align="center" variant="h6">{stats.total}</Typography><Typography align="center" variant="caption" color="text.secondary">Tổng nộp</Typography></CardContent></Card></Grid><Grid item xs={12} md={2}><Card variant="outlined"><CardContent><Typography align="center" variant="h6">{stats.submitted}</Typography><Typography align="center" variant="caption" color="text.secondary">Chờ chấm</Typography></CardContent></Card></Grid><Grid item xs={12} md={2}><Card variant="outlined"><CardContent><Typography align="center" variant="h6">{stats.graded}</Typography><Typography align="center" variant="caption" color="text.secondary">Đã chấm</Typography></CardContent></Card></Grid><Grid item xs={12} md={2}><Card variant="outlined"><CardContent><Typography align="center" variant="h6">{stats.late}</Typography><Typography align="center" variant="caption" color="text.secondary">Nộp muộn</Typography></CardContent></Card></Grid><Grid item xs={12} md={4}><Card variant="outlined"><CardContent><Typography align="center" variant="h6">{stats.graded > 0 ? stats.avg.toFixed(1) : '—'}</Typography><Typography align="center" variant="caption" color="text.secondary">Điểm TB</Typography></CardContent></Card></Grid></Grid><Card><CardContent><Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}><Typography variant="h6" sx={{ fontWeight: 600 }}>Danh sách bài nộp ({submissions.length})</Typography><FormControl size="small" sx={{ minWidth: 220 }}><InputLabel>Trạng thái</InputLabel><Select label="Trạng thái" defaultValue="all" MenuProps={{ disableScrollLock: true }}><MenuItem value="all">Tất cả</MenuItem><MenuItem value="submitted">Chờ chấm</MenuItem><MenuItem value="graded">Đã chấm</MenuItem><MenuItem value="late">Nộp muộn</MenuItem></Select></FormControl></Stack>{submissions.length === 0 ? (<Typography align="center" color="text.secondary">Chưa có bài nộp nào</Typography>) : (<Grid container spacing={2}>{submissions.map(s => (<Grid key={s._id} item xs={12} md={6} lg={4}><Card variant="outlined"><CardContent><Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}><Stack direction="row" spacing={1} alignItems="center"><Avatar src={s.studentAvatar} alt={s.studentName} /><Box><Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{s.studentName}</Typography><Typography variant="caption" color="text.secondary">{s.studentEmail}</Typography></Box></Stack><Chip size="small" label={s.status === 'submitted' ? 'Chờ chấm' : s.status === 'graded' ? 'Đã chấm' : 'Nộp muộn'} color={s.status === 'graded' ? 'success' : s.status === 'late' ? 'warning' : 'default'} /></Stack><Stack spacing={1}><Stack direction="row" spacing={1}><Typography variant="body2" color="text.secondary">Nộp:</Typography><Typography variant="body2">{formatDate(s.submittedAt)}</Typography></Stack>{s.timeSpent && (<Stack direction="row" spacing={1}><Typography variant="body2" color="text.secondary">Thời gian:</Typography><Typography variant="body2">{s.timeSpent} phút</Typography></Stack>)}{s.fileUrl && (<Stack direction="row" spacing={1} alignItems="center"><Typography variant="body2">File:</Typography><Button size="small" onClick={() => window.open(s.fileUrl, '_blank')}>{s.fileName || 'Tải file bài nộp'} {s.fileSize ? `(${formatBytes(s.fileSize)})` : ''}</Button></Stack>)}{s.status === 'graded' && (<Box><Typography variant="body2"><b>Điểm:</b> {s.score} / {s.maxScore}</Typography>{s.feedback && (<Typography variant="body2" color="text.secondary"><b>Nhận xét:</b> {s.feedback}</Typography>)}<Divider sx={{ my: 1 }} /><Typography variant="caption" color="text.secondary">Chấm bởi: {s.gradedBy} • {s.gradedAt ? formatDate(s.gradedAt) : ''}</Typography></Box>)}</Stack></CardContent><CardActions><Button variant="contained" onClick={() => handleGradeSubmission(s._id)}>{s.status === 'graded' ? 'Chỉnh sửa điểm' : 'Chấm điểm'}</Button><Button variant="outlined" onClick={() => window.open(s.fileUrl, '_blank')}>Xem bài nộp</Button></CardActions></Card></Grid>))}</Grid>)}</CardContent></Card></>)}
        </Container>
    );
};

export default SubmissionsGrading;
