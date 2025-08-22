'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useUser } from '@/context/userContext';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
// Reusable Button component with your style logic
function Button({
  isCustom = false,
  className,
  style,
  disabled = false,
  children,
  ...props
}) {

  return (
    <button
      {...props}
      disabled={disabled}
      className={
        isCustom
          ? className
          : `px-4 py-2 text-sm text-background transition cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
          }`
      }
      style={
        isCustom
          ? style
          : {
            backgroundColor: 'var(--cta-color)',
            borderRadius: '20px',
            ...style,
          }
      }
    >
      {children}
    </button>
  );
}

export default function PostComments({ postId }) {
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const router = useRouter(); 

  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    try {
      const res = await fetch(`/api/comments?postId=${postId}`);
      const data = await res.json();
      const nested = nestComments(data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)));
      setComments(nested);
      console.log('Fetched comments:', nested);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    }
  }

  async function submitComment() {
    if (!newCommentContent.trim()) return;
    if (!user) {
      alert('Please login to comment');
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
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  async function submitReply(parentId) {
    if (!replyContent.trim()) return;
    if (!user) {
      router.push('/login'); // ✅ redirect to login
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
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  return (
    <section className="p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl mb-6 text-gray-900 border-b pb-2">Comments</h2>
      <p className='text-sm'>Leave a comment</p>
      <textarea
        className="w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 mb-4 resize-none text-gray-800 placeholder-gray-400 transition-shadow duration-300"
        rows={4}
        placeholder="Write your comment here..."
        value={newCommentContent}
        onChange={(e) => setNewCommentContent(e.target.value)}
        disabled={loading}
      />
      <Button onClick={submitComment} disabled={loading}>
        {loading ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : null}
        {loading ? 'Posting...' : 'Post Comment'}
      </Button>

      <div className="mt-8 space-y-6">
        {comments.length === 0 && (
          <p className="text-gray-500 italic text-center">No comments yet. Be the first to share your thoughts!</p>
        )}
        {comments.map((comment) => (
          <CommentCard
            key={comment._id}
            comment={comment}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            submitReply={submitReply}
            loading={loading}
          />
        ))}
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
}) {
  return (
    <article className="bg-gray-50 rounded-lg p-5 shadow-lg ml-4">
      <header className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-3">
          <img
            src={comment.author?.avatarUrl || '/default.webp'}
            alt={comment.author?.name || 'User'}
            className="w-8 h-8 rounded-full object-cover shadow-sm"
          />
          <h3 className="text-sm font-bold text-gray-900">
            {comment.author?.name || 'Anonymous'}
          </h3>
        </div>
        <time
          className="text-xs text-gray-400 whitespace-nowrap"
          dateTime={comment.createdAt}
          title={new Date(comment.createdAt).toLocaleString()}
        >
          {new Date(comment.createdAt).toLocaleDateString()}
        </time>
      </header>


      <section
        className="prose prose-sm max-w-none mb-3 text-gray-700 text-sm"
        dangerouslySetInnerHTML={{ __html: marked(comment.content || '') }}
      />

      <button
        onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
        className="text-blue-600 text-sm font-medium hover:underline focus:outline-none"
      >
        {replyingTo === comment._id ? 'Cancel' : 'Reply'}
      </button>

      {replyingTo === comment._id && (
        <div className="mt-3">
          <textarea
            className="w-full rounded-md border border-gray-300 p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none mb-2"
            rows={3}
            placeholder="Write a reply..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            disabled={loading}
          />
          <Button
            onClick={() => submitReply(comment._id)}
            disabled={loading}
            className="inline-flex items-center text-sm px-4 py-1 rounded-md shadow"
            style={{ backgroundColor: 'var(--cta-color)' }}
          >
            {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : null}
            {loading ? 'Replying...' : 'Submit Reply'}
          </Button>
        </div>
      )}

      {comment.replies?.length > 0 && (
        <div className="mt-5 pl-6 border-l-2 border-blue-200">
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
            />
          ))}
        </div>
      )}
    </article>
  );
}

// Utilities (same as admin)
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
