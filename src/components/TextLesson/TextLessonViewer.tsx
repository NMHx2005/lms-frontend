import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Chip,
  Tooltip,
  Paper,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  ArrowUpward as ArrowUpwardIcon,
  Print as PrintIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
// Syntax highlighting will be handled by CSS and TinyMCE's codesample plugin

interface TextLessonViewerProps {
  title: string;
  content: string;
  estimatedTime?: number;
  onComplete?: () => void;
  onProgressUpdate?: (progress: number) => void;
}

const TextLessonViewer: React.FC<TextLessonViewerProps> = ({
  title,
  content,
  estimatedTime,
  onComplete,
  onProgressUpdate,
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [scrollDepth, setScrollDepth] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [columnWidth, setColumnWidth] = useState(800);
  const [showTOC, setShowTOC] = useState(false);
  const [tocItems, setTocItems] = useState<Array<{ id: string; text: string; level: number }>>([]);
  const [wordCount, setWordCount] = useState(0);
  const [readingSpeed] = useState(200); // words per minute

  const contentRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const timeSpentIntervalRef = useRef<number | null>(null);

  // Extract headings for TOC
  useEffect(() => {
    if (contentRef.current) {
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      const items: Array<{ id: string; text: string; level: number }> = [];
      
      headings.forEach((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        const level = parseInt(heading.tagName.charAt(1));
        items.push({
          id,
          text: heading.textContent || '',
          level,
        });
      });
      
      setTocItems(items);
    }
  }, [content]);

  // Calculate word count
  useEffect(() => {
    if (contentRef.current) {
      const text = contentRef.current.innerText || '';
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);
    }
  }, [content]);

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;

      const element = contentRef.current;
      const scrollTop = element.scrollTop;
      const scrollHeight = element.scrollHeight - element.clientHeight;
      const progress = scrollHeight > 0 ? Math.round((scrollTop / scrollHeight) * 100) : 0;
      
      setReadingProgress(progress);
      setScrollDepth(progress);
      
      if (onProgressUpdate) {
        onProgressUpdate(progress);
      }

      // Auto-complete at 90% scroll
      if (progress >= 90 && onComplete) {
        onComplete();
      }

      // Clear existing timer
      if (scrollTimerRef.current) {
        clearTimeout(scrollTimerRef.current);
      }

      // Update scroll depth after scroll stops
      scrollTimerRef.current = window.setTimeout(() => {
        // Scroll depth tracking logic here
      }, 150);
    };

    const element = contentRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => {
        element.removeEventListener('scroll', handleScroll);
        if (scrollTimerRef.current) {
          clearTimeout(scrollTimerRef.current);
        }
      };
    }
  }, [onComplete, onProgressUpdate]);

  // Track time spent
  useEffect(() => {
    timeSpentIntervalRef.current = window.setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => {
      if (timeSpentIntervalRef.current) {
        clearInterval(timeSpentIntervalRef.current);
      }
    };
  }, []);

  // Calculate estimated reading time
  const estimatedReadingTime = Math.ceil(wordCount / readingSpeed);
  const actualReadingTime = Math.floor(timeSpent / 60);

  // Scroll to heading
  const scrollToHeading = useCallback((id: string) => {
    const element = document.getElementById(id);
    if (element && contentRef.current) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setShowTOC(false);
    }
  }, []);

  // Scroll to top
  const scrollToTop = useCallback(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Print lesson
  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  // Share lesson
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `Check out this lesson: ${title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // Show toast notification
    }
  }, [title]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: isDarkMode ? '#1e1e1e' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#000000',
        transition: 'background-color 0.3s, color 0.3s',
      }}
    >
      {/* Progress Bar */}
      <LinearProgress
        variant="determinate"
        value={readingProgress}
        sx={{
          height: 4,
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      />

      {/* Header */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          position: 'sticky',
          top: 4,
          zIndex: 999,
          bgcolor: isDarkMode ? '#2d2d2d' : '#ffffff',
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton onClick={() => setShowTOC(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <Chip
              label={`${readingProgress}% đã đọc`}
              size="small"
              color="primary"
            />
            <Chip
              label={`${estimatedReadingTime || estimatedTime || 0} phút`}
              size="small"
              variant="outlined"
            />
            <Tooltip title="Dark Mode">
              <IconButton onClick={() => setIsDarkMode(!isDarkMode)}>
                {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Focus Mode">
              <IconButton onClick={() => setIsFocusMode(!isFocusMode)}>
                {isFocusMode ? <VisibilityOffIcon /> : <VisibilityIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Print">
              <IconButton onClick={handlePrint}>
                <PrintIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Share">
              <IconButton onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Reading Settings */}
        <Stack direction="row" spacing={2} sx={{ mt: 2 }} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Font Size</InputLabel>
            <Select
              value={fontSize}
              label="Font Size"
              onChange={(e) => setFontSize(Number(e.target.value))}
            >
              <MenuItem value={12}>Small</MenuItem>
              <MenuItem value={14}>Medium</MenuItem>
              <MenuItem value={16}>Large</MenuItem>
              <MenuItem value={18}>Extra Large</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Font Family</InputLabel>
            <Select
              value={fontFamily}
              label="Font Family"
              onChange={(e) => setFontFamily(e.target.value)}
            >
              <MenuItem value="sans-serif">Sans-serif</MenuItem>
              <MenuItem value="serif">Serif</MenuItem>
              <MenuItem value="monospace">Monospace</MenuItem>
            </Select>
          </FormControl>

          <Typography variant="body2" sx={{ minWidth: 100 }}>
            Line Height:
          </Typography>
          <Slider
            value={lineHeight}
            min={1.2}
            max={2.5}
            step={0.1}
            onChange={(_, value) => setLineHeight(value as number)}
            sx={{ width: 150 }}
          />
          <Typography variant="body2">{lineHeight.toFixed(1)}</Typography>

          <Typography variant="body2" sx={{ minWidth: 100 }}>
            Width:
          </Typography>
          <Slider
            value={columnWidth}
            min={600}
            max={1200}
            step={50}
            onChange={(_, value) => setColumnWidth(value as number)}
            sx={{ width: 150 }}
          />
          <Typography variant="body2">{columnWidth}px</Typography>
        </Stack>
      </Paper>

      {/* Main Content */}
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Table of Contents Drawer */}
        <Drawer
          anchor="left"
          open={showTOC}
          onClose={() => setShowTOC(false)}
          PaperProps={{
            sx: {
              width: 300,
              bgcolor: isDarkMode ? '#2d2d2d' : '#ffffff',
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Mục lục
            </Typography>
            <List>
              {tocItems.map((item) => (
                <ListItem key={item.id} disablePadding>
                  <ListItemButton
                    onClick={() => scrollToHeading(item.id)}
                    sx={{
                      pl: item.level * 2,
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        variant: item.level === 1 ? 'body1' : 'body2',
                        fontWeight: item.level <= 2 ? 600 : 400,
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>

        {/* Content Area */}
        <Box
          ref={contentRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 4,
            maxWidth: isFocusMode ? '100%' : `${columnWidth}px`,
            mx: 'auto',
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            fontFamily: fontFamily,
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              marginTop: '2em',
              marginBottom: '1em',
              fontWeight: 600,
            },
            '& p': {
              marginBottom: '1.5em',
            },
            '& img': {
              maxWidth: '100%',
              height: 'auto',
              borderRadius: 1,
            },
            '& pre': {
              backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
              padding: '1em',
              borderRadius: 1,
              overflow: 'auto',
            },
            '& code': {
              backgroundColor: isDarkMode ? '#1e1e1e' : '#f5f5f5',
              padding: '0.2em 0.4em',
              borderRadius: '3px',
              fontSize: '0.9em',
            },
            '& blockquote': {
              borderLeft: '4px solid',
              borderColor: 'primary.main',
              paddingLeft: '1em',
              marginLeft: 0,
              fontStyle: 'italic',
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '1.5em',
            },
            '& th, & td': {
              border: '1px solid',
              borderColor: 'divider',
              padding: '0.5em',
            },
            '& th': {
              backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
              fontWeight: 600,
            },
          }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </Box>

      {/* Scroll to Top Button */}
      {readingProgress > 20 && (
        <IconButton
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            bgcolor: 'primary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            zIndex: 1000,
          }}
        >
          <ArrowUpwardIcon />
        </IconButton>
      )}

      {/* Reading Stats */}
      <Paper
        elevation={2}
        sx={{
          p: 2,
          bgcolor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
        }}
      >
        <Stack direction="row" spacing={4} justifyContent="center">
          <Typography variant="body2">
            <strong>Thời gian đọc:</strong> {actualReadingTime} phút
          </Typography>
          <Typography variant="body2">
            <strong>Độ sâu cuộn:</strong> {scrollDepth}%
          </Typography>
          <Typography variant="body2">
            <strong>Số từ:</strong> {wordCount.toLocaleString()}
          </Typography>
          <Typography variant="body2">
            <strong>Tốc độ đọc:</strong> ~{readingSpeed} từ/phút
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default TextLessonViewer;
