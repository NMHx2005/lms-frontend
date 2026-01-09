import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  TextField,
  Checkbox,
  LinearProgress,
  Stack,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Select,
  MenuItem
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Timer as TimerIcon,
  NavigateNext as NextIcon,
  NavigateBefore as PrevIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getQuizAttempts, submitQuizAttempt, QuizAttemptsSummary } from '@/services/client/quiz.service';

export interface QuizQuestion {
  question: string;
  type: 'multiple-choice' | 'true-false' | 'multiple-select' | 'fill-blank' | 'short-answer' | 'matching' | 'ordering' | 'essay';
  answers: string[];
  correctAnswer: number | number[] | string | { [key: string]: string } | number[]; // Support all types
  explanation?: string;
  points?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

export interface QuizSettings {
  timeLimit?: number; // Total time in seconds
  timeLimitPerQuestion?: number; // Time per question in seconds
  allowPause?: boolean;
  showProgress?: boolean;
  showTimer?: boolean;
  immediateFeedback?: boolean;
  showCorrectAnswers?: boolean;
  showExplanation?: boolean;
  randomizeQuestions?: boolean;
  randomizeAnswers?: boolean;
  maxAttempts?: number;
  passingScore?: number; // Percentage
  partialCredit?: boolean; // Partial credit for multiple-select
  negativeMarking?: boolean; // Negative marking for wrong answers
}

interface QuizPlayerProps {
  questions: QuizQuestion[];
  settings?: QuizSettings;
  lessonId?: string;
  courseId?: string;
  onComplete?: (results: QuizResults) => void;
  onExit?: () => void;
}

export interface QuizResults {
  score: number;
  totalPoints: number;
  percentage: number;
  correct: number;
  incorrect: number;
  unanswered: number;
  timeSpent: number;
  answers: Array<{
    questionIndex: number;
    answer: any;
    isCorrect: boolean;
    points: number;
  }>;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({
  questions,
  settings = {},
  lessonId,
  courseId,
  onComplete,
  onExit
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<any>>(new Array(questions.length).fill(null));
  const [reviewFlags, setReviewFlags] = useState<Set<number>>(new Set());
  const [timeRemaining, setTimeRemaining] = useState<number | null>(settings.timeLimit || null);
  const [questionTimeRemaining, setQuestionTimeRemaining] = useState<number | null>(settings.timeLimitPerQuestion || null);
  const [isPaused, setIsPaused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [startTime] = useState(Date.now());
  const [attemptsSummary, setAttemptsSummary] = useState<QuizAttemptsSummary | null>(null);
  const [loadingAttempts, setLoadingAttempts] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Shuffle questions if needed
  const [shuffledQuestions, setShuffledQuestions] = useState<QuizQuestion[]>(() => {
    let shuffled = [...questions];
    if (settings.randomizeQuestions) {
      shuffled = shuffled.sort(() => Math.random() - 0.5);
    }
    // Shuffle answers if needed
    if (settings.randomizeAnswers) {
      shuffled = shuffled.map(q => {
        if (q.type === 'multiple-choice' || q.type === 'true-false' || q.type === 'multiple-select') {
          const answers = [...q.answers];
          const correctAnswer = q.correctAnswer;
          // Shuffle answers array
          const shuffledAnswers = answers.sort(() => Math.random() - 0.5);
          // Find new index of correct answer
          let newCorrectAnswer: any = correctAnswer;
          if (typeof correctAnswer === 'number') {
            const originalAnswer = answers[correctAnswer];
            newCorrectAnswer = shuffledAnswers.indexOf(originalAnswer);
          } else if (Array.isArray(correctAnswer)) {
            newCorrectAnswer = correctAnswer.map((idx: number) => {
              const originalAnswer = answers[idx];
              return shuffledAnswers.indexOf(originalAnswer);
            });
          }
          return {
            ...q,
            answers: shuffledAnswers,
            correctAnswer: newCorrectAnswer
          };
        }
        return q;
      });
    }
    return shuffled;
  });

  // Load attempts on mount
  useEffect(() => {
    if (lessonId) {
      loadAttempts();
    }
  }, [lessonId]);

  const loadAttempts = async () => {
    if (!lessonId) return;
    try {
      setLoadingAttempts(true);
      const response = await getQuizAttempts(lessonId);
      if (response.success && response.data) {
        setAttemptsSummary(response.data);
      }
    } catch (error) {
      console.error('Error loading attempts:', error);
    } finally {
      setLoadingAttempts(false);
    }
  };

  // Timer effect
  useEffect(() => {
    if (isPaused || !timeRemaining) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, timeRemaining]);

  // Per-question timer
  useEffect(() => {
    if (isPaused || !questionTimeRemaining || !settings.timeLimitPerQuestion) return;

    const interval = setInterval(() => {
      setQuestionTimeRemaining(prev => {
        if (prev === null || prev <= 1) {
          handleNextQuestion();
          return settings.timeLimitPerQuestion || null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, questionTimeRemaining, currentQuestionIndex]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: any) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = value;
    setAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      if (settings.timeLimitPerQuestion) {
        setQuestionTimeRemaining(settings.timeLimitPerQuestion);
      }
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      if (settings.timeLimitPerQuestion) {
        setQuestionTimeRemaining(settings.timeLimitPerQuestion);
      }
    }
  };

  const handleToggleReview = () => {
    const newFlags = new Set(reviewFlags);
    if (newFlags.has(currentQuestionIndex)) {
      newFlags.delete(currentQuestionIndex);
    } else {
      newFlags.add(currentQuestionIndex);
    }
    setReviewFlags(newFlags);
  };

  const handleSubmit = async () => {
    const calculatedResults = calculateResults();
    
    // Check attempts limit
    if (attemptsSummary && settings.maxAttempts) {
      if (attemptsSummary.attempts.length >= settings.maxAttempts) {
        toast.error(`Bạn đã hết số lần làm bài (${settings.maxAttempts} lần)`);
        return;
      }
    }

    // Check cooldown period
    if (attemptsSummary && attemptsSummary.nextAttemptAvailableAt) {
      const now = new Date();
      const nextAttempt = new Date(attemptsSummary.nextAttemptAvailableAt);
      if (now < nextAttempt) {
        const minutesLeft = Math.ceil((nextAttempt.getTime() - now.getTime()) / 60000);
        toast.error(`Vui lòng đợi ${minutesLeft} phút nữa trước khi làm lại`);
        return;
      }
    }

    setSubmitting(true);
    try {
      // Submit to backend if lessonId provided
      if (lessonId) {
        await submitQuizAttempt(lessonId, {
          answers: calculatedResults.answers,
          score: calculatedResults.score,
          totalPoints: calculatedResults.totalPoints,
          percentage: calculatedResults.percentage,
          correct: calculatedResults.correct,
          incorrect: calculatedResults.incorrect,
          unanswered: calculatedResults.unanswered,
          timeSpent: calculatedResults.timeSpent
        });
        // Reload attempts
        await loadAttempts();
      }

      setResults(calculatedResults);
      setShowResults(true);
      if (onComplete) {
        onComplete(calculatedResults);
      }
      toast.success('Đã nộp bài thành công!');
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi nộp bài');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAutoSubmit = () => {
    toast.warning('Hết thời gian! Tự động nộp bài...');
    handleSubmit();
  };

  const calculateResults = (): QuizResults => {
    let totalPoints = 0;
    let earnedPoints = 0;
    let correct = 0;
    let incorrect = 0;
    let unanswered = 0;

    const answerDetails = shuffledQuestions.map((question, index) => {
      const userAnswer = answers[index];
      const points = question.points || 10;
      totalPoints += points;

      let isCorrect = false;
      let earned = 0;

      if (userAnswer === null || userAnswer === undefined || userAnswer === '') {
        unanswered++;
      } else {
        // Check answer based on question type
        switch (question.type) {
          case 'multiple-choice':
          case 'true-false':
            isCorrect = userAnswer === question.correctAnswer;
            break;
          case 'multiple-select':
            const correctAnswers = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
            const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
            isCorrect = correctAnswers.length === userAnswers.length &&
              correctAnswers.every(ans => userAnswers.includes(ans));
            // Partial credit
            if (settings.partialCredit && !isCorrect) {
              const matches = userAnswers.filter(ans => correctAnswers.includes(ans)).length;
              earned = (matches / correctAnswers.length) * points;
            }
            break;
          case 'fill-blank':
          case 'short-answer':
            isCorrect = String(userAnswer).toLowerCase().trim() === String(question.correctAnswer).toLowerCase().trim();
            break;
          case 'matching':
            // Complex matching logic
            isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
            break;
          case 'ordering':
            isCorrect = JSON.stringify(userAnswer) === JSON.stringify(question.correctAnswer);
            break;
          case 'essay':
            // Essay is always manual grading
            isCorrect = false;
            earned = 0;
            break;
        }

        if (isCorrect) {
          correct++;
          earned = points;
        } else {
          incorrect++;
          if (settings.negativeMarking) {
            earned = -points * 0.25; // -25% for wrong answer
          }
        }
      }

      earnedPoints += earned;

      return {
        questionIndex: index,
        answer: userAnswer,
        isCorrect,
        points: earned
      };
    });

    return {
      score: earnedPoints,
      totalPoints,
      percentage: totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0,
      correct,
      incorrect,
      unanswered,
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
      answers: answerDetails
    };
  };

  const currentQuestion = shuffledQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / shuffledQuestions.length) * 100;
  const answeredCount = answers.filter(a => a !== null && a !== undefined && a !== '').length;

  if (showResults && results) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ mb: 3, textAlign: 'center' }}>
            Kết Quả Quiz
          </Typography>

          <Stack spacing={3} alignItems="center">
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h2" color={results.percentage >= (settings.passingScore || 60) ? 'success.main' : 'error.main'}>
                {results.percentage}%
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {results.score} / {results.totalPoints} điểm
              </Typography>
            </Box>

            <Stack direction="row" spacing={3}>
              <Chip label={`Đúng: ${results.correct}`} color="success" />
              <Chip label={`Sai: ${results.incorrect}`} color="error" />
              <Chip label={`Chưa trả lời: ${results.unanswered}`} />
              <Chip label={`Thời gian: ${formatTime(results.timeSpent)}`} />
            </Stack>

            {results.percentage >= (settings.passingScore || 60) && (
              <Alert severity="success">Chúc mừng! Bạn đã vượt qua bài quiz!</Alert>
            )}

            {settings.showCorrectAnswers && (
              <Box sx={{ width: '100%', mt: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>Chi Tiết Đáp Án</Typography>
                <List>
                  {shuffledQuestions.map((question, index) => {
                    const answerDetail = results.answers[index];
                    return (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={
                              <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Typography variant="body1" component="span" sx={{ fontWeight: 600 }}>
                                  Câu {index + 1}: {question.question}
                                </Typography>
                                {answerDetail.isCorrect ? (
                                  <CheckCircleIcon color="success" />
                                ) : (
                                  <CancelIcon color="error" />
                                )}
                              </span>
                            }
                            secondary={
                              <>
                                <Typography variant="body2" component="span" display="block" sx={{ mt: 1 }}>
                                  <strong>Đáp án của bạn:</strong> {String(answerDetail.answer || 'Chưa trả lời')}
                                </Typography>
                                <Typography variant="body2" component="span" display="block" color="success.main">
                                  <strong>Đáp án đúng:</strong> {String(question.correctAnswer)}
                                </Typography>
                                {question.explanation && settings.showExplanation && (
                                  <Typography variant="body2" component="span" display="block" color="text.secondary" sx={{ mt: 1 }}>
                                    <strong>Giải thích:</strong> {question.explanation}
                                  </Typography>
                                )}
                                <Typography variant="caption" component="span" display="block" color="text.secondary">
                                  Điểm: {answerDetail.points} / {question.points || 10}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </React.Fragment>
                    );
                  })}
                </List>
              </Box>
            )}

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={onExit}>
                Thoát
              </Button>
              {settings.maxAttempts && (
                <Button variant="contained" onClick={() => window.location.reload()}>
                  Làm Lại
                </Button>
              )}
            </Stack>
          </Stack>
        </Paper>
      </Box>
    );
  }

  // Show attempts info if available
  if (attemptsSummary && attemptsSummary.attempts.length > 0 && !showResults) {
    const bestScore = attemptsSummary.bestScore;
    const remaining = attemptsSummary.remainingAttempts;
    const canRetake = attemptsSummary.canRetake;
    
    if (!canRetake && remaining === 0) {
      return (
        <Box sx={{ p: 3 }}>
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Alert severity="warning" sx={{ mb: 2 }}>
              Bạn đã hết số lần làm bài (Đã làm {attemptsSummary.attempts.length}/{settings.maxAttempts} lần)
            </Alert>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Điểm cao nhất: {bestScore}%
            </Typography>
            <Button variant="outlined" onClick={onExit}>
              Quay lại
            </Button>
          </Paper>
        </Box>
      );
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header with progress and timer */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 1 }}>
              Câu {currentQuestionIndex + 1} / {shuffledQuestions.length}
            </Typography>
            {settings.showProgress && (
              <LinearProgress variant="determinate" value={progress} sx={{ width: 200, height: 8, borderRadius: 1 }} />
            )}
          </Box>
          <Stack direction="row" spacing={2} alignItems="center">
            {attemptsSummary && attemptsSummary.attempts.length > 0 && (
              <Chip
                label={`Lần ${attemptsSummary.attempts.length + 1}${settings.maxAttempts ? `/${settings.maxAttempts}` : ''}`}
                size="small"
                color="info"
              />
            )}
            {settings.showTimer && timeRemaining !== null && (
              <Chip
                icon={<TimerIcon />}
                label={formatTime(timeRemaining)}
                color={timeRemaining < 60 ? 'error' : 'default'}
              />
            )}
            {settings.timeLimitPerQuestion && questionTimeRemaining !== null && (
              <Chip
                icon={<TimerIcon />}
                label={`Câu: ${formatTime(questionTimeRemaining)}`}
                size="small"
              />
            )}
            {settings.allowPause && (
              <Button
                size="small"
                variant="outlined"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? 'Tiếp tục' : 'Tạm dừng'}
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Question */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            {currentQuestion.question}
          </Typography>
          {currentQuestion.points && (
            <Chip label={`${currentQuestion.points} điểm`} size="small" sx={{ mb: 2 }} />
          )}

          {/* Render question based on type */}
          {currentQuestion.type === 'multiple-choice' && (
            <FormControl component="fieldset">
              <RadioGroup
                value={answers[currentQuestionIndex] !== null && answers[currentQuestionIndex] !== undefined ? String(answers[currentQuestionIndex]) : ''}
                onChange={(e) => handleAnswerChange(Number(e.target.value))}
              >
                {currentQuestion.answers.map((answer, index) => (
                  <FormControlLabel
                    key={index}
                    value={String(index)}
                    control={<Radio />}
                    label={answer}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          )}

          {currentQuestion.type === 'true-false' && (
            <FormControl component="fieldset">
              <RadioGroup
                value={answers[currentQuestionIndex] !== null && answers[currentQuestionIndex] !== undefined ? String(answers[currentQuestionIndex]) : ''}
                onChange={(e) => handleAnswerChange(Number(e.target.value))}
              >
                <FormControlLabel value="0" control={<Radio />} label="Đúng" />
                <FormControlLabel value="1" control={<Radio />} label="Sai" />
              </RadioGroup>
            </FormControl>
          )}

          {currentQuestion.type === 'multiple-select' && (
            <FormControl component="fieldset">
              <FormLabel component="legend">Chọn tất cả đáp án đúng:</FormLabel>
              {currentQuestion.answers.map((answer, index) => (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      checked={(answers[currentQuestionIndex] || []).includes(index)}
                      onChange={(e) => {
                        const current = answers[currentQuestionIndex] || [];
                        const newAnswer = e.target.checked
                          ? [...current, index]
                          : current.filter((i: number) => i !== index);
                        handleAnswerChange(newAnswer);
                      }}
                    />
                  }
                  label={answer}
                />
              ))}
            </FormControl>
          )}

          {currentQuestion.type === 'fill-blank' && (
            <TextField
              fullWidth
              label="Điền vào chỗ trống"
              value={answers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Nhập đáp án..."
            />
          )}

          {currentQuestion.type === 'short-answer' && (
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Trả lời ngắn"
              value={answers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Nhập câu trả lời của bạn..."
            />
          )}

          {currentQuestion.type === 'essay' && (
            <TextField
              fullWidth
              multiline
              rows={8}
              label="Tự luận"
              value={answers[currentQuestionIndex] || ''}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Viết câu trả lời chi tiết của bạn..."
            />
          )}

          {currentQuestion.type === 'matching' && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Kéo thả hoặc chọn để ghép các mục ở cột trái với các mục ở cột phải:
              </Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                {/* Left column - Items to match */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Cột A</Typography>
                  {currentQuestion.answers.slice(0, currentQuestion.answers.length / 2).map((item, index) => (
                    <Paper key={index} sx={{ p: 2, mb: 1, bgcolor: 'grey.100' }}>
                      <Typography variant="body2">{item}</Typography>
                    </Paper>
                  ))}
                </Box>
                {/* Right column - Matches */}
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Cột B</Typography>
                  {currentQuestion.answers.slice(currentQuestion.answers.length / 2).map((match, index) => {
                    const leftIndex = index;
                    const currentAnswer = answers[currentQuestionIndex] || {};
                    const selectedMatch = currentAnswer[leftIndex];
                    return (
                      <FormControl key={index} fullWidth sx={{ mb: 1 }}>
                        <Select
                          value={selectedMatch || ''}
                          onChange={(e) => {
                            const newAnswer = { ...currentAnswer, [leftIndex]: e.target.value };
                            handleAnswerChange(newAnswer);
                          }}
                          displayEmpty
                        >
                          <MenuItem value="">-- Chọn --</MenuItem>
                          {currentQuestion.answers.slice(currentQuestion.answers.length / 2).map((m, idx) => (
                            <MenuItem key={idx} value={idx + currentQuestion.answers.length / 2}>
                              {m}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    );
                  })}
                </Box>
              </Box>
            </Box>
          )}

          {currentQuestion.type === 'ordering' && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Sắp xếp các mục theo thứ tự đúng bằng cách kéo thả:
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                {(answers[currentQuestionIndex] || currentQuestion.answers.map((_, i) => i)).map((itemIndex: number, orderIndex: number) => (
                  <Paper
                    key={orderIndex}
                    sx={{
                      p: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      cursor: 'move',
                      bgcolor: 'grey.50',
                      '&:hover': { bgcolor: 'grey.100' }
                    }}
                  >
                    <Typography variant="body2" sx={{ minWidth: 30, fontWeight: 600 }}>
                      {orderIndex + 1}.
                    </Typography>
                    <FormControl fullWidth>
                      <Select
                        value={itemIndex}
                        onChange={(e) => {
                          const currentOrder = answers[currentQuestionIndex] || currentQuestion.answers.map((_, i) => i);
                          const newOrder = [...currentOrder];
                          newOrder[orderIndex] = Number(e.target.value);
                          handleAnswerChange(newOrder);
                        }}
                      >
                        {currentQuestion.answers.map((answer, idx) => (
                          <MenuItem key={idx} value={idx} disabled={currentOrder.includes(idx) && currentOrder.indexOf(idx) !== orderIndex}>
                            {answer}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Paper>
                ))}
              </Box>
            </Box>
          )}
        </Box>

        {/* Navigation */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Button
            startIcon={<PrevIcon />}
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Câu trước
          </Button>

          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<FlagIcon />}
              variant={reviewFlags.has(currentQuestionIndex) ? 'contained' : 'outlined'}
              onClick={handleToggleReview}
            >
              Đánh dấu
            </Button>
            <Chip label={`Đã trả lời: ${answeredCount}/${shuffledQuestions.length}`} />
          </Stack>

          {currentQuestionIndex < shuffledQuestions.length - 1 ? (
            <Button
              endIcon={<NextIcon />}
              onClick={handleNextQuestion}
              variant="contained"
            >
              Câu sau
            </Button>
          ) : (
            <Button
              variant="contained"
              color="success"
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? 'Đang nộp...' : 'Nộp bài'}
            </Button>
          )}
        </Stack>
      </Paper>
    </Box>
  );
};

export default QuizPlayer;
