import React, { useState, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { useUser } from '@/context/userContext';

const PostPage = ({ post }) => {
  const { user } = useUser();
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [dislikes, setDislikes] = useState(post.dislikes?.length || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  // ✅ Set initial like/dislike state after user loads
  useEffect(() => {
    if (user && user._id) {
      setIsLiked(post.likes?.includes(user._id) || false);
      setIsDisliked(post.dislikes?.includes(user._id) || false);
    }
  }, [user, post.likes, post.dislikes]);

  const handleReaction = async (actionType) => {
    if (!user) {
      alert('Please login to react to posts');
      return;
    }

    try {
      // ✅ Correct endpoint path for action/[id] structure
      const response = await fetch(`/api/posts/action/${post._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // ✅ Removed Authorization header - verifyUser uses cookies
        },
        body: JSON.stringify({ action: actionType }),
      });

      if (response.ok) {
        const updatedPost = await response.json();
        
        // ✅ Update counts from response
        setLikes(updatedPost.likes.length);
        setDislikes(updatedPost.dislikes.length);

        // ✅ Update UI state based on action
        if (actionType === 'like') {
          setIsLiked(!isLiked);
          if (isDisliked) setIsDisliked(false);
        } else if (actionType === 'dislike') {
          setIsDisliked(!isDisliked);
          if (isLiked) setIsLiked(false);
        }
      } else {
        const error = await response.json();
        console.error('Error:', error);
        alert(error.error || 'Failed to update reaction');
      }
    } catch (error) {
      console.error(`Error performing ${actionType} action:`, error);
      alert('Network error. Please try again.');
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center space-x-4 mb-4">
        <img
          src={post.author?.avatarUrl || '/default.webp'}
          alt={post.author?.name || 'Author'}
          className="w-10 h-10 rounded-full shadow-sm object-cover"
        />
        <div>
          <p className="text-sm text-gray-700 font-semibold">
            {post.author?.name || 'Anonymous'}
          </p>
          <p className="text-xs text-gray-500">
            Posted on {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <h1 
        className="text-3xl font-bold mb-4" 
        style={{ fontFamily: 'var(--font-playfair)' }}
      >
        {post.title}
      </h1>

      {post.coverImage && (
        <img
          src={post.coverImage}
          alt={post.title}
          className="w-full object-cover mb-6 rounded-lg"
        />
      )}

      <div className="flex justify-end space-x-4 my-8">
        <button
          onClick={() => handleReaction('like')}
          disabled={!user}
          className={`flex items-center space-x-2 transition-colors ${
            isLiked ? 'text-blue-600' : 'text-gray-600'
          } hover:text-blue-600 ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={!user ? 'Login to like this post' : isLiked ? 'Unlike' : 'Like this post'}
        >
          <ThumbsUp className="w-5 h-5" fill={isLiked ? 'currentColor' : 'none'} />
          <span>({likes})</span>
        </button>
        
        <button
          onClick={() => handleReaction('dislike')}
          disabled={!user}
          className={`flex items-center space-x-2 transition-colors ${
            isDisliked ? 'text-red-600' : 'text-gray-600'
          } hover:text-red-600 ${!user ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={!user ? 'Login to dislike this post' : isDisliked ? 'Remove dislike' : 'Dislike this post'}
        >
          <ThumbsDown className="w-5 h-5" fill={isDisliked ? 'currentColor' : 'none'} />
          <span>({dislikes})</span>
        </button>
        
        <button
          onClick={handleShare}
          className="flex items-center space-x-2 text-gray-600 hover:text-green-600 cursor-pointer transition-colors"
          title="Share this post"
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