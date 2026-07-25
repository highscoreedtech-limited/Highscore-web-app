import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ArrowRight } from "lucide-react";
import { redirect } from "next/navigation";
import Linkified from "@/components/Linkified";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { getPost, getBlogPosts, HERR_CATEGORY } from "@/lib/blog-api";

// Revalidate so newly-published articles appear without a redeploy.
export const revalidate = 300;
export const dynamicParams = true; // render slugs added via the admin on demand

// Seed the known slugs at build time; new ones render on first request.
export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) return { title: "Article — HighScore EdTech" };
  return {
    title: `${post.title} — HighScore EdTech`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.img] },
  };
}

export default async function BlogArticle({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);
  if (!post) notFound();
  // HERR research articles live only under /herr — never in the blog.
  if (post.category === HERR_CATEGORY || /research review/i.test(post.category)) {
    redirect(`/herr/${post.slug}`);
  }

  const all = await getBlogPosts();
  const related = all
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-white font-sans text-hs-body">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-hs-border bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-hs-navy hover:text-hs-blue">
            <ArrowLeft size={17} /> All articles
          </Link>
          <Image src="/highscore-logo-final.png" alt="HighScore" width={140} height={36} className="h-9 w-auto object-contain" priority />
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 pb-16 pt-8 lg:px-8">
        {/* Meta */}
        <p className="text-[12px] font-bold uppercase tracking-wide text-hs-blue">
          {post.category}{post.subcategory ? ` · ${post.subcategory}` : ""}
        </p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-hs-navy lg:text-4xl">{post.title}</h1>
        <p className="mt-3 flex items-center gap-2 text-sm text-hs-muted">
          <CalendarDays size={14} /> {post.date}
        </p>

        {/* Cover */}
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image src={post.img} alt={post.title} fill className="object-cover" priority />
        </div>

        {/* Body */}
        <div className="prose-hs mt-8 space-y-5">
          {post.body.map((para, i) => (
            <p key={i} className="text-[17px] leading-[1.75] text-hs-body">{para}</p>
          ))}
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-hs-blueTint px-3 py-1 text-xs font-semibold text-hs-blue">{t}</span>
            ))}
          </div>
        )}

        {/* Source */}
        {post.source && (
          <p className="mt-6 border-t border-hs-border pt-5 text-sm text-hs-muted">
            <span className="font-semibold text-hs-navy">Source:</span> <Linkified text={post.source} />
          </p>
        )}
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-3xl px-4 pb-16 lg:px-8">
          <h2 className="mb-5 border-b-2 border-hs-navy pb-3 text-xl font-extrabold text-hs-navy">More in {post.category}</h2>
          <div className="grid gap-5 sm:grid-cols-3">
            {related.map((p) => (
              <Link key={p.slug} href={`/blog/${p.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-hs-border bg-white transition-shadow hover:shadow-lg">
                <div className="relative aspect-video overflow-hidden">
                  <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="line-clamp-3 text-sm font-bold leading-snug text-hs-navy group-hover:text-hs-blue">{p.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-hs-navy">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 px-4 py-12 text-center lg:px-8">
          <h2 className="text-2xl font-extrabold text-white lg:text-3xl">Put it into practice</h2>
          <p className="max-w-md text-[#B8CCE0]">Study lessons, CBT practice and quiz battles — all in the HighScore app.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-hs-amber px-7 py-3.5 font-semibold text-hs-amberDark">Get started free <ArrowRight size={18} /></Link>
        </div>
      </section>
    </div>
  );
}
