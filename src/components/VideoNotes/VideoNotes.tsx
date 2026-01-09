import React, { useState, useEffect, useCallback } from 'react';
import { videoService, VideoNote } from '@/services/client/video.service';
import { toast } from 'react-hot-toast';
import './VideoNotes.css';

interface VideoNotesProps {
  lessonId: string;
  currentTime: number;
  onNoteClick?: (timestamp: number) => void;
}

const VideoNotes: React.FC<VideoNotesProps> = ({
  lessonId,
  currentTime,
  onNoteClick,
}) => {
  const [notes, setNotes] = useState<VideoNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [newNoteTags, setNewNoteTags] = useState('');
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số ghi chú mỗi trang

  // Load notes - chỉ load notes của chính user
  const loadNotes = useCallback(async () => {
    try {
      setLoading(true);
      const response = await videoService.getNotes(lessonId);

      if (response.success) {
        setNotes(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tải ghi chú');
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  // Create note
  const handleCreateNote = async () => {
    if (!newNoteContent.trim()) {
      toast.error('Vui lòng nhập nội dung ghi chú');
      return;
    }

    try {
      const tags = newNoteTags.split(',').map(t => t.trim()).filter(t => t);
      const response = await videoService.createNote(lessonId, {
        timestamp: currentTime,
        content: newNoteContent,
        tags,
        isPublic: false, // Luôn là private, chỉ user mới xem được
      });

      if (response.success) {
        toast.success('Tạo ghi chú thành công');
        setNewNoteContent('');
        setNewNoteTags('');
        setShowAddNote(false);
        loadNotes();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tạo ghi chú');
    }
  };

  // Update note
  const handleUpdateNote = async (noteId: string, content: string, tags: string[]) => {
    try {
      const response = await videoService.updateNote(lessonId, noteId, {
        content,
        tags,
        isPublic: false, // Luôn là private, chỉ user mới xem được
      });

      if (response.success) {
        toast.success('Cập nhật ghi chú thành công');
        setEditingNote(null);
        loadNotes();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể cập nhật ghi chú');
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa ghi chú này?')) {
      return;
    }

    try {
      const response = await videoService.deleteNote(lessonId, noteId);
      if (response.success) {
        toast.success('Xóa ghi chú thành công');
        loadNotes();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể xóa ghi chú');
    }
  };

  // Export notes
  const handleExportNotes = async () => {
    try {
      const blob = await videoService.exportNotes(lessonId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ghi-chu-bai-hoc-${lessonId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.success('Xuất ghi chú thành công');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể xuất ghi chú');
    }
  };

  // Search notes
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadNotes();
      return;
    }

    try {
      const response = await videoService.searchNotes(lessonId, searchQuery);
      if (response.success) {
        setNotes(response.data || []);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tìm kiếm ghi chú');
    }
  };

  // Format time
  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Sort by createdAt (newest first) - note mới nhất hiển thị trước
  const sortedNotes = [...notes].sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return dateB - dateA; // Descending order (newest first)
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedNotes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedNotes = sortedNotes.slice(startIndex, endIndex);

  // Reset to page 1 when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, lessonId]);

  return (
    <div className="video-notes-container">
      <div className="video-notes-header">
        <h3>Ghi Chú Video</h3>
        <div className="video-notes-actions">
          <button onClick={() => setShowAddNote(!showAddNote)} className="btn-add-note">
            + Thêm Ghi Chú
          </button>
          <button onClick={handleExportNotes} className="btn-export">
            Xuất File
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="video-notes-search">
        <input
          type="text"
          placeholder="Tìm kiếm ghi chú..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>Tìm Kiếm</button>
      </div>

      {/* Add note form */}
      {showAddNote && (
        <div className="video-notes-add-form">
          <textarea
            placeholder="Thêm ghi chú tại thời điểm hiện tại..."
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            rows={3}
          />
          <input
            type="text"
            placeholder="Nhãn (phân cách bằng dấu phẩy)"
            value={newNoteTags}
            onChange={(e) => setNewNoteTags(e.target.value)}
          />
          <div className="video-notes-form-actions">
            <button onClick={handleCreateNote} className="btn-save">Lưu Ghi Chú</button>
            <button onClick={() => setShowAddNote(false)} className="btn-cancel">Hủy</button>
          </div>
        </div>
      )}

      {/* Notes list */}
      <div className="video-notes-list">
        {loading ? (
          <div className="video-notes-loading">Đang tải ghi chú...</div>
        ) : sortedNotes.length === 0 ? (
          <div className="video-notes-empty">Chưa có ghi chú nào. Thêm ghi chú đầu tiên của bạn!</div>
        ) : (
          <>
            {paginatedNotes.map((note) => (
              <div key={note._id} className="video-note-item">
                {editingNote === note._id ? (
                  <NoteEditForm
                    note={note}
                    onSave={(content, tags) =>
                      handleUpdateNote(note._id, content, tags)
                    }
                    onCancel={() => setEditingNote(null)}
                  />
                ) : (
                  <>
                    <div className="video-note-header">
                      <span className="video-note-time" onClick={() => onNoteClick?.(note.timestamp)}>
                        {formatTime(note.timestamp)}
                      </span>
                      <div className="video-note-actions">
                        <button onClick={() => setEditingNote(note._id)}>Sửa</button>
                        <button onClick={() => handleDeleteNote(note._id)}>Xóa</button>
                      </div>
                    </div>
                    <div className="video-note-content">{note.content}</div>
                    {note.tags && note.tags.length > 0 && (
                      <div className="video-note-tags">
                        {note.tags.map((tag, idx) => (
                          <span key={idx} className="video-note-tag">{tag}</span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="video-notes-pagination">
                <button
                  className="video-notes-pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  ← Trước
                </button>
                <span className="video-notes-pagination-info">
                  Trang {currentPage} / {totalPages} ({sortedNotes.length} ghi chú)
                </span>
                <button
                  className="video-notes-pagination-btn"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Sau →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Note edit form component
const NoteEditForm: React.FC<{
  note: VideoNote;
  onSave: (content: string, tags: string[]) => void;
  onCancel: () => void;
}> = ({ note, onSave, onCancel }) => {
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState(note.tags?.join(', ') || '');

  const handleSave = () => {
    const tagsArray = tags.split(',').map(t => t.trim()).filter(t => t);
    onSave(content, tagsArray);
  };

  return (
    <div className="video-note-edit-form">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
      />
      <input
        type="text"
        placeholder="Nhãn (phân cách bằng dấu phẩy)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <div className="video-note-form-actions">
        <button onClick={handleSave} className="btn-save">Lưu</button>
        <button onClick={onCancel} className="btn-cancel">Hủy</button>
      </div>
    </div>
  );
};

export default VideoNotes;
