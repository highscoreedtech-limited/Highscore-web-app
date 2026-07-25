import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, ArrowRight, FileText, User } from "lucide-react";
import { getHerrPosts } from "@/lib/blog-api";

export const revalidate = 300;

export const metadata = {
  title: "HERR — HighScore EdTech Research Review",
  description: "Peer-style academic research on exams, gamification, study methods and student outcomes — from the HighScore EdTech research desk.",
};

export default async function HerrPage() {
  const papers = await getHerrPosts();

  return (
    <div className="min-h-screen bg-white font-sans text-hs-body">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-hs-border bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-hs-navy hover:text-hs-blue">
            <ArrowLeft size={17} /> Home
          </Link>
          <Image src="/highscore-logo-final.png" alt="HighScore" width={140} height={36} className="h-9 w-auto object-contain" priority />
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-[#042C53] to-[#06223E]">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-14 text-center lg:px-8 lg:py-20">
          <Image src="/HERR.png" alt="HighScore EdTech Research Review" width={150} height={150}
            className="h-32 w-32 object-contain drop-shadow-2xl lg:h-40 lg:w-40" priority />
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-white lg:text-5xl">
            HighScore EdTech <span className="text-hs-amber">Research Review</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[#B8CCE0] lg:text-lg">
            Evidence-based research, data and academic insight on exams, study methods and student
            outcomes across Nigeria — from the HighScore EdTech research desk.
          </p>
        </div>
      </section>

      {/* Papers */}
      <section className="mx-auto max-w-5xl px-4 py-14 lg:px-8">
        <div className="mb-6 flex items-center gap-2 border-b-2 border-hs-navy pb-3">
          <FileText size={20} className="text-hs-blue" />
          <h2 className="text-2xl font-extrabold tracking-tight text-hs-navy">Research &amp; Papers</h2>
        </div>

        {papers.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-hs-border py-16 text-center">
            <FileText size={40} className="mx-auto text-hs-placeholder" />
            <p className="mt-4 text-lg font-bold text-hs-navy">Research is on the way</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-hs-muted">
              Our first research reviews are being prepared. Check back soon, or read our study guides on the blog.
            </p>
            <Link href="/blog" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-hs-blue px-6 py-3 text-sm font-semibold text-white">
              Visit the blog <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {papers.map((p) => (
              <Link key={p.slug} href={`/herr/${p.slug}`}
                className="group block rounded-2xl border border-hs-border bg-white p-6 shadow-[0_10px_30px_-10px_rgba(4,44,83,0.14)] transition-shadow hover:shadow-[0_22px_44px_-14px_rgba(4,44,83,0.26)]">
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-hs-blue">
                  <span className="rounded bg-hs-blueTint px-2 py-0.5">Research Article</span>
                  {p.subcategory && <span className="text-hs-muted">{p.subcategory}</span>}
                </div>
                <h3 className="mt-3 text-xl font-extrabold leading-snug text-hs-navy group-hover:text-hs-blue lg:text-2xl">{p.title}</h3>
                {p.author && (
                  <p className="mt-2 flex items-center gap-1.5 text-sm text-hs-muted"><User size={14} /> {p.author}</p>
                )}
                <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-hs-body">{p.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[12px] text-hs-muted"><CalendarDays size={13} /> {p.date}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-semibold text-hs-blue">Read paper <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
