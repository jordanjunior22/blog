export default async function sitemap() {
  const baseUrl = "https://chestofcontemplation.com";

  // If you have posts in MongoDB:
  let posts = [];
  try {
    const res = await fetch(`${baseUrl}/api/posts`, { next: { revalidate: 60 } });
    posts = await res.json();
  } catch (e) {
    posts = [];
  }

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: post.updatedAt || post.createdAt,
      changeFrequency: "monthly",
      priority: 0.8,
    })),
  ];
}
