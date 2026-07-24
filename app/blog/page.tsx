import BlogClient from "./BlogClient";
import { getPosts, getCategories } from "@/lib/blog-api";

// Revalidate every 5 minutes so admin-published posts appear without a redeploy.
export const revalidate = 300;

export const metadata = {
  title: "Blog — HighScore EdTech",
  description: "Exam strategy, study science and real student wins from the HighScore team.",
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPosts(), getCategories()]);
  return <BlogClient posts={posts} categories={categories} />;
}
