"use client";
import React, { useEffect, useState } from 'react';
import PostPage from '@/components/user/Posts';
import { useParams } from 'next/navigation';
import RelatedPosts from '@/components/RelatedPost';
import PostPageSkeleton from '@/components/PageSkeletonLoad';
import PostComments from '@/components/PostComments';

const PostWrapper = () => {
  const { slug } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const res = await fetch(`/api/posts/post-details/${slug}`);
        if (!res.ok) throw new Error('Post not found');

        const data = await res.json();
        setPost(data);
      } catch (err) {
        console.error(err);
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) return <PostPageSkeleton />;
  if (!post) return <p>Post not found</p>;

  return (
    <div className="px-6 md:px-32 py-10">
      <PostPage post={post} />
      <RelatedPosts currentPostId={post._id} />
      <PostComments postId={post._id}/>
    </div>
  );
};

export default PostWrapper;
