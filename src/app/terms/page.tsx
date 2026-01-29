import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8">
      <h1 className="text-4xl font-shadows text-center text-slate-100">Terms and Conditions</h1>
      
      <Card className="bg-slate-900/30 border-white/10">
        <CardContent className="prose prose-invert prose-slate pt-6">
            <p>
            Welcome to our blog site. By accessing and using this site, you agree to the following terms and conditions:
            </p>
            <ul className="space-y-4">
                <li>
                    <strong className="text-purple-300">Access to Content:</strong> Readers may access and read any article published on this site.
                </li>
                <li>
                    <strong className="text-purple-300">Registration:</strong> Readers may register on the website to receive notifications when new articles are published.
                </li>
                <li>
                    <strong className="text-purple-300">Cookies:</strong> This site uses cookies to store your current session. We do not use cookies for any other purpose.
                </li>
                <li>
                    <strong className="text-purple-300">Governing Law:</strong> These terms and conditions are governed by the laws of Kenya.
                </li>
            </ul>
        </CardContent>
      </Card>
      
      <p className="text-center text-xs text-slate-600">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
