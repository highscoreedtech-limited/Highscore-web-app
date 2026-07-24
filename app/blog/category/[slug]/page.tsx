import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ArrowRight } from "lucide-react";
import { BLOG_CATEGORIES } from "@/lib/blog-posts";
import { getPosts, getCategories } from "@/lib/blog-api";

export const revalidate = 300;
export const dynamicParams = true;

const catSlug = (c: string) => c.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export function generateStaticParams() {
  return BLOG_CATEGORIES.map((c) => ({ slug: catSlug(c) }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const cats = await getCategories();
  const category = cats.find((c) => catSlug(c) === params.slug);
  return { title: `${category ?? "Articles"} — HighScore EdTech Blog` };
}

export default async function BlogCategory({ params }: { params: { slug: string } }) {
  const cats = await getCategories();
  const category = cats.find((c) => catSlug(c) === params.slug);
  if (!category) notFound();
  const all = await getPosts();
  const posts = all.filter((p) => p.category === category);

  return (
    <div className="min-h-screen bg-white font-sans text-hs-body">
      <header className="sticky top-0 z-40 border-b border-hs-border bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-hs-navy hover:text-hs-blue">
            <ArrowLeft size={17} /> All articles
          </Link>
          <Image src="/highscore-logo-final.png" alt="HighScore" width={140} height={36} className="h-9 w-auto object-contain" priority />
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 pt-10 lg:px-8">
        <p className="text-[12px] font-bold uppercase tracking-wide text-hs-blue">Category</p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-hs-navy lg:text-5xl">{category}</h1>
        <p className="mt-3 text-hs-muted">{posts.length} article{posts.length === 1 ? "" : "s"}</p>

        <div className="mt-8 grid gap-6 pb-16 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <article key={p.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-hs-border bg-white shadow-[0_10px_30px_-8px_rgba(4,44,83,0.16)] hover:shadow-[0_22px_44px_-12px_rgba(4,44,83,0.28)]">
              <Link href={`/blog/${p.slug}`} className="flex flex-1 flex-col">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-bold text-hs-blue">{p.tag}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="flex items-center gap-1.5 text-[11px] text-hs-muted"><CalendarDays size={13} /> {p.date}</p>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-hs-navy">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-hs-muted">{p.excerpt}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-hs-blue">Read more <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
