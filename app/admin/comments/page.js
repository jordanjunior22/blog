'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useUser } from '@/context/userContext';
import { 
  Loader2, 
  MessageSquare, 
  Trash2, 
  Reply, 
  User, 
  Calendar,
  FileText,
  Send,
  X,
  AlertCircle,
  CheckCircle,
  Filter,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export default function AdminComments() {
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [notification, setNotification] = useState(null);
    const { user } = useUser();

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification(null), 5000);
    };

    useEffect(() => {
        fetchComments();
        fetch('/api/posts')
            .then(res => res.json())
            .then(setPosts);
    }, []);

    const fetchComments = async () => {
        setInitialLoading(true);
        try {
            const res = await fetch('/api/comments');
            const data = await res.json();
            const nested = nestComments(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setComments(nested);
            setFilteredComments(nested);
            showNotification('success', 'Comments loaded successfully!');
        } catch (error) {
            showNotification('error', 'Failed to load comments');
        } finally {
            setInitialLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedPost) {
            setFilteredComments(comments);
        } else {
            setFilteredComments(filterCommentsByPost(comments, selectedPost));
        }
    }, [selectedPost, comments]);

    const deleteComment = async (id) => {
        if (!confirm('Are you sure you want to delete this comment? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/comments/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) {
                throw new Error('Delete failed');
            }

            setComments(prev => removeCommentById(prev, id));
            showNotification('success', 'Comment deleted successfully!');
        } catch (error) {
            showNotification('error', 'Failed to delete comment');
        }
    };

    const submitReply = async (parentId) => {
        if (!replyContent.trim()) {
            showNotification('error', 'Reply content cannot be empty');
            return;
        }
        if (!user) {
            showNotification('error', 'User not logged in');
            return;
        }
        const postId = findPostId(comments, parentId);
        if (!postId) {
            showNotification('error', 'Post ID not found for reply');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/api/comments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: replyContent,
                    parentComment: parentId,
                    post: postId,
                    author: user._id,
                }),
            });

            if (!res.ok) {
                throw new Error('Reply failed');
            }

            await fetchComments();
            setReplyingTo(null);
            setReplyContent('');
            showNotification('success', 'Reply posted successfully!');
        } catch (error) {
            showNotification('error', 'Failed to post reply');
        } finally {
            setLoading(false);
        }
    };

    const totalComments = countComments(comments);

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 p-2 sm:p-4 md:p-6">
            {notification && (
                <div className={`fixed top-2 right-2 sm:top-4 sm:right-4 md:top-6 md:right-6 z-50 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl shadow-2xl animate-slide-in max-w-[calc(100vw-1rem)] sm:max-w-md ${
                    notification.type === 'success' ? 'bg-green-500' : 
                    notification.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                } text-white`}>
                    {notification.type === 'success' && <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                    {notification.type === 'error' && <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                    <span className="font-medium text-xs sm:text-sm flex-1 min-w-0 truncate">{notification.message}</span>
                    <button 
                        onClick={() => setNotification(null)}
                        className="ml-1 hover:bg-white/20 rounded-lg p-1 transition-colors flex-shrink-0"
                    >
                        <X className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                .animate-slide-in {
                    animation: slide-in 0.3s ease-out;
                }
            `}</style>

            <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 sm:gap-4 mb-2">
                        <div className="p-2 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 shadow-lg">
                            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-playfair)' }}>
                                Manage Comments
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-600 mt-1">Moderate and respond to user comments</p>
                        </div>
                    </div>
                </div>

                {/* Stats Card */}
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-purple-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs sm:text-sm text-purple-600 font-medium">Total Comments</p>
                            <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-900">{totalComments}</p>
                        </div>
                        <div className="bg-purple-200 p-2 sm:p-3 md:p-4 rounded-lg sm:rounded-xl">
                            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <div className="flex-1 relative">
                            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                            <select
                                className="w-full pl-9 sm:pl-10 pr-3 py-2 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-sm sm:text-base appearance-none cursor-pointer bg-white"
                                value={selectedPost}
                                onChange={(e) => setSelectedPost(e.target.value)}
                            >
                                <option value="">All Posts</option>
                                {posts.map(p => (
                                    <option key={p._id} value={p._id}>
                                        {p.title}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={fetchComments}
                            className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg sm:rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium text-sm sm:text-base"
                        >
                            <RefreshCw className="w-4 h-4 sm:w-5 sm:h-5" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Comments List */}
                {initialLoading ? (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin text-purple-600" />
                        <p className="text-sm sm:text-base text-gray-600 font-medium">Loading comments...</p>
                    </div>
                ) : filteredComments.length === 0 ? (
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-8 sm:p-12 text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full mb-3 sm:mb-4">
                            <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No comments found</h3>
                        <p className="text-sm sm:text-base text-gray-600">
                            {selectedPost ? 'No comments on this post yet' : 'Comments will appear here once users start engaging'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3 sm:space-y-4">
                        {filteredComments.map(comment => (
                            <CommentCard
                                key={comment._id}
                                comment={comment}
                                deleteComment={deleteComment}
                                replyingTo={replyingTo}
                                setReplyingTo={setReplyingTo}
                                replyContent={replyContent}
                                setReplyContent={setReplyContent}
                                submitReply={submitReply}
                                loading={loading}
                                depth={0}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function CommentCard({
    comment,
    deleteComment,
    replyingTo,
    setReplyingTo,
    replyContent,
    setReplyContent,
    submitReply,
    loading,
    depth = 0,
}) {
    const isReplying = replyingTo === comment._id;
    
    return (
        <div className={`bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-100 overflow-hidden ${depth > 0 ? 'ml-4 sm:ml-6 md:ml-8' : ''}`}>
            <div className="p-3 sm:p-4 md:p-6">
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                            <User className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 text-sm sm:text-base">
                                {comment.author?.name || 'Anonymous'}
                            </p>
                            {comment.post && (
                                <a 
                                    href={`/post-details/${comment.post.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs sm:text-sm text-purple-600 hover:text-purple-800 transition-colors mt-1"
                                >
                                    <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                    <span className="truncate">{comment.post.title}</span>
                                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                        <button
                            onClick={() => setReplyingTo(isReplying ? null : comment._id)}
                            className="p-1.5 sm:p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Reply"
                        >
                            <Reply className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                            onClick={() => deleteComment(comment._id)}
                            className="p-1.5 sm:p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                        >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                </div>

                {/* Comment Content */}
                <div
                    className="prose prose-sm sm:prose max-w-none text-gray-700 mb-3 bg-gray-50 p-3 sm:p-4 rounded-lg"
                    dangerouslySetInnerHTML={{ __html: marked(comment.content || '') }}
                />

                {/* Comment Footer */}
                <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                    {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>

                {/* Reply Form */}
                {isReplying && (
                    <div className="mt-4 space-y-3 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <label className="block text-sm font-semibold text-gray-900">Your Reply</label>
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            rows={3}
                            className="w-full border-2 border-blue-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 rounded-lg px-3 py-2 transition-all outline-none resize-none text-sm sm:text-base"
                            placeholder="Write your reply..."
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={() => submitReply(comment._id)}
                                disabled={loading || !replyContent.trim()}
                                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm sm:text-base font-medium"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-4 h-4" />
                                        Posting...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-4 h-4" />
                                        Post Reply
                                    </>
                                )}
                            </button>
                            <button
                                onClick={() => {
                                    setReplyingTo(null);
                                    setReplyContent('');
                                }}
                                className="px-3 py-2 sm:px-4 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm sm:text-base font-medium"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Nested Replies */}
            {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <div className="border-t border-gray-200 bg-gray-50/50 p-2 sm:p-3 space-y-2 sm:space-y-3">
                    {comment.replies.map((reply) => (
                        <CommentCard
                            key={reply._id}
                            comment={reply}
                            deleteComment={deleteComment}
                            replyingTo={replyingTo}
                            setReplyingTo={setReplyingTo}
                            replyContent={replyContent}
                            setReplyContent={setReplyContent}
                            submitReply={submitReply}
                            loading={loading}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

// --- Utilities ---
function nestComments(comments) {
    const map = {};
    const roots = [];

    comments.forEach(comment => {
        map[comment._id] = { ...comment, replies: [] };
    });

    comments.forEach(comment => {
        if (comment.parentComment) {
            const parent = map[comment.parentComment];
            if (parent) parent.replies.push(map[comment._id]);
        } else {
            roots.push(map[comment._id]);
        }
    });

    return roots;
}

function removeCommentById(comments, id) {
    return comments
        .filter(c => c._id !== id)
        .map(c => ({
            ...c,
            replies: removeCommentById(c.replies || [], id),
        }));
}

function findPostId(comments, commentId) {
    for (const c of comments) {
        if (c._id === commentId && c.post?._id) return c.post._id;
        if (c.replies?.length) {
            const found = findPostId(c.replies, commentId);
            if (found) return found;
        }
    }
    return null;
}

function filterCommentsByPost(comments, postId) {
    return comments
        .filter(c => c.post?._id === postId)
        .map(c => ({
            ...c,
            replies: filterCommentsByPost(c.replies || [], postId),
        }));
}

function countComments(comments) {
    let count = 0;
    comments.forEach(c => {
        count++;
        if (c.replies?.length) {
            count += countComments(c.replies);
        }
    });
    return count;
}