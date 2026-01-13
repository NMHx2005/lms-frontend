import React, { useState, useEffect, useCallback } from 'react';
import { sharedCommentsService } from '@/services/shared/comments.service';
import { toast } from 'react-hot-toast';
import {
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  CheckCircle as CheckCircleIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Add as AddIcon,
  Send as SendIcon
} from '@mui/icons-material';
import './CourseQA.css';

interface Comment {
  _id: string;
  content: string;
  authorId?: {
    _id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
  author?: {
    _id: string;
    name?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
  };
  authorType: 'student' | 'teacher' | 'admin';
  contentType: 'course' | 'lesson' | 'discussion' | 'assignment';
  contentId: string;
  parentId?: string;
  rootId?: string;
  likes: string[];
  dislikes: string[];
  helpfulVotes: number;
  replies?: Comment[];
  createdAt: string;
  updatedAt: string;
  isEdited?: boolean;
}

interface CommentTree {
  comment: Comment;
  replies: CommentTree[];
  totalReplies: number;
  depth: number;
}

interface CourseQAProps {
  courseId: string;
  lessonId?: string;
}

const CourseQA: React.FC<CourseQAProps> = ({ courseId, lessonId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'mostLiked' | 'mostHelpful'>('newest');
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // Determine content type and ID
  const contentType = lessonId ? 'lesson' : 'course';
  const contentId = lessonId || courseId;

  // Transform comment tree to flat comment structure
  const transformCommentTree = (tree: CommentTree[]): Comment[] => {
    return tree.map(item => {
      const comment = item.comment;
      // Map author from comment.author or comment.authorId
      const author = comment.author || comment.authorId;

      return {
        ...comment,
        authorId: author,
        replies: item.replies && item.replies.length > 0
          ? transformCommentTree(item.replies)
          : []
      };
    });
  };

  // Load comments
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await sharedCommentsService.getCommentTree(contentType, contentId, {
        maxDepth: 3
      });

      if (response.success) {
        // Transform the tree structure to flat comments
        const commentTrees: CommentTree[] = response.data || [];
        const transformedComments = transformCommentTree(commentTrees);
        setComments(transformedComments);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể tải câu hỏi');
    } finally {
      setLoading(false);
    }
  }, [contentType, contentId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // Create question/comment
  const handleCreateQuestion = async () => {
    if (!newQuestionContent.trim()) {
      toast.error('Vui lòng nhập câu hỏi');
      return;
    }

    try {
      const response = await sharedCommentsService.createComment({
        content: newQuestionContent,
        contentType,
        contentId
      });

      if (response.success) {
        toast.success('Đăng câu hỏi thành công');
        setNewQuestionContent('');
        setShowAddQuestion(false);
        loadComments();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể đăng câu hỏi');
    }
  };

  // Reply to comment
  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) {
      toast.error('Vui lòng nhập câu trả lời');
      return;
    }

    try {
      const response = await sharedCommentsService.createComment({
        content: replyContent,
        contentType,
        contentId,
        parentId
      });

      if (response.success) {
        toast.success('Trả lời thành công');
        setReplyContent('');
        setReplyingTo(null);
        loadComments();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể trả lời');
    }
  };

  // Update comment
  const handleUpdateComment = async (commentId: string) => {
    if (!editContent.trim()) {
      toast.error('Vui lòng nhập nội dung');
      return;
    }

    try {
      const response = await sharedCommentsService.updateComment(commentId, {
        content: editContent
      });

      if (response.success) {
        toast.success('Cập nhật thành công');
        setEditingComment(null);
        setEditContent('');
        loadComments();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể cập nhật');
    }
  };

  // Delete comment (currently unused - reserved for future use)
  // @ts-ignore - Function is reserved for future use
  const _handleDeleteComment = async (_commentId: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa câu hỏi/câu trả lời này?')) {
      return;
    }

    try {
      const response = await sharedCommentsService.deleteComment(_commentId, {
        reason: 'User deleted',
        softDelete: true
      });

      if (response.success) {
        toast.success('Xóa thành công');
        loadComments();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể xóa');
    }
  };

  // Mark function as used (reserved for future use)
  void _handleDeleteComment;

  // Toggle like
  const handleToggleLike = async (commentId: string, isLiked: boolean) => {
    try {
      const response = await sharedCommentsService.toggleLikeComment(commentId, {
        action: isLiked ? 'unlike' : 'like'
      });

      if (response.success) {
        loadComments();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể thực hiện');
    }
  };

  // Mark as helpful
  const handleMarkHelpful = async (commentId: string) => {
    try {
      const response = await sharedCommentsService.markCommentHelpful(commentId, {
        helpful: true
      });

      if (response.success) {
        toast.success('Đánh dấu hữu ích thành công');
        loadComments();
      }
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Không thể đánh dấu');
    }
  };

  // Toggle comment expansion
  const toggleCommentExpansion = (commentId: string) => {
    setExpandedComments(prev => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  // Format date
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Không xác định';

    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) {
      return 'Không xác định';
    }

    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} phút trước`;
      }
      return `${hours} giờ trước`;
    } else if (days < 7) {
      return `${days} ngày trước`;
    } else {
      return date.toLocaleDateString('vi-VN');
    }
  };

  // Get author name
  const getAuthorName = (comment: Comment) => {
    const author = comment.author || comment.authorId;
    if (author?.firstName && author?.lastName) {
      return `${author.firstName} ${author.lastName}`;
    }
    return author?.name || author?.email || 'Người dùng';
  };

  // Sort comments
  const sortedComments = [...comments].sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'mostLiked':
        return (b.likes?.length || 0) - (a.likes?.length || 0);
      case 'mostHelpful':
        return (b.helpfulVotes || 0) - (a.helpfulVotes || 0);
      case 'newest':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  // Render comment with replies
  const renderComment = (comment: Comment, level: number = 0) => {
    const isExpanded = expandedComments.has(comment._id);
    const isEditing = editingComment === comment._id;
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isLiked = comment.likes && comment.likes.length > 0; // Simplified - should check current user

    return (
      <div key={comment._id} className={`course-qa-comment course-qa-comment--level-${level}`}>
        <div className="course-qa-comment-header">
          <div className="course-qa-comment-author">
            {(() => {
              const author = comment.author || comment.authorId;
              return author?.avatar ? (
                <img
                  src={author.avatar}
                  alt={getAuthorName(comment)}
                  className="course-qa-comment-avatar"
                />
              ) : (
                <div className="course-qa-comment-avatar-placeholder">
                  {getAuthorName(comment).charAt(0).toUpperCase()}
                </div>
              );
            })()}
            <div className="course-qa-comment-author-info">
              <div className="course-qa-comment-author-name">
                {getAuthorName(comment)}
                {comment.authorType === 'teacher' && (
                  <span className="course-qa-badge course-qa-badge--teacher">Giảng viên</span>
                )}
                {comment.authorType === 'admin' && (
                  <span className="course-qa-badge course-qa-badge--admin">Quản trị viên</span>
                )}
              </div>
              <div className="course-qa-comment-meta">
                {formatDate(comment.createdAt)}
                {comment.isEdited && <span className="course-qa-edited">(đã chỉnh sửa)</span>}
              </div>
            </div>
          </div>
        </div>

        <div className="course-qa-comment-content">
          {isEditing ? (
            <div className="course-qa-edit-form">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={4}
                placeholder="Nhập nội dung..."
              />
              <div className="course-qa-edit-actions">
                <button
                  onClick={() => handleUpdateComment(comment._id)}
                  className="course-qa-btn course-qa-btn--primary"
                >
                  Lưu
                </button>
                <button
                  onClick={() => {
                    setEditingComment(null);
                    setEditContent('');
                  }}
                  className="course-qa-btn course-qa-btn--secondary"
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <p>{comment.content}</p>
          )}
        </div>

        {!isEditing && (
          <div className="course-qa-comment-actions">
            <button
              onClick={() => handleToggleLike(comment._id, isLiked)}
              className={`course-qa-action-btn ${isLiked ? 'course-qa-action-btn--active' : ''}`}
            >
              <ThumbUpIcon fontSize="small" /> {comment.likes?.length || 0}
            </button>
            <button
              onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
              className="course-qa-action-btn"
            >
              <CommentIcon fontSize="small" /> Trả lời
            </button>
            {comment.authorType === 'student' && (
              <button
                onClick={() => handleMarkHelpful(comment._id)}
                className="course-qa-action-btn"
              >
                <CheckCircleIcon fontSize="small" /> Hữu ích ({comment.helpfulVotes || 0})
              </button>
            )}
            {level === 0 && (
              <>
                <button
                  onClick={() => toggleCommentExpansion(comment._id)}
                  className="course-qa-action-btn"
                >
                  {isExpanded ? (
                    <>
                      <ExpandLessIcon fontSize="small" /> Thu gọn
                    </>
                  ) : (
                    <>
                      <ExpandMoreIcon fontSize="small" /> Xem {hasReplies ? comment.replies?.length : 0} trả lời
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        )}

        {/* Reply form */}
        {replyingTo === comment._id && (
          <div className="course-qa-reply-form">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              rows={3}
              placeholder="Nhập câu trả lời..."
            />
            <div className="course-qa-reply-actions">
              <button
                onClick={() => handleReply(comment._id)}
                className="course-qa-btn course-qa-btn--primary"
              >
                <SendIcon fontSize="small" /> Gửi trả lời
              </button>
              <button
                onClick={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
                className="course-qa-btn course-qa-btn--secondary"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {/* Replies */}
        {hasReplies && isExpanded && (
          <div className="course-qa-replies">
            {comment.replies?.map(reply => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="course-qa-container">
      <div className="course-qa-header">
        <h3>Hỏi & Đáp</h3>
        <div className="course-qa-header-actions">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="course-qa-sort-select"
          >
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
            <option value="mostLiked">Nhiều lượt thích nhất</option>
            <option value="mostHelpful">Hữu ích nhất</option>
          </select>
          <button
            onClick={() => setShowAddQuestion(!showAddQuestion)}
            className="course-qa-btn course-qa-btn--primary"
          >
            <AddIcon fontSize="small" /> Đặt câu hỏi
          </button>
        </div>
      </div>

      {/* Add question form */}
      {showAddQuestion && (
        <div className="course-qa-add-form">
          <textarea
            value={newQuestionContent}
            onChange={(e) => setNewQuestionContent(e.target.value)}
            rows={4}
            placeholder="Đặt câu hỏi của bạn về khóa học hoặc bài học này..."
          />
          <div className="course-qa-add-actions">
            <button
              onClick={handleCreateQuestion}
              className="course-qa-btn course-qa-btn--primary"
            >
              Đăng câu hỏi
            </button>
            <button
              onClick={() => {
                setShowAddQuestion(false);
                setNewQuestionContent('');
              }}
              className="course-qa-btn course-qa-btn--secondary"
            >
              Hủy
            </button>
          </div>
        </div>
      )}

      {/* Comments list */}
      <div className="course-qa-comments">
        {loading ? (
          <div className="course-qa-loading">Đang tải câu hỏi...</div>
        ) : sortedComments.length === 0 ? (
          <div className="course-qa-empty">
            Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!
          </div>
        ) : (
          sortedComments.map(comment => renderComment(comment))
        )}
      </div>
    </div>
  );
};

export default CourseQA;
