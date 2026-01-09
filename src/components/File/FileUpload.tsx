import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  LinearProgress,
  Stack,
  Chip,
  IconButton,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  CloudUpload as CloudUploadIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  InsertDriveFile as FileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as DocumentIcon,
  Code as CodeIcon,
  MusicNote as AudioIcon,
  VideoFile as VideoIcon,
  FolderZip as ArchiveIcon,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '@/services/api';

export interface FileUploadResult {
  publicId: string;
  url: string;
  secureUrl: string;
  format: string;
  resourceType: string;
  size: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnailUrl?: string;
  originalName: string;
  mimeType: string;
  folder: string;
  uploadedAt: Date;
}

export interface FileUploadItem {
  id: string;
  file: File;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
  result?: FileUploadResult;
  error?: string;
}

interface FileUploadProps {
  onUploadComplete?: (files: FileUploadResult[]) => void;
  onFileChange?: (files: File[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // in bytes
  acceptedFileTypes?: string[];
  folder?: string;
  multiple?: boolean;
  disabled?: boolean;
  showPreview?: boolean;
  lessonId?: string; // If provided, will upload directly to lesson endpoint
}

// Default accepted file types (matching backend)
const DEFAULT_ACCEPTED_TYPES = [
  // Images
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  // Videos
  'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/flv', 'video/webm', 'video/quicktime',
  // Audio
  'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac',
  // Documents
  'application/pdf',
  'application/msword', // .doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'application/vnd.ms-excel', // .xls
  'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
  'application/vnd.ms-powerpoint', // .ppt
  'text/plain',
  'text/csv', // CSV files
  'text/rtf',
  'application/vnd.oasis.opendocument.text', // ODT
  'application/vnd.oasis.opendocument.spreadsheet', // ODS
  'application/vnd.oasis.opendocument.presentation', // ODP
  // Archives
  'application/zip',
  'application/x-rar-compressed',
  'application/x-7z-compressed',
  'application/x-tar',
  'application/gzip',
];

const FileUpload: React.FC<FileUploadProps> = ({
  onUploadComplete,
  onFileChange,
  maxFiles = 10,
  maxSizePerFile = 50 * 1024 * 1024, // 50MB default
  acceptedFileTypes,
  folder = 'lms/lesson-files',
  multiple = true,
  disabled = false,
  showPreview = true,
  lessonId,
}) => {
  const [files, setFiles] = useState<FileUploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use provided acceptedFileTypes or default to all supported types
  const allowedTypes = acceptedFileTypes || DEFAULT_ACCEPTED_TYPES;

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <ImageIcon />;
    if (mimeType === 'application/pdf') return <PdfIcon />;
    if (mimeType.includes('word') || mimeType.includes('document')) return <DocumentIcon />;
    if (mimeType.includes('text') || mimeType.includes('code')) return <CodeIcon />;
    if (mimeType.startsWith('audio/')) return <AudioIcon />;
    if (mimeType.startsWith('video/')) return <VideoIcon />;
    if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('archive')) return <ArchiveIcon />;
    return <FileIcon />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizePerFile) {
      return `File size exceeds limit (${formatFileSize(maxSizePerFile)})`;
    }

    // Check file type
    if (allowedTypes.length > 0) {
      if (!allowedTypes.includes(file.type)) {
        // Get file extension for better error message
        const extension = file.name.split('.').pop()?.toUpperCase() || 'unknown';
        return `File type không được hỗ trợ (.${extension}). Vui lòng xem danh sách file types được hỗ trợ bên dưới.`;
      }
    }

