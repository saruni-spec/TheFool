import { getArticle } from "@/actions/articles";
import { notFound } from "next/navigation";
import { Calendar, User, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import CustomScript from "@/components/CustomScript";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <header className="space-y-6 text-center border-b border-white/5 pb-12">
        <div className="flex items-center justify-center gap-4 text-sm text-purple-400 font-mono tracking-wider">
          <span className="flex items-center gap-2 bg-purple-500/10 px-3 py-1 rounded-full">
            <Calendar className="w-4 h-4" />
            {new Date(article.createdAt).toLocaleDateString()}
          </span>
          {article.author && (
            <span className="flex items-center gap-2 bg-slate-800 px-3 py-1 rounded-full">
              <User className="w-4 h-4" />
              {article.author.name}
            </span>
          )}
        </div>
        
        <h1 className="font-shadows text-4xl sm:text-5xl md:text-7xl font-bold leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-slate-400">
          {article.title}
        </h1>
      </header>

      {/* Content */}
      <div 
        className="prose prose-invert md:prose-lg max-w-none text-slate-300 leading-loose space-y-6 font-serif px-1"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      
      {/* Custom JavaScript Injection */}
      {article.customJs && <CustomScript script={article.customJs} />}

      {/* Comments Section */}
      <section className="pt-12 border-t border-white/5 space-y-8">
        <h2 className="text-3xl font-caveat text-slate-200">Comments ({article.comments.length})</h2>
        
        {/* Comment List */}
        <div className="space-y-4">
          {article.comments.map((comment) => (
            <Card key={comment.id} className="bg-slate-900/40 border-slate-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <div className="flex items-center gap-2 font-medium text-purple-300">
                    <User className="w-4 h-4" />
                    {comment.reader?.user?.name || "Anonymous Reader"}
                 </div>
                 <span className="text-xs text-slate-500 flex items-center gap-1">
                   <Clock className="w-3 h-3" />
                   {new Date(comment.createdAt).toLocaleDateString()}
                 </span>
              </CardHeader>
              <CardContent className="text-slate-300 text-sm leading-relaxed">
                {comment.content}
              </CardContent>
            </Card>
          ))}

          {article.comments.length === 0 && (
            <p className="text-slate-500 italic">No comments yet. Be the first to be foolish.</p>
          )}
        </div>

        {/* Placeholder for Add Comment */}
        <div className="bg-slate-900/20 p-6 rounded-xl border border-dashed border-slate-800 text-center">
             <p className="text-slate-400 mb-4">Join the conversation</p>
             <Button variant="outline">Sign in to Comment</Button>
        </div>
      </section>
    </article>
  );
}
