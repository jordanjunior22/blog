'use client';

import React, { useEffect, useState } from 'react';
import CategoriesCart, { CartSkeleton } from '../CategoriesCart';

export default function Categories() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const res = await fetch('/api/categories');
                if (!res.ok) throw new Error('Failed to fetch categories');
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchCategories();
    }, []);

    return (
        <div className="px-6 py-6 md:px-30 md:py-15">
            <h1 className="text-2xl font-bold mb-6 text-center">Explore Categories</h1>
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {loading ? (
                    [1, 2, 3, 4].map((n) => (
                        <CartSkeleton key={n} />
                    ))
                ) : (
                    categories.length > 0 ? (
                        categories.map(category => (
                            <CategoriesCart
                                key={category._id}
                                imageUrl={category.coverImage || '/placeholder.jpg'}
                                title={category.name}
                                description={category.description}
                                link={`/blog-category/${category.slug}`}
                            />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">No featured posts available.</p>
                    )
                )}

            </div>
        </div>
    );
}
