import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { useUser } from '@/context/userContext';

const PostPage = ({ post }) => {
  const { user } = useUser();
  const [likes, setLikes] = useState(post.likes.length);
  const [dislikes, setDislikes] = useState(post.dislikes.length);
  const [isLiked, setIsLiked] = useState(post.likes.includes(user?.id));
  const [isDisliked, setIsDisliked] = useState(post.dislikes.includes(user?.id));

  const handleReaction = async (actionType) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/posts/action/${post._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ action: actionType }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        setLikes(updatedPost.likes.length);
        setDislikes(updatedPost.dislikes.length);

        if (actionType === 'like') {
          setIsLiked(!isLiked);
          setIsDisliked(false);
        } else if (actionType === 'dislike') {
          setIsDisliked(!isDisliked);
          setIsLiked(false);
        }
      }
    } catch (error) {
      console.error(`Error performing ${actionType} action:`, error);
    }
  };

  const handleShare = () => {
    navigator.share?.({
      title: post.title,
      url: window.location.href,
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={post.author.avatarUrl}
          alt={post.author.name}
          className="w-10 h-10 rounded-full shadow-sm"
        />
        <div>
          <p className="text-sm text-gray-700 font-semibold">{post.author.name}</p>
          <p className="text-xs text-gray-500">
            Posted on {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-playfair)' }}>{post.title}</h1>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full object-cover mb-6"
        />
      )}

      <div className="flex justify-end space-x-4 my-8">
        <button
          onClick={() => handleReaction('like')}
          className={`flex items-center space-x-2 cursor-pointer ${
            isLiked ? 'text-blue-600' : 'text-gray-600'
          } hover:text-blue-600`}
        >
          <ThumbsUp className="w-5 h-5" />
          <span>({likes})</span>
        </button>
        <button
          onClick={() => handleReaction('dislike')}
          className={`flex items-center space-x-2 cursor-pointer ${
            isDisliked ? 'text-red-600' : 'text-gray-600'
          } hover:text-red-600`}
        >
          <ThumbsDown className="w-5 h-5" />
          <span>({dislikes})</span>
        </button>
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 text-gray-600 hover:text-green-600 cursor-pointer"
        >
          <Share2 className="w-5 h-5" />
          <span>Share</span>
        </button>
      </div>

      <div
        className="prose prose-lg whitespace-pre-wrap mb-6 text-sm"
        style={{ fontFamily: 'var(--font-roboto)' }}
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
};

export default PostPage;
