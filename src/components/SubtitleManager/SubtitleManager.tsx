import React, { useState, useEffect, useRef } from 'react';
import { videoService, VideoSubtitle } from '@/services/client/video.service';
import { toast } from 'react-hot-toast';
import './SubtitleManager.css';

interface SubtitleManagerProps {
  lessonId: string;
}

const SubtitleManager: React.FC<SubtitleManagerProps> = ({
  lessonId,
}) => {
  const [subtitles, setSubtitles] = useState<VideoSubtitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load subtitles
  const loadSubtitles = async () => {
    try {
      setLoading(true);
      const response = await videoService.getSubtitles(lessonId);
      if (response.success) {
        setSubtitles(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to load subtitles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubtitles();
  }, [lessonId]);

  // Handle file selection
  const handleFileSelect = (file: File) => {
    const allowedExtensions = ['.srt', '.vtt'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!allowedExtensions.includes(fileExtension)) {
      toast.error('Invalid file format. Allowed: .srt, .vtt');
      return;
    }

    setUploadFile(file);
  };

  // Handle upload
  const handleUpload = async () => {
    if (!uploadFile || !selectedLanguage) {
      toast.error('Please select a file and language');
      return;
    }

    try {
      setIsUploading(true);
      const response = await videoService.uploadSubtitle(lessonId, selectedLanguage, uploadFile);
      
      if (response.success) {
        toast.success('Subtitle uploaded successfully');
        setUploadFile(null);
        setSelectedLanguage('');
        setShowUpload(false);
        loadSubtitles();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to upload subtitle');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle delete
  const handleDelete = async (subtitleId: string) => {
    if (!window.confirm('Are you sure you want to delete this subtitle?')) {
      return;
    }

    try {
      const response = await videoService.deleteSubtitle(lessonId, subtitleId);
      if (response.success) {
        toast.success('Subtitle deleted successfully');
        loadSubtitles();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to delete subtitle');
    }
  };

  // Common languages
  const languages = [
    { code: 'vi', name: 'Vietnamese' },
    { code: 'en', name: 'English' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'es', name: 'Spanish' },
  ];

  return (
    <div className="subtitle-manager-container">
      <div className="subtitle-manager-header">
        <h3>Subtitles</h3>
        <button onClick={() => setShowUpload(!showUpload)} className="btn-add-subtitle">
          + Add Subtitle
        </button>
      </div>

      {/* Upload form */}
      {showUpload && (
        <div className="subtitle-manager-upload">
          <div className="subtitle-manager-upload-form">
            <label>
              Language:
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                <option value="">Select language</option>
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </label>

            <div className="subtitle-manager-file-input">
              <input
                ref={fileInputRef}
                type="file"
                accept=".srt,.vtt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                style={{ display: 'none' }}
              />
              <button onClick={() => fileInputRef.current?.click()} className="btn-browse">
                {uploadFile ? uploadFile.name : 'Browse .srt or .vtt file'}
              </button>
              {uploadFile && (
                <button
                  onClick={() => setUploadFile(null)}
                  className="btn-remove"
                >
                  ×
                </button>
              )}
            </div>

            <div className="subtitle-manager-upload-actions">
              <button
                onClick={handleUpload}
                disabled={!uploadFile || !selectedLanguage || isUploading}
                className="btn-upload"
              >
                {isUploading ? 'Uploading...' : 'Upload'}
              </button>
              <button
                onClick={() => {
                  setShowUpload(false);
                  setUploadFile(null);
                  setSelectedLanguage('');
                }}
                className="btn-cancel"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtitles list */}
      <div className="subtitle-manager-list">
        {loading ? (
          <div className="subtitle-manager-loading">Loading subtitles...</div>
        ) : subtitles.length === 0 ? (
          <div className="subtitle-manager-empty">No subtitles yet. Add your first subtitle!</div>
        ) : (
          subtitles.map((subtitle) => (
            <div key={subtitle._id} className="subtitle-manager-item">
              <div className="subtitle-manager-item-info">
                <span className="subtitle-manager-language">
                  {languages.find(l => l.code === subtitle.language)?.name || subtitle.language.toUpperCase()}
                </span>
                <span className="subtitle-manager-file-name">{subtitle.fileName}</span>
              </div>
              <button
                onClick={() => handleDelete(subtitle._id)}
                className="btn-delete"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SubtitleManager;
