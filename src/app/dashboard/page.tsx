import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getUserArticles } from "@/actions/articles";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { PenTool, FileText, MessageCircle, Plus } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const articles = await getUserArticles(parseInt(session.user.id));

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-shadows text-slate-100">Writer's Study</h1>
          <p className="text-slate-400">Manage your musings and nonsense.</p>
        </div>
        <Link href="/write">
            <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Article
            </Button>
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stats Card (Mockup) */}
        <Card className="bg-purple-900/20 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-purple-300">Total Articles</CardTitle>
                <FileText className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-slate-100">{articles.length}</div>
            </CardContent>
        </Card>
      </div>

      <h2 className="text-xl font-medium text-slate-200 pt-4">Your Articles</h2>
      
      {articles.length > 0 ? (
        <div className="grid gap-4">
            {articles.map((article) => (
                <Card key={article.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-900/60 transition-colors">
                    <div className="space-y-1">
                        <h3 className="font-medium text-slate-200">{article.title}</h3>
                        <div className="flex items-center gap-4 text-xs text-slate-500">
                             <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                             <span className="flex items-center gap-1">
                                <MessageCircle className="w-3 h-3" /> {article._count.comments}
                             </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4 md:mt-0">
                        <Link href={`/article/${article.slug || article.id}`}>
                            <Button variant="ghost" size="sm">View</Button>
                        </Link>
                        {/* Edit button placeholder - implementing full edit flow is out of scope for initial migration */}
                        <Button variant="outline" size="sm" disabled title="Editing coming soon">
                            <PenTool className="w-3 h-3 mr-2" /> Edit
                        </Button>
                    </div>
                </Card>
            ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-slate-950/30">
            <p className="text-slate-500 mb-4">You haven't written anything yet. How foolish.</p>
            <Link href="/write">
                <Button variant="secondary">Start Writing</Button>
            </Link>
        </div>
      )}
    </div>
  );
}
