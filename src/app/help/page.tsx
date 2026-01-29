import { Card, CardContent } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { Mail } from "lucide-react";

export default function HelpPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
      <h1 className="text-4xl font-shadows text-slate-100">Need Guidance?</h1>
      
      <p className="max-w-md text-slate-400 text-lg">
        If you're lost, confused, or just want to tell us we're wrong, reach out.
      </p>

      <Card className="p-8 border-white/10 bg-gradient-to-b from-slate-900 to-slate-950">
        <CardContent className="flex flex-col items-center gap-6">
            <div className="bg-purple-900/20 p-4 rounded-full">
                <Mail className="w-8 h-8 text-purple-400" />
            </div>
            
            <div className="space-y-2">
                <h3 className="text-xl font-medium text-slate-200">Contact Us</h3>
                <p className="text-slate-500 text-sm">We usually respond within 48 hours (or whenever the mood strikes).</p>
            </div>

            <a href="mailto:oddsthingshere@gmail.com">
                <Button>Email Support</Button>
            </a>
        </CardContent>
      </Card>
    </div>
  );
}
