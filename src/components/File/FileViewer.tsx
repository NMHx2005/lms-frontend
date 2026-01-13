import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Stack,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  LinearProgress,
  Alert,
  Chip,
} from '@mui/material';
import {
  Download as DownloadIcon,
  Fullscreen as FullscreenIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon,
  Close as CloseIcon,
  PictureAsPdf as PdfIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  Description as DocumentIcon,
  MusicNote as AudioIcon,
  VideoFile as VideoIcon,
  FolderZip as ArchiveIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';

export interface FileViewerProps {
  fileUrl: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
  onDownload?: () => void;
  showDownload?: boolean;
  showFullscreen?: boolean;
}

const FileViewer: React.FC<FileViewerProps> = ({
  fileUrl,
  fileName,
  fileType,
  fileSize,
  onDownload,
  showDownload = true,
  showFullscreen = true,
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [pdfPage, setPdfPage] = useState(1);
  const [pdfTotalPages, _setPdfTotalPages] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [images, _setImages] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Detect if multiple images
    if (fileType?.startsWith('image/') && images.length > 0) {
      setImageIndex(0);
    }
  }, [fileUrl, fileType]);

  const getFileIcon = () => {
    if (!fileType) return <FileIcon />;
    if (fileType.startsWith('image/')) return <ImageIcon />;
    if (fileType === 'application/pdf') return <PdfIcon />;
    if (fileType.includes('word') || fileType.includes('document')) return <DocumentIcon />;
    if (fileType.includes('text') || fileType.includes('code')) return <CodeIcon />;
    if (fileType.startsWith('audio/')) return <AudioIcon />;
    if (fileType.startsWith('video/')) return <VideoIcon />;
    if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) return <ArchiveIcon />;
    return <FileIcon />;
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
    } else {
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'download';
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 25, 25));
  };

  const handlePrevPage = () => {
    if (fileType === 'application/pdf') {
      setPdfPage((prev) => Math.max(1, prev - 1));
    } else if (fileType?.startsWith('image/') && images.length > 0) {
      setImageIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNextPage = () => {
    if (fileType === 'application/pdf') {
      setPdfPage((prev) => Math.min(pdfTotalPages, prev + 1));
    } else if (fileType?.startsWith('image/') && images.length > 0) {
      setImageIndex((prev) => Math.min(images.length - 1, prev + 1));
    }
  };

  const renderPDFViewer = () => {
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          PDF viewer requires PDF.js. For now, opening in new tab.
        </Alert>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <iframe
            src={`${fileUrl}#page=${pdfPage}`}
            style={{
              width: `${zoom}%`,
              height: '600px',
              border: 'none',
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError('Failed to load PDF');
              setLoading(false);
            }}
          />
        </Box>
        {pdfTotalPages > 0 && (
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 2, justifyContent: 'center' }}>
            <IconButton onClick={handlePrevPage} disabled={pdfPage <= 1}>
              <PrevIcon />
            </IconButton>
            <Typography>
              Page {pdfPage} of {pdfTotalPages}
            </Typography>
            <IconButton onClick={handleNextPage} disabled={pdfPage >= pdfTotalPages}>
              <NextIcon />
            </IconButton>
          </Stack>
        )}
      </Box>
    );
  };

  const renderImageViewer = () => {
    const currentImage = images.length > 0 ? images[imageIndex] : fileUrl;
    
    return (
      <Box sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'auto',
            bgcolor: 'grey.100',
            position: 'relative',
          }}
        >
          <img
            src={currentImage}
            alt={fileName || 'Image'}
            style={{
              maxWidth: `${zoom}%`,
              maxHeight: '100%',
              objectFit: 'contain',
            }}
            onLoad={() => setLoading(false)}
            onError={() => {
              setError('Failed to load image');
              setLoading(false);
            }}
          />
          {images.length > 1 && (
            <>
              <IconButton
                sx={{ position: 'absolute', left: 8 }}
                onClick={handlePrevPage}
                disabled={imageIndex <= 0}
              >
                <PrevIcon />
              </IconButton>
              <IconButton
                sx={{ position: 'absolute', right: 8 }}
                onClick={handleNextPage}
                disabled={imageIndex >= images.length - 1}
              >
                <NextIcon />
              </IconButton>
            </>
          )}
        </Box>
        {images.length > 1 && (
          <Stack direction="row" spacing={1} sx={{ mt: 2, justifyContent: 'center' }}>
            <Typography>
              Image {imageIndex + 1} of {images.length}
            </Typography>
          </Stack>
        )}
      </Box>
    );
  };

  const renderCodeViewer = () => {
    return (
      <Box sx={{ width: '100%', height: '100%' }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Code viewer with syntax highlighting coming soon. For now, opening in new tab.
        </Alert>
        <iframe
          src={fileUrl}
          style={{
            width: '100%',
            height: '600px',
            border: 'none',
          }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError('Failed to load file');
            setLoading(false);
          }}
        />
      </Box>
    );
  };

  const renderAudioPlayer = () => {
    return (
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <audio
          controls
          style={{ width: '100%', maxWidth: '600px' }}
          onLoadedData={() => setLoading(false)}
          onError={() => {
            setError('Failed to load audio');
            setLoading(false);
          }}
        >
          <source src={fileUrl} type={fileType} />
          Your browser does not support the audio element.
        </audio>
      </Box>
    );
  };

  const renderVideoPlayer = () => {
    return (
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <video
          controls
          style={{ width: '100%', maxWidth: '800px' }}
          onLoadedData={() => setLoading(false)}
          onError={() => {
            setError('Failed to load video');
            setLoading(false);
          }}
        >
          <source src={fileUrl} type={fileType} />
          Your browser does not support the video element.
        </video>
      </Box>
    );
  };

  const renderDocumentViewer = () => {
    // For Office documents, use Google Docs Viewer or Office Online
    const googleDocsViewer = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
    // const officeViewer = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
    
    return (
      <Box sx={{ width: '100%', height: '100%' }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Document preview using online viewer.
        </Alert>
        <iframe
          src={googleDocsViewer}
          style={{
            width: '100%',
            height: '600px',
            border: 'none',
          }}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError('Failed to load document');
            setLoading(false);
          }}
        />
      </Box>
    );
  };

  const renderDefaultViewer = () => {
    return (
      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', p: 4 }}>
        <Box sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }}>
          {getFileIcon()}
        </Box>
        <Typography variant="h6" gutterBottom>
          {fileName || 'File Preview'}
        </Typography>
        {fileSize && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {formatFileSize(fileSize)}
          </Typography>
        )}
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleDownload}
        >
          Download File
        </Button>
      </Box>
    );
  };

  const renderContent = () => {
    if (error) {
      return (
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
        </Alert>
      );
    }

    if (loading) {
      return <LinearProgress />;
    }

    if (!fileType) {
      return renderDefaultViewer();
    }

    if (fileType === 'application/pdf') {
      return renderPDFViewer();
    }

    if (fileType.startsWith('image/')) {
      return renderImageViewer();
    }

    if (fileType.startsWith('audio/')) {
      return renderAudioPlayer();
    }

    if (fileType.startsWith('video/')) {
      return renderVideoPlayer();
    }

    if (fileType.includes('text') || fileType.includes('code')) {
      return renderCodeViewer();
    }

    if (
      fileType.includes('word') ||
      fileType.includes('document') ||
      fileType.includes('spreadsheet') ||
      fileType.includes('presentation')
    ) {
      return renderDocumentViewer();
    }

    return renderDefaultViewer();
  };

  const content = (
    <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          {getFileIcon()}
          <Box>
            <Typography variant="h6">{fileName || 'File Preview'}</Typography>
            {fileSize && (
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(fileSize)}
              </Typography>
            )}
          </Box>
        </Stack>
        <Stack direction="row" spacing={1}>
          {(fileType === 'application/pdf' || fileType?.startsWith('image/')) && (
            <>
              <IconButton onClick={handleZoomOut} disabled={zoom <= 25}>
                <ZoomOutIcon />
              </IconButton>
              <Chip label={`${zoom}%`} size="small" />
              <IconButton onClick={handleZoomIn} disabled={zoom >= 400}>
                <ZoomInIcon />
              </IconButton>
            </>
          )}
          {showFullscreen && (
            <IconButton onClick={() => setFullscreen(true)}>
              <FullscreenIcon />
            </IconButton>
          )}
          {showDownload && (
            <IconButton onClick={handleDownload}>
              <DownloadIcon />
            </IconButton>
          )}
        </Stack>
      </Stack>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>{renderContent()}</Box>
    </Paper>
  );

  if (fullscreen) {
    return (
      <Dialog
        open={fullscreen}
        onClose={() => setFullscreen(false)}
        maxWidth={false}
        fullWidth
        fullScreen
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">{fileName || 'File Preview'}</Typography>
            <IconButton onClick={() => setFullscreen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 0, height: 'calc(100vh - 120px)' }}>
          {renderContent()}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDownload} startIcon={<DownloadIcon />}>
            Download
          </Button>
          <Button onClick={() => setFullscreen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return content;
};

export default FileViewer;
