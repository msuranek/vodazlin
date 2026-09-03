import Link from "next/link";
import type { ReactNode } from "react";

interface ArticleLayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

export default function ArticleLayout({ title, description, children }: ArticleLayoutProps) {
  return (
    <main className="flex-grow">
      <section className="container-custom py-12">
        <div className="max-w-3xl">
          <Link href="/" className="text-sm font-mono text-water-700 hover:text-water-900">
            VodaZlín.cz
          </Link>
          <h1 className="text-3xl md:text-5xl font-mono font-bold text-earth-900 mt-4 mb-5 leading-tight">
            {title}
          </h1>
          <p className="text-lg text-earth-700 leading-relaxed">{description}</p>
        </div>
      </section>

      <article className="container-custom pb-16">
        <div className="max-w-3xl article-content">
          {children}
        </div>
      </article>
    </main>
  );
}
