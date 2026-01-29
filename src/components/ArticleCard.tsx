import Link from "next/link";
import { Calendar, User, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

interface ArticleCardProps {
  article: {
    id: number;
    title: string;
    slug: string | null;
    description: string | null;
    createdAt: Date;
    author: {
      name: string;
    } | null;
    _count: {
      comments: number;
    };
  };
}

export default function ArticleCard({ article }: ArticleCardProps) {
  // Use slug if available, otherwise fallback to ID (though new architecture should enforce slugs)
  const href = article.slug ? `/article/${article.slug}` : `/article/${article.id}`;

  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/30 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)] bg-gradient-to-br from-slate-900/80 to-slate-900/40">
        <CardHeader>
          <div className="flex items-center gap-2 text-xs text-purple-400 mb-2 font-mono uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(article.createdAt).toLocaleDateString()}
            </span>
          </div>
          <CardTitle className="font-shadows text-2xl group-hover:text-purple-300 transition-colors line-clamp-2">
            {article.title}
          </CardTitle>
          {article.author && (
             <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
               <User className="w-3 h-3" />
               <span>{article.author.name}</span>
             </div>
          )}
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3 text-slate-400 leading-relaxed">
            {article.description || "No description available."}
          </CardDescription>
          
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-600 group-hover:text-slate-400 transition-colors">
            <MessageCircle className="w-3 h-3" />
            <span>{article._count.comments} Comments</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
