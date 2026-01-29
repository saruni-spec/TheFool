"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createArticle } from "@/actions/articles";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

export default function WritePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
        <div className="p-8 text-center text-slate-400">Loading study...</div>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createArticle(formData, parseInt(session!.user.id));

    if (result.error) {
        setError(result.error);
        setLoading(false);
    } else {
        router.push("/dashboard");
        router.refresh();
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link href="/dashboard" className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <Card className="bg-slate-900/60 border-white/10">
        <CardHeader>
            <CardTitle className="font-shadows text-2xl">Pen a New Musing</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-3 bg-red-500/10 text-red-400 text-sm rounded-lg border border-red-500/20">
                        {error}
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Title</label>
                    <Input name="title" placeholder="The paradox of the..." required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Description (Optional)</label>
                    <textarea 
                        name="description" 
                        className="w-full h-20 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        placeholder="A brief teaser..."
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Image URL (Optional)</label>
                    <Input name="image" placeholder="https://..." />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Content (HTML supported for now)</label>
                    <textarea 
                        name="content" 
                        required
                        className="w-full h-64 rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-purple-400 focus:outline-none font-mono"
                        placeholder="<p>Start writing...</p>"
                    />
                    <p className="text-xs text-slate-500">Basic HTML tags are supported.</p>
                </div>

                <div className="pt-4 flex justify-end">
                    <Button type="submit" disabled={loading} className="w-full md:w-auto">
                        <Save className="w-4 h-4 mr-2" />
                        {loading ? "Publishing..." : "Publish Article"}
                    </Button>
                </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
