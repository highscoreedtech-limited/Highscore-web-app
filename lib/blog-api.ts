import { BLOG_POSTS, BLOG_CATEGORIES, type BlogPost } from "./blog-posts";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://highscore-mobile-production.up.railway.app";

// Backend BlogPost shape (fields differ slightly from the web BlogPost).
interface ApiPost {
  slug: string; title: string; category: string; subcategory: string;
  tag: string; tags: string[] | null; excerpt: string; body: string[] | null;
  source: string; image: string; published: boolean; created_at: string;
}

function toBlogPost(p: ApiPost): BlogPost {
  const d = p.created_at ? new Date(p.created_at) : new Date();
  return {
    slug: p.slug, title: p.title, category: p.category, subcategory: p.subcategory,
    tag: p.tag, tags: p.tags || [], excerpt: p.excerpt, body: p.body || [],
    source: p.source, img: p.image || "/study-background.jpg",
    date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
  };
}

// Server-side fetch with ISR (revalidate every 5 min). Falls back to the
// bundled seed data if the API is unreachable, so the blog never goes blank.
export async function getPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${BASE}/api/blog`, { next: { revalidate: 300 } });
    if (!res.ok) throw new Error(String(res.status));
    const json = await res.json();
    const posts: ApiPost[] = json.data || [];
    if (!posts.length) return BLOG_POSTS;
    return posts.map(toBlogPost);
  } catch {
    return BLOG_POSTS; // offline / build-time fallback
  }
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BASE}/api/blog/${slug}`, { next: { revalidate: 300 } });
    if (res.ok) {
      const json = await res.json();
      if (json.data) return toBlogPost(json.data);
    }
  } catch { /* fall through */ }
  return BLOG_POSTS.find((p) => p.slug === slug) || null;
}

export async function getCategories(): Promise<string[]> {
  const posts = await getPosts();
  const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))];
  return cats.length ? cats : BLOG_CATEGORIES;
}

export type { BlogPost };
