import { getLatestArticles } from "@/actions/articles";
import ArticleCard from "@/components/ArticleCard";
import Button from "@/components/ui/Button";
import Link from "next/link";

export default async function Home() {
  const articles = await getLatestArticles();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 text-center space-y-6">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-slate-950 to-slate-950 opacity-50 blur-3xl pointer-events-none" />
        
        <h1 className="font-shadows text-5xl sm:text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          ThE wIsE foOl
        </h1>
        
        <p className="max-w-2xl mx-auto text-xl text-slate-400 font-light italic font-caveat leading-loose">
          "A blend of philosophy, psychology, humor and insights on life, with wit and occasional wisdom."
        </p>

        <div className="flex justify-center gap-4 pt-4">
           <Link href="/about">
             <Button variant="outline" className="rounded-full px-8">Read Manifesto</Button>
           </Link>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="space-y-8">
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <h2 className="text-3xl font-caveat text-slate-200">Latest Musings</h2>
          <Link href="/archive">
            <Button variant="ghost" size="sm" className="hidden md:flex">View Archive &rarr;</Button>
          </Link>
        </div>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-slate-600">
            <p>No articles found. The Fool is likely sleeping.</p>
          </div>
        )}
      </section>
    </div>
  );
}
