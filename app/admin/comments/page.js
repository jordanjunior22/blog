'use client';

import { useEffect, useState } from 'react';
import { marked } from 'marked';
import { useUser } from '@/context/userContext'; // Adjust the import path as needed
import { Loader2 } from 'lucide-react';

export default function AdminComments() {
    const [comments, setComments] = useState([]);
    const [filteredComments, setFilteredComments] = useState([]);
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyContent, setReplyContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const { user } = useUser();

    useEffect(() => {
        fetchComments();
        fetch('/api/posts')
            .then(res => res.json())
            .then(setPosts);
    }, []);

    const fetchComments = async () => {
        setInitialLoading(true);
        const res = await fetch('/api/comments');
        const data = await res.json();
        const nested = nestComments(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
        setComments(nested);
        setFilteredComments(nested);
        setInitialLoading(false);
    };

    useEffect(() => {
        if (!selectedPost) {
            setFilteredComments(comments);
        } else {
            setFilteredComments(filterCommentsByPost(comments, selectedPost));
        }
    }, [selectedPost, comments]);

    const deleteComment = async (id) => {
        if (!confirm('Delete comment?')) return;

        const res = await fetch(`/api/comments/${id}`, {
            method: 'DELETE',
        });

        if (!res.ok) {
            console.error('Delete failed');
            return;
        }

        setComments(prev => removeCommentById(prev, id));
    };

    const submitReply = async (parentId) => {
        if (!replyContent.trim()) return;
        if (!user) {
            console.error('User not logged in');
            return;
        }
        const postId = findPostId(comments, parentId);
        if (!postId) {
            console.error('Post ID not found for reply');
            return;
        }

        setLoading(true);

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
            const errorText = await res.text();
            console.error('Reply failed:', errorText);
            setLoading(false);
            return;
        }

        const newReply = await res.json();
        setComments(prev => addReplyToComment(prev, parentId, newReply));
        await fetchComments();
        setReplyingTo(null);
        setReplyContent('');
        setLoading(false);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Manage Comments</h1>
                <select
                    className="border px-2 py-1 rounded"
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

            {initialLoading ? (
                <div className="flex justify-center items-center py-10 text-blue-600">
                    <Loader2 className="animate-spin h-6 w-6 mr-2" />
                    Loading comments...
                </div>
            ) : (
                <div className="space-y-4">
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
                        />
                    ))}
                </div>
            )}
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
}) {
    return (
        <div className="border p-4 rounded bg-white shadow ml-4">
            <div className="text-sm text-gray-700">
                <strong>{comment.author?.name || 'Anonymous'}</strong> on{' '}
                <a href={`/posts/${comment.post?.slug}`} className="underline text-blue-600">
                    {comment.post?.title}
                </a>
            </div>
            <div
                className="my-2 text-gray-900 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: marked(comment.content || '') }}
            />
            <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</div>
            <div className="flex gap-4 mt-2">
                <button
                    onClick={() => deleteComment(comment._id)}
                    className="text-red-500 text-sm cursor-pointer hover:underline"
                >
                    Delete
                </button>
                <button
                    onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                    className="text-blue-600 text-sm"
                >
                    {replyingTo === comment._id ? 'Cancel' : 'Reply'}
                </button>
            </div>

            {replyingTo === comment._id && (
                <div className="mt-2">
                    <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={2}
                        className="w-full border p-2 rounded mb-1 text-sm"
                        placeholder="Write a reply..."
                    />
                    <button
                        onClick={() => submitReply(comment._id)}
                        disabled={loading}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 flex items-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="animate-spin h-4 w-4" />
                                Replying...
                            </>
                        ) : (
                            'Submit Reply'
                        )}
                    </button>
                </div>
            )}

            {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                <div className="mt-4 pl-4 border-l-2 border-gray-300">
                    {comment.replies.map((reply, index) => (
                        <CommentCard
                            key={reply._id || `reply-${index}`}
                            comment={reply}
                            deleteComment={deleteComment}
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

function addReplyToComment(comments, parentId, reply) {
    return comments.map(c => {
        if (c._id === parentId) {
            return { ...c, replies: [...(c.replies || []), reply] };
        } else if (c.replies?.length) {
            return { ...c, replies: addReplyToComment(c.replies, parentId, reply) };
        }
        return c;
    });
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