    return null;
  };

  const addFiles = useCallback((newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      // Show first error in toast, others in console
      toast.error(errors[0]);
      if (errors.length > 1) {
        console.warn('Additional file errors:', errors.slice(1));
      }
    }

    if (validFiles.length === 0) return;

    // Check max files limit
    const currentCount = files.length;
    const remainingSlots = maxFiles - currentCount;
    const filesToAdd = validFiles.slice(0, remainingSlots);

    if (validFiles.length > remainingSlots) {
      toast.warning(`Only ${remainingSlots} more file(s) can be added (max ${maxFiles} files)`);
    }

    const newFileItems: FileUploadItem[] = filesToAdd.map((file) => ({
      id: `${Date.now()}-${Math.random()}`,
      file,
      progress: 0,
      status: 'pending' as const,
    }));

    setFiles((prev) => [...prev, ...newFileItems]);

    if (onFileChange) {
      onFileChange([...files.map((f) => f.file), ...filesToAdd]);
    }
  }, [files, maxFiles, maxSizePerFile, allowedTypes, onFileChange]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) {
      addFiles(droppedFiles);
    }
  }, [disabled, addFiles]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      // Reset input to allow selecting same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [addFiles]);

  const uploadFile = async (fileItem: FileUploadItem): Promise<void> => {
    const formData = new FormData();
    formData.append('files', fileItem.file);
    formData.append('folder', folder);

    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileItem.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
      )
    );

    try {
      // If lessonId is provided, upload directly to lesson endpoint
      const endpoint = lessonId
        ? `/client/lessons/${lessonId}/files`
        : '/upload/mixed';

      // Don't set Content-Type header - let browser set it automatically with boundary
      // Axios interceptor will handle removing Content-Type for FormData
      const response = await api.post(endpoint, formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setFiles((prev) =>
              prev.map((f) => (f.id === fileItem.id ? { ...f, progress } : f))
            );
          }
        },
      });

      if (response.data.success && response.data.data) {
        // Handle different response formats
        let result: FileUploadResult | undefined;
        if (lessonId && response.data.data.files) {
          // Lesson endpoint returns { files: [...], lesson: {...} }
          const uploadedFiles = response.data.data.files;
          if (Array.isArray(uploadedFiles)) {
            result = uploadedFiles.find((r: FileUploadResult) =>
              r.originalName === fileItem.file.name
            ) || uploadedFiles[0];
          } else {
            result = uploadedFiles;
          }
        } else if (response.data.data.successful && Array.isArray(response.data.data.successful)) {
          // /upload/mixed endpoint returns { successful: [...], failed: [] }
          const successfulFiles = response.data.data.successful;
          // Try to find by originalName, otherwise take first file
          result = successfulFiles.find((r: FileUploadResult) =>
            r.originalName === fileItem.file.name
          ) || successfulFiles[0];
        } else if (Array.isArray(response.data.data)) {
          // Regular upload endpoint returns array
          result = response.data.data.find((r: FileUploadResult) =>
            r.originalName === fileItem.file.name
          ) || response.data.data[0];
        } else {
          result = response.data.data;
        }

        if (!result) {
          throw new Error('No upload result received');
        }

        setFiles((prev) => {
          const updated = prev.map((f) =>
            f.id === fileItem.id
              ? { ...f, status: 'success' as const, progress: 100, result }
              : f
          );

          // If single file upload and onUploadComplete is provided, call it immediately
          if (!multiple && result && onUploadComplete) {
            onUploadComplete([result]);
          }

          return updated;
        });
      }
    } catch (error: any) {
      // Parse error message from response
      let errorMessage = 'Upload failed';
      if (error.response?.data?.error) {
        const errorData = error.response.data.error;
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else {
          errorMessage = JSON.stringify(errorData);
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileItem.id
            ? { ...f, status: 'error' as const, error: errorMessage }
            : f
        )
      );
      toast.error(`Failed to upload ${fileItem.file.name}: ${errorMessage}`);
    }
  };

  // Auto-upload single file when added in single-file mode
  useEffect(() => {
    if (!multiple && !disabled && files.length === 1) {
      const pendingFile = files.find((f) => f.status === 'pending');
      if (pendingFile) {
        // Small delay to ensure state is updated
        const timer = setTimeout(() => {
          uploadFile(pendingFile);
        }, 100);
        return () => clearTimeout(timer);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, multiple, disabled]);

  const uploadAllFiles = useCallback(async () => {
    const pendingFiles = files.filter((f) => f.status === 'pending');
    if (pendingFiles.length === 0) {
      toast.info('No files to upload');
      return;
    }

    // Upload files sequentially to avoid overwhelming the server
    for (const fileItem of pendingFiles) {
      await uploadFile(fileItem);
    }

    // After all uploads complete, check results and call callback
    setTimeout(() => {
      setFiles((currentFiles) => {
        const successfulFiles = currentFiles
          .filter((f) => f.status === 'success' && f.result)
          .map((f) => f.result!);

        if (successfulFiles.length > 0 && onUploadComplete && multiple) {
          onUploadComplete(successfulFiles);
        }
        return currentFiles;
      });
    }, 100);
  }, [files, onUploadComplete, uploadFile, multiple]);

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => {
      const newFiles = prev.filter((f) => f.id !== id);
      if (onFileChange) {
        onFileChange(newFiles.map((f) => f.file));
      }
      return newFiles;
    });
  }, [onFileChange]);

  const retryUpload = useCallback((fileItem: FileUploadItem) => {
    uploadFile({ ...fileItem, status: 'pending', progress: 0, error: undefined });
  }, []);

  const hasPendingFiles = files.some((f) => f.status === 'pending');
  const hasUploadingFiles = files.some((f) => f.status === 'uploading');
  const allUploaded = files.length > 0 && files.every((f) => f.status === 'success' || f.status === 'error');

  return (
    <Box>
      {/* Drop Zone */}
      <Paper
        sx={{
          p: 4,
          border: `2px dashed ${isDragging ? 'primary.main' : 'grey.300'}`,
          borderRadius: 2,
          textAlign: 'center',
          bgcolor: isDragging ? 'action.hover' : 'background.paper',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': disabled ? {} : { borderColor: 'primary.main', bgcolor: 'action.hover' },
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={allowedTypes.join(',')}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={disabled}
        />
        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" gutterBottom>
          {isDragging ? 'Drop files here' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          or click to browse
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
          Max {maxFiles} files, {formatFileSize(maxSizePerFile)} per file
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Alert severity="info" sx={{ textAlign: 'left' }}>
            <Box component="div">
              <Typography variant="body2" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                File types được hỗ trợ:
              </Typography>
              <Typography variant="caption" component="div">
                <strong>Documents:</strong> PDF, Word (.doc, .docx), Excel (.xls, .xlsx), PowerPoint (.ppt, .pptx), CSV, Text, RTF, ODT
                <br />
                <strong>Images:</strong> JPG, PNG, GIF, WebP, SVG
                <br />
                <strong>Videos:</strong> MP4, AVI, MOV, WebM, QuickTime
                <br />
                <strong>Audio:</strong> MP3, WAV, OGG, AAC, FLAC
                <br />
                <strong>Archives:</strong> ZIP, RAR, 7Z, TAR, GZIP
                <br />
                <strong>Code:</strong> Text files, Code files
              </Typography>
            </Box>
          </Alert>
        </Box>
      </Paper>

      {/* File List */}
      {files.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h6">
              Files ({files.length}/{maxFiles})
            </Typography>
            {hasPendingFiles && !hasUploadingFiles && (
              <Button variant="contained" onClick={uploadAllFiles} disabled={disabled}>
                Upload All
              </Button>
            )}
          </Stack>

          <List>
            {files.map((fileItem) => (
              <ListItem
                key={fileItem.id}
                sx={{
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  mb: 1,
                  bgcolor: 'background.paper',
                }}
              >
                <Box sx={{ mr: 2, color: 'text.secondary' }}>
                  {getFileIcon(fileItem.file.type)}
                </Box>
                <ListItemText
                  primary={
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Typography variant="body1" component="span">
                        {fileItem.file.name}
                      </Typography>
                      {fileItem.status === 'success' && (
                        <CheckCircleIcon color="success" fontSize="small" />
                      )}
                      {fileItem.status === 'error' && (
                        <ErrorIcon color="error" fontSize="small" />
                      )}
                    </span>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" component="span" display="block" color="text.secondary">
                        {formatFileSize(fileItem.file.size)} • {fileItem.file.type}
                      </Typography>
                      {fileItem.status === 'uploading' && (
                        <Box component="div" sx={{ mt: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={fileItem.progress}
                          />
                        </Box>
                      )}
                      {fileItem.status === 'error' && fileItem.error && (
                        <Box component="div" sx={{ mt: 1 }}>
                          <Alert severity="error">
                            <Box component="div">
                              <Typography variant="body2" component="span">
                                {fileItem.error}
                              </Typography>
                            </Box>
                          </Alert>
                        </Box>
                      )}
                      {fileItem.status === 'success' && fileItem.result && (
                        <Box component="div" sx={{ mt: 1, display: 'inline-block' }}>
                          <Chip
                            label="Uploaded"
                            color="success"
                            size="small"
                          />
                        </Box>
                      )}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <Stack direction="row" spacing={1}>
                    {fileItem.status === 'error' && (
                      <Button size="small" onClick={() => retryUpload(fileItem)}>
                        Retry
                      </Button>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => removeFile(fileItem.id)}
                      disabled={fileItem.status === 'uploading'}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {allUploaded && files.some((f) => f.status === 'success') && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Box component="div">
                <Typography variant="body2" component="span">
                  All files uploaded successfully!
                </Typography>
              </Box>
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FileUpload;
