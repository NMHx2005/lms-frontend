import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Chip,
  Alert,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  Bookmark as BookmarkIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Share as ShareIcon,
  Report as ReportIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import LinkPreview from './LinkPreview';
import { trackLinkClick } from '@/services/client/link-preview.service';
import { toast } from 'react-hot-toast';

interface LinkLessonViewerProps {
  title: string;
  url: string;
  description?: string;
  lessonId: string;
  onComplete?: () => void;
}

const LinkLessonViewer: React.FC<LinkLessonViewerProps> = ({
  title,
  url,
  description,
  lessonId,
  onComplete,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isMarkedAsRead, setIsMarkedAsRead] = useState(false);

  useEffect(() => {
    // Load bookmark state from localStorage
    const bookmarked = localStorage.getItem(`link-bookmark-${lessonId}`);
    setIsBookmarked(bookmarked === 'true');
    
    const read = localStorage.getItem(`link-read-${lessonId}`);
    setIsMarkedAsRead(read === 'true');
  }, [lessonId]);

  const handleOpenLink = async () => {
    if (!url) {
      toast.error('URL không hợp lệ');
      return;
    }

    // Track click
    try {
      await trackLinkClick(lessonId, url);
    } catch (error) {
      console.error('Error tracking link click:', error);
    }

    // Open link in new tab
    window.open(url, '_blank', 'noopener,noreferrer');
    
    // Mark as read
    if (!isMarkedAsRead) {
      setIsMarkedAsRead(true);
      localStorage.setItem(`link-read-${lessonId}`, 'true');
      
      // Auto-complete lesson if onComplete is provided
      if (onComplete) {
        setTimeout(() => {
          onComplete();
        }, 1000);
      }
    }
  };

  const handleBookmark = () => {
    const newBookmarkState = !isBookmarked;
    setIsBookmarked(newBookmarkState);
    localStorage.setItem(`link-bookmark-${lessonId}`, String(newBookmarkState));
    toast.success(newBookmarkState ? 'Đã thêm vào bookmark' : 'Đã xóa khỏi bookmark');
  };

  const handleShare = async () => {
    const shareData = {
      title: title,
      text: description || `Xem link: ${title}`,
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Đã chia sẻ link');
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success('Đã sao chép link vào clipboard');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        toast.error('Không thể sao chép link');
      }
    }
  };

  const handleReportBroken = () => {
    // TODO: Implement report broken link
    toast('Tính năng báo cáo link bị hỏng sẽ được thêm sau');
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 900, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
          
          {description && (
            <Typography variant="body1" color="text.secondary">
              {description}
            </Typography>
          )}

          <Divider />

          {/* Actions */}
          <Stack direction="row" spacing={2} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              startIcon={<OpenInNewIcon />}
              onClick={handleOpenLink}
              sx={{ flex: 1, minWidth: 200 }}
            >
              Mở liên kết
            </Button>
            
            <Tooltip title={isBookmarked ? 'Xóa bookmark' : 'Thêm bookmark'}>
              <IconButton
                onClick={handleBookmark}
                color={isBookmarked ? 'primary' : 'default'}
              >
                {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Chia sẻ">
              <IconButton onClick={handleShare}>
                <ShareIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title="Báo cáo link bị hỏng">
              <IconButton onClick={handleReportBroken}>
                <ReportIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Status chips */}
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {isMarkedAsRead && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Đã đọc"
                color="success"
                size="small"
              />
            )}
            {isBookmarked && (
              <Chip
                icon={<BookmarkIcon />}
                label="Đã bookmark"
                color="primary"
                size="small"
              />
            )}
          </Stack>
        </Stack>
      </Paper>

      {/* Security Warning */}
      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>Lưu ý:</strong> Link này sẽ mở trong tab mới. Vui lòng cẩn thận với các link từ nguồn không đáng tin cậy.
        </Typography>
      </Alert>

      {/* Link Preview */}
      <LinkPreview
        url={url}
        showActions={false}
        onOpen={handleOpenLink}
      />
    </Box>
  );
};

export default LinkLessonViewer;
