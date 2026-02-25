import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BLOG_POSTS } from "@/data/blog";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and advice for UT Knoxville students on apartments, leases, roommates, and student housing.",
};

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-20">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-ut-orange mb-2">
            SmartLease Blog
          </p>
          <h1
            className="text-3xl font-bold text-ink md:text-4xl"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Student Housing Tips &amp; Guides
          </h1>
          <p className="mt-3 text-smokey-gray max-w-lg mx-auto">
            Everything UT Knoxville students need to know about apartments,
            leases, roommates, and making the most of off-campus living.
          </p>
        </div>

        <div className="space-y-6">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-2xl border border-ink/5 bg-white p-6 sm:p-8 shadow-sm transition-all hover:shadow-md hover:border-ut-orange/20"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="rounded-full bg-ut-orange/10 px-3 py-1 text-xs font-semibold text-ut-orange">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-xs text-smokey-light">
                  <Calendar size={12} />
                  {formatDate(post.date)}
                </span>
                <span className="flex items-center gap-1 text-xs text-smokey-light">
                  <Clock size={12} />
                  {post.readTime}
                </span>
              </div>

              <h2
                className="text-xl font-bold text-ink sm:text-2xl group-hover:text-ut-orange transition-colors"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {post.title}
              </h2>

              <p className="mt-2 text-sm text-smokey-gray leading-relaxed">
                {post.description}
              </p>

              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-ut-orange group-hover:gap-2 transition-all">
                Read more
                <ArrowRight size={14} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
