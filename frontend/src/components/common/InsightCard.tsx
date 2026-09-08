import { Link } from "react-router-dom";

import type { InsightArticle } from "@/types";

type Props = {
  article: InsightArticle;
};

export function InsightCard({ article }: Props) {
  return (
    <Link
      to={`/insights/${article.slug}`}
      className="block overflow-hidden rounded-xl border border-border bg-surface hover:border-primary"
    >
      <div className="relative aspect-video">
        <img src={article.coverImage} alt={article.title} className="h-full w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-surface px-2.5 py-0.5 text-xs font-semibold text-text-secondary">
          {article.category}
        </span>
      </div>
      <div className="p-4">
        <p className="font-display text-base font-semibold text-text-primary">{article.title}</p>
        <p className="mt-2 line-clamp-2 text-sm text-text-secondary">{article.summary}</p>
        <p className="mt-3 font-mono text-xs text-text-muted">
          {new Date(article.publishDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
    </Link>
  );
}
