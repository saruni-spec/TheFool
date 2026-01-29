import { prisma } from "@/lib/prisma";
import ArticleCard from "@/components/ArticleCard";
import { Card, CardContent } from "@/components/ui/Card";

export default async function ArchivePage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: "desc" },
    include: {
        author: {
            select: { name: true }
        },
        _count: {
            select: { comments: true }
        }
    }
  });

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4 py-8">
        <h1 className="font-shadows text-5xl font-bold text-slate-100">The Archives</h1>
        <p className="text-xl text-slate-400 font-caveat">"Everything starts as a thought... and ends as a URL."</p>
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
             <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <Card className="bg-slate-900/50 border-white/5">
            <CardContent className="p-12 text-center text-slate-500">
                <p>The archives are empty. History has yet to be written.</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
