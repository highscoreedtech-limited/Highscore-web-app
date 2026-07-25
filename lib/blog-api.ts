import { BLOG_POSTS, BLOG_CATEGORIES, type BlogPost } from "./blog-posts";

const BASE = process.env.NEXT_PUBLIC_API_URL || "https://highscore-mobile-production.up.railway.app";

// Category used for HERR academic articles (kept out of the normal blog).
export const HERR_CATEGORY = "HighScore EdTech Research Review";
const isHerr = (p: BlogPost) => p.category === HERR_CATEGORY || /research review/i.test(p.category);

// Backend BlogPost shape (fields differ slightly from the web BlogPost).
interface ApiPost {
  slug: string; title: string; category: string; subcategory: string;
  tag: string; tags: string[] | null; excerpt: string; body: string[] | null;
  source: string; image: string; author: string; download_url: string;
  published: boolean; created_at: string;
}

function toBlogPost(p: ApiPost): BlogPost {
  const d = p.created_at ? new Date(p.created_at) : new Date();
  return {
    slug: p.slug, title: p.title, category: p.category, subcategory: p.subcategory,
    tag: p.tag, tags: p.tags || [], excerpt: p.excerpt, body: p.body || [],
    source: p.source, img: p.image || "/study-background.jpg",
    author: p.author || undefined, downloadUrl: p.download_url || undefined,
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

// Blog feed: everything EXCEPT HERR academic articles.
export async function getBlogPosts(): Promise<BlogPost[]> {
  return (await getPosts()).filter((p) => !isHerr(p));
}

// HERR feed: only the research-review academic articles.
export async function getHerrPosts(): Promise<BlogPost[]> {
  return (await getPosts()).filter(isHerr);
}

export async function getHerrPost(slug: string): Promise<BlogPost | null> {
  const p = await getPost(slug);
  return p && isHerr(p) ? p : null;
}

export async function getCategories(): Promise<string[]> {
  const posts = await getBlogPosts();
  const cats = [...new Set(posts.map((p) => p.category).filter(Boolean))];
  return cats.length ? cats : BLOG_CATEGORIES.filter((c) => c !== HERR_CATEGORY);
}

export type { BlogPost };
