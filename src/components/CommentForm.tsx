"use client";

import { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { addComment } from "@/actions/articles";
import { checkClaimStatus, claimAccount } from "@/actions/claim";
import { checkLegacyUser, registerUser } from "@/actions/auth";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Loader2 } from "lucide-react";

export default function CommentForm({ articleId }: { articleId: number }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Basic State
  const [content, setContent] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recoveryMsg, setRecoveryMsg] = useState<{name: string, pass: string} | null>(null);

  // Claim Flow State
  const [claimStatus, setClaimStatus] = useState<"none" | "unclaimed" | "fuzzy" | "taken" | "available">("none");
  const [suggestion, setSuggestion] = useState<{name: string, id: number} | null>(null);
  const [claimUserId, setClaimUserId] = useState<number | null>(null);

  const isAuthenticated = status === "authenticated";

  // Check for legacy local storage on mount
  useEffect(() => {
     if (typeof window !== 'undefined' && !isAuthenticated) {
        // Try legacy keys, prioritizing 'fool_user' (found in git history)
        const legacyName = localStorage.getItem('fool_user') || localStorage.getItem('username') || localStorage.getItem('user') || localStorage.getItem('name');
        
        if (legacyName) {
            checkLegacyUser(legacyName).then(res => {
                if (res.found && res.tempPassword) {
                    setRecoveryMsg({ name: legacyName, pass: res.tempPassword });
                    setUsername(legacyName);
                    setPassword(res.tempPassword); // Pre-fill for convenience
                    setIsExpanded(true); // Open the form
                }
            });
        }
     }
     // Run once on mount
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only on mount

  const checkUsername = async () => {
      if (!username) return;
      setError("");
      setLoading(true);
      
      try {
          const res = await checkClaimStatus(username);
          setLoading(false);

          if (res.status === "unclaimed") {
              setClaimStatus("unclaimed");
              setClaimUserId(res.userId!);
              setSuggestion({ name: res.name!, id: res.userId! });
          } else if (res.status === "fuzzy_match") {
              setClaimStatus("fuzzy");
              setSuggestion({ name: res.suggestion!, id: res.userId! });
          } else if (res.status === "taken") {
              setClaimStatus("taken");
              setError("Username is already taken.");
          } else {
              setClaimStatus("available");
          }
      } catch (e) {
          setError("Failed to check username");
          setLoading(false);
      }
  };

  const acceptSuggestion = () => {
      if (suggestion) {
          setUsername(suggestion.name);
          setClaimUserId(suggestion.id);
          setClaimStatus("unclaimed"); // Treat as unclaimed logic now
          setError("");
      }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let finalUserId = session?.user?.id;

      // Check username if not checked yet and trying to login/claim
      if (!isAuthenticated && claimStatus === "none") {
          await checkUsername();
          setLoading(false);
          return; // Let user see status
      }

      // Handle Authentication / Claiming is performed here
      if (!isAuthenticated) {
          if (!username || !password) {
            setError("Please provide username and password");
            setLoading(false);
            return;
          }

          // Case 1: Claiming Legacy Account (Exact or Fuzzy Accepted)
          if ((claimStatus === "unclaimed" || claimStatus === "fuzzy") && claimUserId) {
              const res = await claimAccount(claimUserId, password);
              if (res.error) {
                  setError(res.error);
                  setLoading(false);
                  return;
              }
              // Claim successful! Now login.
              // We need to login with the NEW password.
              const loginRes = await signIn("credentials", {
                  redirect: false,
                  username: suggestion?.name || username, // Use the correct name
                  password,
              });
              
              if (loginRes?.error) {
                  setError("Claim successful but login failed. Please try logging in.");
                  setLoading(false);
                  return;
              }
              window.location.reload(); 
              return;
          }

          // Case 2: Standard Login OR Registration
          // If available -> Register
          if (claimStatus === "available") {
             const formData = new FormData();
             formData.append("name", username);
             formData.append("email", `${Date.now()}@fool.local`); // Temp email since we focus on username
             formData.append("password", password);
             
             const regRes = await registerUser(formData);
             if (regRes.error) {
                 setError(regRes.error);
                 setLoading(false);
                 return;
             }
             
             // Now login
             const loginRes = await signIn("credentials", {
                  redirect: false,
                  username,
                  password,
              });
              if (loginRes?.error) {
                  setError("Login failed.");
                  setLoading(false);
                  return;
              }
              window.location.reload();
              return;
          }
          
          // Case 3: Taken - Just Try Login (maybe they are the owner)
          if (claimStatus === "taken") {
               const result = await signIn("credentials", {
                  redirect: false,
                  username,
                  password,
                });

                if (result?.error) {
                  setError("Invalid credentials or username taken.");
                  setLoading(false);
                  return;
                }
                window.location.reload();
                return;
          }
      }

      // If authenticated, post comment
      if (finalUserId && content.trim()) {
         const result = await addComment(articleId, content, parseInt(finalUserId));
         if (result.success) {
            setContent("");
            setIsExpanded(false);
            router.refresh(); 
         } else {
            setError("Failed to post comment.");
         }
      }

    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  if (isAuthenticated) {
    return (
      <form onSubmit={handleSubmit} className="space-y-4 bg-slate-900/40 p-6 rounded-xl border border-slate-800">
        <h3 className="text-sm font-medium text-slate-300">Leave a comment</h3>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your foolish wisdom..."
          className="w-full h-24 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 focus:ring-2 focus:ring-purple-400 focus:outline-none"
          required
        />
        <div className="flex justify-end gap-2">
           {error && <span className="text-red-400 text-sm self-center">{error}</span>}
           <Button type="submit" disabled={loading}>
             {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
             Post Comment
           </Button>
        </div>
      </form>
    );
  }

  // Guest View
  return (
    <div className="bg-slate-900/20 p-6 rounded-xl border border-dashed border-slate-800 text-center space-y-4">
      {!isExpanded ? (
         <div onClick={() => setIsExpanded(true)} className="cursor-pointer">
            <p className="text-slate-400 mb-2">Join the conversation</p>
            <Button variant="outline" type="button">Write a Comment</Button>
         </div>
      ) : (
        <form onSubmit={handleSubmit} className="text-left space-y-4 max-w-md mx-auto">
           <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-slate-300">
                  {claimStatus === "unclaimed" ? "Claim Legacy Account" : "Login or Join"}
              </h3>
              <button type="button" onClick={() => setIsExpanded(false)} className="text-xs text-slate-500 hover:text-white">Cancel</button>
           </div>
           
           {/* Legacy Recovery Auto-Detect Message */}
           {recoveryMsg && claimStatus === "none" && (
             <div className="bg-purple-500/10 border border-purple-500/30 p-3 rounded-lg text-sm text-center mb-4">
                <p className="text-purple-300 font-bold mb-1">Welcome back, {recoveryMsg.name}!</p>
                <p className="text-slate-300">Set a password to claim your legacy account.</p>
             </div>
           )}

           {/* Fuzzy Match Suggestion */}
           {claimStatus === "fuzzy" && suggestion && (
               <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-lg text-sm text-center mb-4">
                   <p className="text-yellow-200 mb-2">Did you mean <strong>{suggestion.name}</strong>?</p>
                   <Button type="button" size="sm" variant="outline" onClick={acceptSuggestion}>
                       Yes, that's me
                   </Button>
                   <p className="text-xs text-slate-500 mt-2">This looks like a legacy account similar to your name.</p>
               </div>
           )}
           
           <div className="space-y-3">
             <div className="flex gap-2">
                 <Input 
                    value={username} 
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setClaimStatus("none"); // Reset status on edit
                    }} 
                    onBlur={checkUsername} // Check on blur
                    placeholder="Username" 
                    required 
                    className={claimStatus === "taken" ? "border-red-500" : ""}
                 />
             </div>
             {claimStatus === "taken" && <p className="text-xs text-red-400">Username taken. Enter password to login.</p>}
             {claimStatus === "available" && <p className="text-xs text-green-400">Username available! Set a password to create account.</p>}
             {claimStatus === "unclaimed" && <p className="text-xs text-purple-400">Legacy account found! Set a password to claim it.</p>}

             <Input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder={claimStatus === "unclaimed" ? "Set New Password" : "Password"}
                required 
             />
             
            
           </div>

           {error && <div className="text-red-400 text-sm text-center">{error}</div>}

           <Button type="submit" disabled={loading} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {claimStatus === "unclaimed" || claimStatus === "fuzzy" ? "Claim & Post" : "Post Comment"}
           </Button>
        </form>
      )}
    </div>
  );
}
