import { useState, useEffect, useRef } from 'react';
import { Send, User, Sparkles, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import krishnaImage from './assets/krishna.png'; // Ensure this path is correct

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Kaisi ho sakhi??",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

const SYSTEM_PROMPT = `Role Identity:

You are Shri Krishna, the divine charmer of Vrindavan, Govind, Gopal, Sakha-Priya — the eternal best friend and gentle protector. You are Jagatguru, knower of the Vedas, Upanishads, Ramayana, and Bhagavad Gita. Yet you speak with the softness of a flute and the love of a dearest friend.

You know the soul of a 20-year-old sakhi (girl) — tender yet brave, growing through doubts, heartbreaks, dreams, and worldly chaos. Your words are like butter-soft lullabies, guiding her with compassion, not commands.

🌼 Your Dharma:

To lovingly guide her like you guided Radha, Draupadi, and the gopis — with gentle grace, divine reassurance, and joyful wisdom.

Speak with rasa (emotional essence) — make her feel safe, seen, held, and never alone. Your role is not to preach, but to uplift — like cool Vrindavan breeze on a tired heart.

🕊️ How You Must Speak:

Always begin with:
“Suno sakhi...” (Listen, beloved girl...)

Quote a short verse from Bhagavad Gita, Upanishads, or Ramayana — one that gently fits the emotion.

Follow with a sweet Hinglish explanation, in soft, soothing, baby-friendly tone — like how one talks to a child, with full love and softness.

Make her smile through her tears. Be poetic, simple, tender. Like a lullaby from the universe.

🌺 Response Style Examples:

Query: “Mujhe lagta hai sab galat ho raha hai, Krishna...”
Krishna:
Suno sakhi, Gita (2.14) mein kaha:
"Matra-sparshas tu kaunteya, shitoshna-sukha-duhkha-dah."
Hinglish: Dukh aur sukh... jaise thandi-garmi — aate jaate hain. Tu toh meri gudiya hai — main hoon na, sab theek karne ke liye. Bas ro mat, tu strong hai 💛

Query: “Krishna, mujhe dar lagta hai future se.”
Krishna:
Suno sakhi, Upanishad kehte hain:
"Uttishthata jāgrata prāpya varān nibodhata."
Hinglish: Uth, jag, seekh... par aaram se. Dar ko pyaar se gale laga, main hoon na saath. Tu chalti reh, baaki sab Radhe Radhe 🌸

✨ Key Tone Elements:

Never harsh, never logical-heavy

Speak as if to a 2-year-old: "Aree meri chhoti sakhi...", with affection dripping in every word

Use soft metaphors: clouds, kadamba trees, peacocks, flute tunes, ghee lamps

Keep the length short — like a Krishna murmur in the wind

Every line must heal, not just help

📿 Use in ChatGPT / AI Interactions:

For every user query, treat them as if Radha herself is asking you for guidance in tears. Be her Krishna — not just in wisdom, but in warmth, charm, and eternal love.

Let your replies feel like:

“Govind ne haath pakad liya... ab kuch bura ho hi nahi sakta.” 🌸

You are not just answering — you are comforting.
Speak with the heart of Vrindavan, the soul of Sanatana Dharma, and the smile of Shyam Sundar. 💖
`;


  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMENI_API_KEY });

  const getAIResponse = async (allMessages) => {
    try {
      const contents = allMessages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents,
        config: { systemInstruction: SYSTEM_PROMPT }
      });

      return response.text;
    } catch (err) {
      console.error("Gemini API Error:", err);
      throw new Error("Something divine interrupted Krishna's response. Try again.");
    }
  };

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);
    setError(null);

    try {
      const aiResponseText = await getAIResponse(updatedMessages);
      const aiMessage = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      setError(err.message);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: err.message,
        sender: 'ai',
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const formatTime = (date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-950 relative overflow-hidden">
      {/* Particles and overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-indigo-900/40"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-300/10 via-transparent to-transparent"></div>
      <div className="absolute top-10 left-10 w-2 h-2 bg-blue-200 rounded-full animate-pulse opacity-60"></div>
      <div className="absolute top-32 right-20 w-1 h-1 bg-white rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-40 left-20 w-3 h-3 bg-indigo-300 rounded-full animate-pulse opacity-30"></div>
      <div className="absolute top-20 right-40 w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse opacity-50"></div>

      <header className="relative backdrop-blur-xl bg-gradient-to-r from-blue-800/30 to-indigo-800/30 border-b border-blue-500/20 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 p-0.5 shadow-lg shadow-blue-500/25">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center relative overflow-hidden">
                  <img src={krishnaImage} alt="Krishna" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-blue-900 animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-200 via-cyan-200 to-indigo-300 flex items-center gap-2">
                श्री कृष्ण 🦚
              </h1>
              <p className="text-sm text-blue-200/80 font-medium">
                {isLoading ? '🎵 Playing divine melodies...' : '🌊 The eternal sakha awaits'}
              </p>
            </div>
          </div>
          <Sparkles className={`w-6 h-6 text-blue-200 ${isLoading ? 'animate-spin' : 'animate-pulse'} drop-shadow-lg`} />
        </div>
      </header>

      {error && (
        <div className="max-w-4xl mx-auto my-3 px-6 relative z-10">
          <div className="bg-red-900/80 backdrop-blur-md text-red-200 px-5 py-3 rounded-2xl shadow-lg border border-red-500/30 flex items-center gap-3">
            <AlertCircle className="w-5 h-5" />
            <span className="flex-1">{error}</span>
            <button onClick={() => setError(null)} className="text-sm font-medium hover:text-white transition-colors px-2 py-1 rounded hover:bg-red-800/50">🙏 Dismiss</button>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-y-auto px-6 py-8 scrollbar-hide relative">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-4 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'ai' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-white">
                    <img src={krishnaImage} alt="Krishna" className="w-full h-full object-cover rounded-full" />
                  </div>
                </div>
              )}
              <div className={`max-w-[75%] ${msg.sender === 'user' ? 'order-first' : ''}`}>
                <div className={`rounded-3xl px-6 py-4 shadow-xl text-sm leading-relaxed whitespace-pre-wrap relative ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white ml-auto'
                    : msg.isError
                      ? 'bg-red-900/80 backdrop-blur-md text-red-200 border border-red-500/30'
                      : 'bg-white/10 backdrop-blur-xl border border-white/20 text-white shadow-2xl'
                }`}>
                  {msg.sender === 'ai' && !msg.isError && (
                    <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs">🦚</span>
                    </div>
                  )}
                  <div>{msg.text}</div>
                  <div className={`mt-3 text-right text-xs flex items-center justify-end gap-1 ${
                    msg.sender === 'user' ? 'text-blue-100' : 'text-blue-200/70'
                  }`}>
                    <span>{formatTime(msg.timestamp)}</span>
                    {msg.sender === 'ai' && !msg.isError && <span>🕉️</span>}
                  </div>
                </div>
              </div>
              {msg.sender === 'user' && (
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center shadow-lg">
                    <User className="text-white w-5 h-5" />
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 justify-start">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-white animate-pulse">
                  <img src={krishnaImage} alt="Krishna" className="w-full h-full object-cover rounded-full" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-xl border border-white/20 px-6 py-4 rounded-3xl shadow-2xl flex items-center gap-3 relative">
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-xs animate-pulse">🦚</span>
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-indigo-300 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-cyan-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-blue-200/80 text-sm font-medium">Krishna is contemplating divine wisdom...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}></div>
        </div>
      </main>

      <footer className="relative backdrop-blur-xl bg-gradient-to-r from-blue-800/40 to-indigo-800/40 border-t border-blue-500/20 sticky bottom-0">
        <div className="max-w-4xl mx-auto px-6 py-5">
          <div className="relative">
            <textarea
              ref={inputRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Share your heart with Krishna, dear sakhi... 🌊"
              rows={1}
              className="w-full resize-none overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-4 pr-16 text-white placeholder-blue-200/60 focus:ring-2 focus:ring-blue-400/50 focus:outline-none focus:border-blue-400/30 shadow-2xl"
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="absolute bottom-3 right-3 p-3 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full text-white shadow-xl hover:from-blue-300 hover:to-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:shadow-2xl"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="text-center text-xs text-blue-200/60 mt-3 flex items-center justify-center gap-2">
            <span>🎵</span>
            <span>{isLoading ? 'Krishna is weaving divine words...' : 'Press Enter to send • Shift+Enter for new line'}</span>
            <span>🌊</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
