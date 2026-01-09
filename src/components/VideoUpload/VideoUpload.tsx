import React, { useState, useRef } from 'react';
import { videoService } from '@/services/client/video.service';
import { toast } from 'react-hot-toast';
import './VideoUpload.css';

interface VideoUploadProps {
  lessonId: string;
  onUploadComplete?: (data?: { duration?: number }) => void;
  onCancel?: () => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({
  lessonId,
  onUploadComplete,
  onCancel,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileSelect = (selectedFile: File) => {
    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error('Invalid file type. Allowed: MP4, WebM, MOV, AVI');
      return;
    }

    // Validate file size (500MB)
    const MAX_SIZE = 524288000; // 500MB
    if (selectedFile.size > MAX_SIZE) {
      toast.error(`File size exceeds maximum allowed size of ${MAX_SIZE / 1024 / 1024}MB`);
      return;
    }

    setFile(selectedFile);
  };

  // Handle drag and drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  // Handle upload
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a video file');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);

      const response = await videoService.uploadVideo(
        lessonId,
        file,
        (progress) => {
          setUploadProgress(progress);
        }
      );

      if (response.success) {
        toast.success('Video uploaded successfully');
        
        // Extract duration from response (in seconds, convert to minutes)
        let durationInMinutes: number | undefined;
        if (response.data?.videoFile?.duration) {
          // Duration from VideoFile is in seconds, convert to minutes
          durationInMinutes = Math.ceil(response.data.videoFile.duration / 60);
          console.log('✅ Video duration from API:', response.data.videoFile.duration, 'seconds =', durationInMinutes, 'minutes');
        } else if (response.data?.uploadResult?.duration) {
          // Fallback: duration from uploadResult
          durationInMinutes = Math.ceil(response.data.uploadResult.duration / 60);
          console.log('✅ Video duration from uploadResult:', response.data.uploadResult.duration, 'seconds =', durationInMinutes, 'minutes');
        }
        
        if (onUploadComplete) {
          onUploadComplete(durationInMinutes ? { duration: durationInMinutes } : undefined);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload video');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="video-upload-container">
      <div className="video-upload-header">
        <h3>Upload Video</h3>
        {onCancel && (
          <button onClick={onCancel} className="btn-close">×</button>
        )}
      </div>

      <div
        className={`video-upload-dropzone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
        />

        {file ? (
          <div className="video-upload-file-info">
            <div className="video-upload-file-icon">📹</div>
            <div className="video-upload-file-details">
              <div className="video-upload-file-name">{file.name}</div>
              <div className="video-upload-file-size">{formatFileSize(file.size)}</div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFile(null);
              }}
              className="btn-remove-file"
            >
              ×
            </button>
          </div>
        ) : (
          <div className="video-upload-placeholder">
            <div className="video-upload-icon">📤</div>
            <p className="video-upload-text">Drag & drop video file here</p>
            <p className="video-upload-text-secondary">or click to browse</p>
            <p className="video-upload-hint">
              Supported formats: MP4, WebM, MOV, AVI (Max: 500MB)
            </p>
          </div>
        )}
      </div>

      {/* Upload progress */}
      {isUploading && (
        <div className="video-upload-progress">
          <div className="video-upload-progress-bar">
            <div
              className="video-upload-progress-fill"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <div className="video-upload-progress-text">
            Uploading... {uploadProgress}%
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="video-upload-actions">
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className="btn-upload"
        >
          {isUploading ? 'Uploading...' : 'Upload Video'}
        </button>
        {onCancel && (
          <button onClick={onCancel} className="btn-cancel" disabled={isUploading}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoUpload;
