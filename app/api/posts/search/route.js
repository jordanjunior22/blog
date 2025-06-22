// /app/api/posts/search/route.ts
import { NextResponse } from 'next/server'
import connectDB from '@/utils/connectDB'
import Post from '@/models/Post'
import Category from '@/models/Category'

export async function GET() {
  await connectDB()

  const posts = await Post.find()
    .populate('category', 'name slug')
    .populate('author', 'name avatarUrl')
    .sort({ publishedAt: -1 })
    .lean()

  const categories = await Category.find().sort({ name: 1 }).lean()

  return NextResponse.json({ posts, categories })
}
