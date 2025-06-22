import React, { useState, useEffect } from 'react';
import PostCart, { PostCartSkeleton } from '../PostCart';

import { MoveRight } from 'lucide-react';

export default function LatestPost() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const res = await fetch('/api/posts');
                const data = await res.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    console.log(posts)

    return (
        <div className='px-6 md:px-30 md:py-15 py-6'>
            <div className='flex justify-between items-center'>
                <h1 className='text-xl font-semibold'>Latest Writing</h1>
                <a
                    href='/blog'
                    className="inline-flex items-center gap-2 text-[var(--cta-color)] text-sm font-medium hover:underline"
                >
                    View All
                    <MoveRight size={18} />
                </a>
            </div>

            <div className="mt-6">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((n) => (
                            <PostCartSkeleton key={n} />
                        ))}
                    </div>
                ) : posts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.slice(0, 3).map(post => (
                            <PostCart key={post._id} post={post} />
                        ))}
                    </div>
                ) : (
                    <p>No featured posts available.</p>
                )}

            </div>
        </div>
    );
}
