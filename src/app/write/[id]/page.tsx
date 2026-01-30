"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { updateArticle, getArticle } from "@/actions/articles";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { use } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function EditArticlePage({ params }: PageProps) {
  const { id } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [content, setContent] = useState("");
  const [article, setArticle] = useState<any>(null);

  useEffect(() => {
    async function fetchArticle() {
        if (!id) return;
        const data = await getArticle(id); // getArticle handles string IDs
        if (data) {
            setArticle(data);
            setContent(data.content);
        } else {
            setError("Article not found");
        }
        setLoading(false);
    }
    fetchArticle();
  }, [id]);

  if (status === "loading" || loading) {
    return (
        <div className="p-8 text-center text-slate-400">Loading editor...</div>
    );
  }

  if (!session) {
      router.push("/login"); // Client-side redirect if not logged in
      return null;
  }

  if (article && article.authorId !== parseInt(session.user.id)) {
      return <div className="p-8 text-center text-red-400">Unauthorized</div>;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    if (!content.trim()) {
        setError("Content is required");
        setSaving(false);
        return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("content", content);

    const result = await updateArticle(parseInt(id), formData, parseInt(session!.user.id));

    if (result.error) {
        setError(result.error);
        setSaving(false);
    } else {
        router.push("/dashboard");
        router.refresh();
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <Card className="bg-slate-900/60 border-white/10">
        <CardHeader>
            <CardTitle className="font-shadows text-2xl">Edit Musing</CardTitle>
        </CardHeader>
        <CardContent>
            {article ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Title</label>
                        <Input name="title" defaultValue={article.title} required />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
                        <textarea 
                            name="description" 
                            defaultValue={article.description || ""}
                            className="w-full h-20 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                            placeholder="A brief teaser..."
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Image URL (Optional)</label>
                        <Input name="image" defaultValue={article.image || ""} placeholder="https://..." />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Custom JavaScript (Optional - Advanced)</label>
                        <textarea 
                            name="customJs" 
                            defaultValue={article.customJs || ""}
                            className="w-full h-32 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-purple-400 focus:outline-none font-mono"
                            placeholder="// console.log('Hello from custom JS');"
                        />
                        <p className="text-xs text-yellow-500/80">Warning: This code will execute on the article page. Use with caution.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">Content</label>
                        <RichTextEditor 
                            content={content} 
                            onChange={setContent} 
                            placeholder="Start writing..."
                        />
                        <input type="hidden" name="content" value={content} />
                    </div>

                    <div className="pt-4 flex justify-end">
                        <Button type="submit" disabled={saving} className="w-full md:w-auto">
                            <Save className="w-4 h-4 mr-2" />
                            {saving ? "Saving..." : "Update Article"}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="text-center text-white">Article not found</div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}
