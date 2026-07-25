import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, User, CalendarDays, Download, FileText } from "lucide-react";
import Linkified from "@/components/Linkified";
import { getHerrPost, getHerrPosts } from "@/lib/blog-api";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const papers = await getHerrPosts();
  return papers.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getHerrPost(params.slug);
  if (!post) return { title: "HERR — HighScore EdTech Research Review" };
  return {
    title: `${post.title} — HERR`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.img] },
  };
}

export default async function HerrArticle({ params }: { params: { slug: string } }) {
  const post = await getHerrPost(params.slug);
  if (!post) notFound();

  return (
    <div className="min-h-screen bg-white font-sans text-hs-body">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-hs-border bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/herr" className="inline-flex items-center gap-2 text-sm font-semibold text-hs-navy hover:text-hs-blue">
            <ArrowLeft size={17} /> HERR
          </Link>
          <Image src="/highscore-logo-final.png" alt="HighScore" width={140} height={36} className="h-9 w-auto object-contain" priority />
        </div>
      </header>

      <article className="mx-auto max-w-3xl px-4 pb-16 pt-8 lg:px-8">
        {/* Journal header */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-hs-blue">
          <span className="rounded bg-hs-blueTint px-2 py-0.5">HighScore EdTech Research Review</span>
          {post.subcategory && <span className="text-hs-muted">{post.subcategory}</span>}
        </div>
        <h1 className="mt-4 text-[28px] font-extrabold leading-tight tracking-tight text-hs-navy lg:text-[38px]">{post.title}</h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-hs-border py-3 text-sm text-hs-muted">
          {post.author && <span className="flex items-center gap-1.5 font-semibold text-hs-navy"><User size={15} /> {post.author}</span>}
          <span className="flex items-center gap-1.5"><CalendarDays size={14} /> {post.date}</span>
        </div>

        {/* Keywords */}
        {post.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-hs-bg px-3 py-1 text-xs font-medium text-hs-muted">{t}</span>
            ))}
          </div>
        )}

        {/* Body — "## " lines render as section headings */}
        <div className="mt-8">
          {post.body.map((block, i) =>
            block.startsWith("## ") ? (
              <h2 key={i} className="mt-9 mb-3 border-l-4 border-hs-blue pl-3 text-xl font-extrabold text-hs-navy lg:text-2xl">
                {block.slice(3)}
              </h2>
            ) : (
              <p key={i} className="mb-4 text-[17px] leading-[1.8] text-hs-body">{block}</p>
            )
          )}
        </div>

        {/* Full-paper download */}
        {post.downloadUrl && (
          <a href={post.downloadUrl} target="_blank" rel="noreferrer"
            className="mt-8 flex items-center justify-between gap-4 rounded-2xl border border-hs-border bg-hs-bg p-5 transition-colors hover:bg-hs-blueTint/40">
            <span className="flex items-center gap-3">
              <FileText className="text-hs-blue" size={26} />
              <span>
                <span className="block text-sm font-bold text-hs-navy">Full research paper (PDF)</span>
                <span className="block text-xs text-hs-muted">Complete manuscript with appendices, data & analysis</span>
              </span>
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-hs-blue px-4 py-2.5 text-sm font-semibold text-white">
              <Download size={16} /> Download
            </span>
          </a>
        )}

        {/* Citation */}
        {post.source && (
          <p className="mt-8 rounded-xl bg-hs-bg p-4 text-sm leading-relaxed text-hs-muted">
            <span className="font-semibold text-hs-navy">Citation:</span> <Linkified text={post.source} />
          </p>
        )}
      </article>
    </div>
  );
}
