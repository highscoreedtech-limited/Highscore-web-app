import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CalendarDays, ArrowRight, FileText } from "lucide-react";
import { getPosts } from "@/lib/blog-api";

export const revalidate = 300;

export const metadata = {
  title: "HERR — HighScore EdTech Research Review",
  description: "Research, data and evidence-based insights on exams, study methods and student outcomes in Nigeria.",
};

// Research pieces are blog posts filed under this category (set in the admin editor).
const HERR_CATEGORY = "HighScore EdTech Research Review";

export default async function HerrPage() {
  const all = await getPosts();
  const papers = all.filter(
    (p) => p.category === HERR_CATEGORY || /research/i.test(p.category)
  );

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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {papers.map((p) => (
              <article key={p.slug} className="group flex flex-col overflow-hidden rounded-2xl border border-hs-border bg-white shadow-[0_10px_30px_-8px_rgba(4,44,83,0.16)] hover:shadow-[0_22px_44px_-12px_rgba(4,44,83,0.28)]">
                <Link href={`/blog/${p.slug}`} className="flex flex-1 flex-col">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                    <span className="absolute left-3 top-3 rounded-full bg-hs-navy/90 px-2.5 py-1 text-[11px] font-bold text-white">Research</span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="flex items-center gap-1.5 text-[11px] text-hs-muted"><CalendarDays size={13} /> {p.date}</p>
                    <h3 className="mt-2 text-lg font-bold leading-snug text-hs-navy">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-hs-muted">{p.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-hs-blue">Read <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
