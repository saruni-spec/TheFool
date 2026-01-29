import { Card, CardContent } from "@/components/ui/Card";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-shadows text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
          AbOuT tHe WiSe FoOl
        </h1>
        <p className="text-xl text-slate-400 font-caveat">
            Where wisdom wears a jester's hat.
        </p>
      </div>

      <Card className="bg-yellow-500/10 border-yellow-500/20">
        <CardContent className="pt-6 text-yellow-200/90 text-center">
            <p className="font-bold mb-2">⚠️ READER ADVISORY ⚠️</p>
            <p className="text-sm">
                Some articles on this site are intentionally satirical, sarcastic, or present reverse perspectives. 
                If something sounds like terrible advice, it probably is. Read at your own risk. The Fool accepts 
                no responsibility for those who take this nonsense literally.
            </p>
        </CardContent>
      </Card>

      <div className="prose prose-invert prose-lg text-slate-300 leading-loose mx-auto">
        <p>
            Welcome to the corner of the internet where wisdom wears a jester's hat. I'm The Fool – 
            not because I lack knowledge, but because I'm just foolish enough to share it.
        </p>
        <p>
            This blog is my attempt to make sense of life's complexities through a lens of humor, 
            irony, and occasional accidental insight. I write about philosophy, psychology, mental health, 
            social issues, science, and tech – all with the unearned confidence of someone who's 
            definitely not qualified to do so.
        </p>
        <p>
            Sometimes I'm serious. Sometimes I'm joking. Half the time, I don't know which is which, 
            and that's part of the fun. If you're looking for consistent, reliable advice... you've made 
            a terrible navigation error.
        </p>
        
        <h3>What you will find here:</h3>
        <ul className="list-disc pl-6 space-y-2 marker:text-purple-400">
            <li>Questions disguised as answers</li>
            <li>Wisdom hiding behind jokes</li>
            <li>Sarcasm masquerading as insight</li>
            <li>The occasional genuine breakthrough (probably by accident)</li>
        </ul>

        <p>
            My writing style toggles between thoughtful analysis and complete absurdity, often 
            within the same sentence. I might discuss profound philosophical concepts while making 
            terrible puns, or explore complex psychological theories through stories about my ongoing 
            battle with household appliances.
        </p>
        <p>
            If you're wondering why anyone would take advice from someone who calls themselves 
            a fool... well, that's exactly the right question to be asking. Welcome home.
        </p>
      </div>

      <div className="border-t border-dashed border-white/10 pt-8 text-center space-y-4">
        <h3 className="text-xl font-caveat text-slate-400">Choose your preferred tagline:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-500">
            <div className="p-3 rounded-lg bg-slate-900/50">The Wise Fool: Where Wisdom Meets Wit</div>
            <div className="p-3 rounded-lg bg-slate-900/50 italic">The Wise Fool: Think. Laugh. Learn.</div>
            <div className="p-3 rounded-lg bg-slate-900/50">As Dumb as It Looks, But Wiser Than You Think</div>
            <div className="p-3 rounded-lg bg-slate-900/50 font-bold">A Different Perspective on Life</div>
        </div>
      </div>

      <div className="text-center space-y-2 pt-8">
        <p className="font-shadows text-2xl text-slate-300">Still figuring it out,</p>
        <p className="font-shadows text-3xl text-purple-400">The Fool</p>
      </div>
    </div>
  );
}
