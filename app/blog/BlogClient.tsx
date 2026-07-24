"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { Reveal, stagger, item } from "@/components/Reveal";
import { session } from "@/lib/api/session";
import BlogSplash from "@/components/BlogSplash";
import type { BlogPost } from "@/lib/blog-posts";

// Browse-by-topic tiles: real categories, each fronted by a rotating image.
const CAT_IMAGES = ["/study-background.jpg", "/english.jpg", "/cbt.jpg", "/physics.jpg", "/quiz.jpg", "/maths.jpg", "/cbt-banner.jpg"];

export default function BlogClient({ posts, categories }: { posts: BlogPost[]; categories: string[] }) {
  const POSTS = posts;
  const CATEGORIES = categories.map((label, i) => ({ label, img: CAT_IMAGES[i % CAT_IMAGES.length] }));

  // Auth-aware chrome: logged-in readers navigate back to the dashboard and
  // never see "Get started". SSR-safe (session reads localStorage on mount).
  const [loggedIn, setLoggedIn] = useState(false);
  useEffect(() => { setLoggedIn(!!session.access); }, []);

  const [featured, ...rest] = POSTS;
  const picks = rest.slice(0, 3);
  const latest = rest.slice(3);

  return (
    <div className="min-h-screen bg-white font-sans text-hs-body">
      <BlogSplash />
      {/* Nav — logged-in readers go back to their dashboard, visitors to the landing page */}
      <header className="sticky top-0 z-50 border-b border-hs-border bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-8">
          <Link href={loggedIn ? "/dashboard" : "/"} className="flex items-center gap-2 text-hs-navy">
            <ArrowLeft size={18} />
            <Image src="/highscore-logo-final.png" alt="HighScore" width={200} height={52} className="h-11 w-auto object-contain lg:h-12" priority />
          </Link>
          {loggedIn ? (
            <Link href="/dashboard" className="rounded-full bg-hs-blue px-5 py-2 text-sm font-semibold text-white hover:bg-hs-blueDeep">My Dashboard</Link>
          ) : (
            <Link href="/signup" className="rounded-full bg-hs-blue px-5 py-2 text-sm font-semibold text-white hover:bg-hs-blueDeep">Get started</Link>
          )}
        </div>
      </header>

      {/* Masthead */}
      <section className="mx-auto max-w-6xl px-4 pt-12 lg:px-8 lg:pt-16">
        <Reveal>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-hs-blueTint px-3 py-1 text-xs font-semibold uppercase tracking-wide text-hs-blue">The HighScore Journal</span>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.05] tracking-tight text-hs-navy lg:text-6xl">
            Tips, guides &amp; stories to help you <span className="text-hs-blue">score higher.</span>
          </h1>
          <p className="mt-4 max-w-xl text-lg text-hs-muted">Exam strategy, study science and real student wins — straight from the HighScore team.</p>
        </Reveal>
      </section>

      {/* Editorial picks — featured + list */}
      <section className="mx-auto max-w-6xl px-4 pt-12 lg:px-8 lg:pt-16">
        <div className="mb-6 flex items-end justify-between border-b-2 border-hs-navy pb-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-hs-navy lg:text-3xl">Editorial picks</h2>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Featured */}
          <Reveal className="lg:col-span-2">
            <Link href={`/blog/${featured.slug}`} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                <Image src={featured.img} alt={featured.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-hs-amber px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-hs-amberDark">{featured.tag}</span>
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <p className="flex items-center gap-1.5 text-[12px] text-white/80"><CalendarDays size={13} /> {featured.date}</p>
                  <h3 className="mt-2 max-w-2xl text-2xl font-extrabold leading-tight lg:text-3xl">{featured.title}</h3>
                  <p className="mt-2 hidden max-w-xl text-sm text-white/85 sm:block">{featured.excerpt}</p>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-hs-amber">Read the story <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" /></span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* Side list */}
          <div className="flex flex-col divide-y divide-hs-border">
            {picks.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.08}>
                <Link href={`/blog/${p.slug}`} className="group flex gap-4 py-4 first:pt-0">
                  <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl">
                    <Image src={p.img} alt={p.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[11px] font-bold uppercase tracking-wide text-hs-blue">{p.tag}</span>
                    <h4 className="mt-0.5 line-clamp-2 text-[15px] font-bold leading-snug text-hs-navy group-hover:text-hs-blue">{p.title}</h4>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-hs-muted"><CalendarDays size={12} /> {p.date}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Categories — image tiles */}
      <section className="mx-auto max-w-6xl px-4 pt-16 lg:px-8">
        <div className="mb-6 border-b-2 border-hs-navy pb-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-hs-navy lg:text-3xl">Browse by topic</h2>
        </div>
        <motion.div className="grid grid-cols-2 gap-4 lg:grid-cols-4" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          {CATEGORIES.map((c) => (
            <motion.div key={c.label} variants={item}>
              <Link href={`/blog/category/${c.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}`} className="group relative flex aspect-[4/5] items-center justify-center overflow-hidden rounded-2xl">
                <Image src={c.img} alt={c.label} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-hs-navy/55 transition-colors group-hover:bg-hs-navy/45" />
                <span className="relative rounded-md border border-white/70 px-4 py-2 text-center text-sm font-bold uppercase tracking-wide text-white">{c.label}</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Latest */}
      <section className="mx-auto max-w-6xl px-4 pt-16 lg:px-8">
        <div className="mb-6 border-b-2 border-hs-navy pb-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-hs-navy lg:text-3xl">Latest articles</h2>
        </div>
        <motion.div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }}>
          {latest.map((p) => (
            <motion.article key={p.slug} variants={item} whileHover={{ y: -8 }} className="group flex flex-col overflow-hidden rounded-2xl border border-hs-border bg-white shadow-[0_10px_30px_-8px_rgba(4,44,83,0.16)] hover:shadow-[0_22px_44px_-12px_rgba(4,44,83,0.28)]">
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
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* CTA band — signup pitch for visitors, back-to-study for members */}
      <section className="mt-16 bg-hs-navy">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-14 text-center lg:px-8">
          {loggedIn ? (
            <>
              <h2 className="max-w-2xl text-3xl font-extrabold text-white lg:text-4xl">Ready to put it into practice?</h2>
              <p className="max-w-lg text-[#B8CCE0]">Jump back into your lessons, CBT practice and quiz battles.</p>
              <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-full bg-hs-amber px-7 py-3.5 font-semibold text-hs-amberDark">Back to my dashboard <ArrowRight size={18} /></Link>
            </>
          ) : (
            <>
              <h2 className="max-w-2xl text-3xl font-extrabold text-white lg:text-4xl">Get the study edge in your inbox</h2>
              <p className="max-w-lg text-[#B8CCE0]">New guides, past-question breakdowns and streak stories — no spam, just wins.</p>
              <Link href="/signup" className="inline-flex items-center gap-2 rounded-full bg-hs-amber px-7 py-3.5 font-semibold text-hs-amberDark">Get started free <ArrowRight size={18} /></Link>
            </>
          )}
        </div>
      </section>

      <footer className="border-t border-hs-border bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-hs-muted sm:flex-row lg:px-8">
          <Image src="/highscore-logo-final.png" alt="HighScore" width={170} height={42} className="h-11 w-auto object-contain" />
          <p>© {new Date().getFullYear()} HighScore EdTech</p>
        </div>
      </footer>
    </div>
  );
}
