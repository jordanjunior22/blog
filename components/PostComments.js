'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useUser } from '@/context/userContext';
import { 
  Loader2, 
  MessageSquare, 
  Send, 
  User,
  Reply,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PostComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const { user } = useUser();
  const router = useRouter();

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      const nested = nestComments(data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      setComments(nested);
    } catch (err) {
      console.error('Failed to fetch comments', err);
      showNotification('error', 'Failed to load comments');
    }
  }

  async function submitComment() {
    if (!newCommentContent.trim()) {
      showNotification('error', 'Comment cannot be empty');
      return;
    }
    if (!user) {
      showNotification('error', 'Please login to comment');
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newCommentContent,
          post: postId,
          authorId: user._id,
          parentComment: null,
        }),
      });
      if (!res.ok) throw new Error('Failed to post comment');
      await fetchComments();
      setNewCommentContent('');
      showNotification('success', 'Comment posted successfully!');
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to post comment');
    }
    setLoading(false);
  }

  async function submitReply(parentId) {
    if (!replyContent.trim()) {
      showNotification('error', 'Reply cannot be empty');
      return;
    }
    if (!user) {
      showNotification('error', 'Please login to reply');
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: replyContent,
          post: postId,
          authorId: user._id,
          parentComment: parentId || null,
        }),
      });
      if (!res.ok) throw new Error('Failed to post reply');
      await fetchComments();
      setReplyingTo(null);
      setReplyContent('');
      showNotification('success', 'Reply posted successfully!');
    } catch (err) {
      console.error(err);
      showNotification('error', 'Failed to post reply');
    }
    setLoading(false);
  }

  return (
    <section className="relative">
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-2xl animate-slide-in max-w-md ${
          notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white`}>
          {notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span className="font-medium text-sm">{notification.message}</span>
        </div>
      )}

      {/* Animations */}
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
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl shadow-lg">
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
              Comments
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
              {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>
        </div>

        {/* New Comment Form */}
        <div className="mb-8">
          <div className="flex items-start gap-3 sm:gap-4">
            {user ? (
              <img
                src={user.avatarUrl || '/default.webp'}
                alt={user.name}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200 shadow-sm flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <textarea
                className="w-full rounded-xl border-2 border-gray-200 focus:ring-4 focus:ring-purple-100 focus:border-purple-500 focus:outline-none p-3 sm:p-4 resize-none text-sm sm:text-base text-gray-800 placeholder-gray-400 transition-all"
                rows={4}
                placeholder={user ? "Share your thoughts..." : "Please login to comment"}
                value={newCommentContent}
                onChange={(e) => setNewCommentContent(e.target.value)}
                disabled={loading || !user}
              />
              <div className="flex items-center justify-between mt-3">
                <p className="text-xs text-gray-500">
                  {newCommentContent.length} characters
                </p>
                <button
                  onClick={submitComment}
                  disabled={loading || !user || !newCommentContent.trim()}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Post Comment
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-4 sm:space-y-6">
          {comments.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4">
                <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No comments yet</h3>
              <p className="text-sm sm:text-base text-gray-600">Be the first to share your thoughts!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <CommentCard
                key={comment._id}
                comment={comment}
                replyingTo={replyingTo}
                setReplyingTo={setReplyingTo}
                replyContent={replyContent}
                setReplyContent={setReplyContent}
                submitReply={submitReply}
                loading={loading}
                user={user}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function CommentCard({
  comment,
  replyingTo,
  setReplyingTo,
  replyContent,
  setReplyContent,
  submitReply,
  loading,
  user,
  depth = 0
}) {
  const isReplying = replyingTo === comment._id;

  return (
    <article className={`animate-fade-in ${depth > 0 ? 'ml-4 sm:ml-8 md:ml-12' : ''}`}>
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
        {/* Comment Header */}
        <header className="flex items-start gap-3 mb-3">
          <img
            src={comment.author?.avatarUrl || '/default.webp'}
            alt={comment.author?.name || 'User'}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm border-2 border-white flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm sm:text-base font-bold text-gray-900">
                {comment.author?.name || 'Anonymous'}
              </h3>
              {comment.author?.role === 'admin' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                  Admin
                </span>
              )}
            </div>
            <time
              className="text-xs text-gray-500"
              dateTime={comment.createdAt}
              title={new Date(comment.createdAt).toLocaleString()}
            >
              {getTimeAgo(new Date(comment.createdAt))}
            </time>
          </div>
        </header>

        {/* Comment Content */}
        <section
          className="prose prose-sm sm:prose-base max-w-none mb-3 text-gray-700 pl-0 sm:pl-[52px]"
          dangerouslySetInnerHTML={{ __html: marked(comment.content || '') }}
        />

        {/* Reply Button */}
        <div className="pl-0 sm:pl-[52px]">
          <button
            onClick={() => setReplyingTo(isReplying ? null : comment._id)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors"
          >
            {isReplying ? (
              <>
                <X className="w-4 h-4" />
                Cancel
              </>
            ) : (
              <>
                <Reply className="w-4 h-4" />
                Reply
              </>
            )}
          </button>
        </div>

        {/* Reply Form */}
        {isReplying && (
          <div className="mt-4 pl-0 sm:pl-[52px] animate-fade-in">
            <div className="flex items-start gap-3">
              {user ? (
                <img
                  src={user.avatarUrl || '/default.webp'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-gray-200 shadow-sm flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <textarea
                  className="w-full rounded-lg border-2 border-gray-200 p-3 text-sm focus:ring-4 focus:ring-purple-100 focus:border-purple-500 focus:outline-none resize-none transition-all"
                  rows={3}
                  placeholder="Write a reply..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  disabled={loading}
                />
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-500">
                    {replyContent.length} characters
                  </p>
                  <button
                    onClick={() => submitReply(comment._id)}
                    disabled={loading || !replyContent.trim()}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Replying...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Submit Reply
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Nested Replies */}
      {comment.replies?.length > 0 && (
        <div className="mt-4 space-y-4 pl-0 sm:pl-6 border-l-2 border-purple-200">
          {comment.replies.map((reply) => (
            <CommentCard
              key={reply._id}
              comment={reply}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              submitReply={submitReply}
              loading={loading}
              user={user}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </article>
  );
}

// Utilities
function nestComments(comments) {
  const map = {};
  const roots = [];

  comments.forEach((comment) => {
    map[comment._id] = { ...comment, replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentComment) {
      const parent = map[comment.parentComment];
      if (parent) parent.replies.push(map[comment._id]);
    } else {
      roots.push(map[comment._id]);
    }
  });

  return roots;
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval === 1 ? '' : 's'} ago`;
    }
  }
  
  return 'Just now';
}