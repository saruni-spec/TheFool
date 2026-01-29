"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { UserPlus } from "lucide-react";
import { registerUser } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await registerUser(formData);

    if (res.error) {
       setError(res.error);
       setLoading(false);
       return;
    }

    // Redirect to login on success
    router.push("/login?message=registered");
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/10 via-slate-950 to-slate-950 opacity-30 pointer-events-none" />
      
      <Card className="w-full max-w-md border-white/10 bg-slate-900/60 backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="text-center space-y-2">
           <div className="mx-auto bg-indigo-500/10 p-3 rounded-full w-fit mb-2">
            <UserPlus className="w-6 h-6 text-indigo-400" />
          </div>
          <CardTitle className="text-2xl font-shadows text-slate-100">Join The Fool</CardTitle>
          <CardDescription>Begin your journey into wisdom and nonsense</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
             {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Name</label>
              <Input 
                name="name" 
                type="text" 
                placeholder="The Jester" 
                required 
                className="bg-slate-950/50 border-white/5 focus:border-indigo-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Email</label>
              <Input 
                name="email" 
                type="email" 
                placeholder="fool@wise.com" 
                required 
                 className="bg-slate-950/50 border-white/5 focus:border-indigo-500/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Password</label>
              <Input 
                name="password" 
                type="password" 
                required 
                 className="bg-slate-950/50 border-white/5 focus:border-indigo-500/50"
              />
            </div>
            <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 border-0"
                disabled={loading}
            >
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <div className="text-center text-sm text-slate-500 mt-4">
              Already have an account?{" "}
              <Link href="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
