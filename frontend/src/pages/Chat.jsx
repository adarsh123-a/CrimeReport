import React, { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"
import { ChatCircleText, PaperPlaneRight, Sparkle, ShieldCheck } from "@phosphor-icons/react";

function formatMarkdown(text) {
  if (!text) return "";
  let html = text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/```([\s\S]*?)```/g, (_, c) => `<pre class="bg-zinc-900 p-3 rounded text-xs font-mono overflow-x-auto text-blue-300 border border-zinc-800 my-2"><code>${c}</code></pre>`)
    .replace(/`([^`]+)`/g, "<code class='bg-zinc-800 text-blue-300 px-1 py-0.5 rounded text-xs font-mono'>$1</code>")
    .replace(/^### (.*)$/gm, "<h3 class='text-base font-bold text-white mt-3 mb-1'>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2 class='text-lg font-bold text-blue-400 mt-4 mb-2 border-b border-zinc-800 pb-1'>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1 class='text-xl font-bold text-white mt-4 mb-2'>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong class='font-bold text-blue-300'>$1</strong>")
    .replace(/^\s*[-*]\s+(.+)$/gm, "<li class='ml-4 list-disc text-zinc-300 my-1'>$1</li>")
    .replace(/(<li>[\s\S]*?<\/li>)/g, "<ul class='my-2 space-y-1'>$1</ul>")
    .replace(/\n{2,}/g, "</p><p class='my-2 text-zinc-300 leading-relaxed'>")
    .replace(/^(?!<h|<ul|<pre|<li|<p)(.+)$/gm, "<p class='my-1 text-zinc-300 leading-relaxed'>$1</p>");
  return html;
}

const SUGGESTIONS = [
  "Mera phone chori ho gaya market mein. Which dhara applies?",
  "Neighbour is threatening me daily on WhatsApp. What's the punishment?",
  "Someone hacked my UPI and withdrew ₹50,000. Which section?",
  "Landlord entered my house without permission. Legal remedy?",
];

export default function Chat() {
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  const send = async (text) => {
    const msg = (text ?? input).trim();
    if (!msg) return;
    const userLocal = { role: "user", content: msg, id: `l-${Date.now()}` };
    setMessages((m) => [...m, userLocal]);
    setInput("");
    setLoading(true);
    try {
      const r = await api.post("/chat/send", { session_id: sessionId, message: msg });
      setSessionId(r.data.session_id);
      setMessages((m) => [...m, { role: "assistant", content: r.data.reply, id: `a-${Date.now()}` }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", content: "Sorry, the assistant is unreachable. Please try again or check backend server.", id: `err-${Date.now()}` }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col font-sans">

      <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex-1 flex flex-col">
        <div className="mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-blue-400 flex items-center gap-1.5 mb-1">
            <Sparkle size={14} weight="fill" className="text-blue-400" /> AI Legal Assistant · Crime Report
          </div>
          <h1 className="font-extrabold tracking-tight text-3xl sm:text-4xl text-white">Crime Report AI Assistant</h1>
          <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
            Ask anything in English, Hindi, or Hinglish. Get friendly guidance, safety steps, and reporting support.
          </p>
        </div>

        <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl flex-1 flex flex-col overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6" data-testid="chat-messages">
            {messages.length === 0 && (
              <div className="text-center py-10 my-auto">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4 text-blue-400 shadow-inner">
                  <ChatCircleText size={36} weight="duotone" />
                </div>
                <h3 className="font-bold text-xl text-white mb-2">Talk to Crime Report</h3>
                <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
                  Try asking a question in Hindi or English:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl mx-auto text-left">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => send(s)}
                      data-testid={`chat-suggestion-${i}`}
                      className="group text-left text-xs sm:text-sm bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-xl hover:border-blue-500/60 hover:bg-blue-950/20 text-zinc-300 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        <Sparkle size={14} weight="fill" className="text-blue-400 mt-0.5 shrink-0 group-hover:scale-110 transition-transform" />
                        <span>{s}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`} data-testid={`chat-msg-${m.role}`}>
                <div className={`max-w-[88%] sm:max-w-[80%] p-4 rounded-2xl ${m.role === "user" ? "bg-blue-600 text-white rounded-br-none shadow-md" : "bg-zinc-950 border border-zinc-800 rounded-bl-none shadow-md"}`}>
                  {m.role === "user" ? (
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</div>
                  ) : (
                    <div className="prose-chat text-sm" dangerouslySetInnerHTML={{ __html: formatMarkdown(m.content) }} />
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start" data-testid="chat-loading">
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl rounded-bl-none flex items-center gap-3 text-sm text-zinc-400 shadow-md">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
                  <span>Crime Report is thinking…</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-zinc-800 bg-zinc-950/90 p-4">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-end gap-2"
              data-testid="chat-form"
            >
              <Textarea
                data-testid="chat-input"
                rows={2}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                placeholder="Describe the incident..."
                className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-500 focus-visible:ring-blue-500 resize-none rounded-xl"
              />
              <Button type="submit" data-testid="chat-send-btn" disabled={loading || !input.trim()} className="bg-blue-600 hover:bg-blue-500 h-[52px] px-5 rounded-xl shrink-0">
                <PaperPlaneRight size={20} weight="bold" />
              </Button>
            </form>
            <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-2.5 justify-between">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} className="text-blue-400" /> AI-Powered Legal Assistant
              </span>
              <span>Not legal advice. Consult a licensed advocate.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
