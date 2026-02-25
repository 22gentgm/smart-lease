import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { BLOG_POSTS, getPostBySlug } from "@/data/blog";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

function formatDate(dateStr: string) {
  return new Date(dateStr + "T12:00:00").toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function MarkdownContent({ content }: { content: string }) {
  const lines = content.trim().split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;
  let inList = false;
  let listItems: React.ReactNode[] = [];

  function flushList() {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="my-4 ml-6 list-disc space-y-1 text-smokey-gray">
          {listItems}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  }

  function parseInline(text: string): React.ReactNode {
    const parts: React.ReactNode[] = [];
    let remaining = text;
    let i = 0;

    const regex = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*/g;
    let match;
    let lastIndex = 0;

    while ((match = regex.exec(remaining)) !== null) {
      if (match.index > lastIndex) {
        parts.push(remaining.slice(lastIndex, match.index));
      }
      if (match[1] && match[2]) {
        parts.push(
          <Link key={i++} href={match[2]} className="text-ut-orange hover:underline font-medium">
            {match[1]}
          </Link>
        );
      } else if (match[3]) {
        parts.push(<strong key={i++} className="font-semibold text-ink">{match[3]}</strong>);
      }
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < remaining.length) {
      parts.push(remaining.slice(lastIndex));
    }

    return parts.length === 1 ? parts[0] : parts;
  }

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList();
      continue;
    }

    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={key++}
          className="mt-10 mb-4 text-xl font-bold text-ink sm:text-2xl"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {trimmed.slice(3)}
        </h2>
      );
    } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      inList = true;
      listItems.push(<li key={key++}>{parseInline(trimmed.slice(2))}</li>);
    } else if (/^\d+\.\s/.test(trimmed)) {
      if (!inList) {
        inList = true;
      }
      listItems.push(
        <li key={key++}>{parseInline(trimmed.replace(/^\d+\.\s/, ""))}</li>
      );
    } else {
      flushList();
      elements.push(
        <p key={key++} className="my-4 text-smokey-gray leading-relaxed">
          {parseInline(trimmed)}
        </p>
      );
    }
  }

  flushList();
  return <>{elements}</>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  return (
    <div className="min-h-screen bg-cream pb-24 md:pb-0">
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-smokey-gray hover:text-ut-orange transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Back to Blog
        </Link>

        <div className="flex items-center gap-3 mb-4">
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

        <h1
          className="text-3xl font-bold text-ink sm:text-4xl mb-2"
          style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
        >
          {post.title}
        </h1>

        <p className="text-smokey-gray text-lg mb-8 border-b border-ink/5 pb-8">
          {post.description}
        </p>

        <article className="prose-smart">
          <MarkdownContent content={post.content} />
        </article>

        <div className="mt-16 rounded-2xl border border-ut-orange/20 bg-ut-orange/5 p-6 sm:p-8 text-center">
          <h3
            className="text-xl font-bold text-ink mb-2"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Ready to find your apartment?
          </h3>
          <p className="text-smokey-gray text-sm mb-4">
            Take our 30-second quiz and get personalized apartment rankings.
          </p>
          <Link
            href="/quiz"
            className="inline-block rounded-full bg-ut-orange px-6 py-3 text-sm font-semibold text-white shadow hover:bg-orange-600 transition-colors"
          >
            Take the Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}
