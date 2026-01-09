import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Stack,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  OpenInNew as OpenInNewIcon,
  Refresh as RefreshIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  ErrorOutline as ErrorIcon,
} from '@mui/icons-material';
import { fetchLinkMetadata, LinkMetadata, validateUrl } from '@/services/client/link-preview.service';

interface LinkPreviewProps {
  url: string;
  onUrlChange?: (url: string) => void;
  showActions?: boolean;
  onOpen?: () => void;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({
  url,
  onUrlChange,
  showActions = true,
  onOpen,
}) => {
  const [metadata, setMetadata] = useState<LinkMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (url && validateUrl(url)) {
      setIsValid(true);
      loadMetadata(url);
    } else if (url) {
      setIsValid(false);
      setError('URL không hợp lệ');
    }
  }, [url]);

  const loadMetadata = async (linkUrl: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchLinkMetadata(linkUrl);
      setMetadata(data);
      
      if (!data.isAccessible && !data.error) {
        setError('Không thể truy cập link này');
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin link');
      // Set basic metadata from URL
      const urlObj = new URL(linkUrl);
      setMetadata({
        url: linkUrl,
        domain: urlObj.hostname,
        isValid: true,
        isAccessible: false,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenLink = () => {
    if (url && validateUrl(url)) {
      window.open(url, '_blank', 'noopener,noreferrer');
      if (onOpen) {
        onOpen();
      }
    }
  };

  const handleRefresh = () => {
    if (url) {
      loadMetadata(url);
    }
  };

  if (!url) {
    return (
      <Alert severity="info" sx={{ mt: 2 }}>
        Nhập URL để xem preview
      </Alert>
    );
  }

  if (!isValid) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        URL không hợp lệ. Vui lòng nhập URL đầy đủ (ví dụ: https://example.com)
      </Alert>
    );
  }

  if (loading) {
    return (
      <Card sx={{ mt: 2 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <CircularProgress size={24} />
            <Typography>Đang tải thông tin link...</Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  if (error && !metadata) {
    return (
      <Alert 
        severity="warning" 
        sx={{ mt: 2 }}
        action={
          <IconButton size="small" onClick={handleRefresh}>
            <RefreshIcon fontSize="small" />
          </IconButton>
        }
      >
        {error}
      </Alert>
    );
  }

  if (!metadata) {
    return null;
  }

  return (
    <Card sx={{ mt: 2, maxWidth: 800 }}>
      {metadata.image && (
        <CardMedia
          component="img"
          height="200"
          image={metadata.image}
          alt={metadata.title || 'Link preview'}
          sx={{ objectFit: 'cover' }}
          onError={(e) => {
            // Hide image on error
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      )}
      <CardContent>
        <Stack spacing={2}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box sx={{ flex: 1 }}>
              {metadata.title && (
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  {metadata.title}
                </Typography>
              )}
              {metadata.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {metadata.description}
                </Typography>
              )}
            </Box>
            {showActions && (
              <IconButton size="small" onClick={handleRefresh} sx={{ ml: 1 }}>
                <RefreshIcon />
              </IconButton>
            )}
          </Stack>

          {/* Domain info */}
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
            {metadata.domain && (
              <Chip
                icon={<LinkIcon />}
                label={metadata.domain}
                size="small"
                variant="outlined"
              />
            )}
            {metadata.siteName && metadata.siteName !== metadata.domain && (
              <Chip
                label={metadata.siteName}
                size="small"
                variant="outlined"
              />
            )}
            {metadata.isAccessible === false && (
              <Chip
                icon={<ErrorIcon />}
                label="Không thể truy cập"
                size="small"
                color="warning"
              />
            )}
            {metadata.isAccessible === true && (
              <Chip
                label="Có thể truy cập"
                size="small"
                color="success"
              />
            )}
          </Stack>

          {/* Actions */}
          {showActions && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                startIcon={<OpenInNewIcon />}
                onClick={handleOpenLink}
                fullWidth
              >
                Mở liên kết
              </Button>
            </Stack>
          )}

          {/* Error message */}
          {error && metadata && (
            <Alert severity="warning" sx={{ mt: 1 }}>
              {error}
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LinkPreview;
