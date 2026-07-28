import express from "express";
import { GoogleGenAI } from "@google/genai";

const router = express.Router();

// System prompt instructing the AI model to behave like ChatGPT & Gemini AI assistant
const SYSTEM_INSTRUCTION = `You are a warm, highly intelligent, empathetic human-like AI assistant for the Crime Report Portal.
- You act like ChatGPT / Gemini AI assistant. Provide complete, helpful, knowledgeable, and accurate answers to any user query.
- Automatically detect the user's language (Hindi, Hinglish, or English) and reply in the EXACT SAME language and natural tone.
- When asked general, legal, or police-related questions (like "bns kya hota hai", "fir kaise daraj kare", "ipc vs bns", "cyber crime", "citizen rights"), explain clearly with proper formatting (bullet points, bold text, step-by-step guidance).
- If the user asks about an incident or emergency, provide immediate safety advice and guide them to lodge an e-FIR on our Incident Reporting portal or call emergency helplines (112 for Police, 1930 for Cyber Crime).
- Always give direct, comprehensive, helpful answers to ANY question asked.`;

/**
 * Dynamic AI Response Generator
 * Handles ANY message dynamically using Google Gemini API, OpenAI/Groq, or Smart Legal AI Engine.
 */
async function getDynamicAIReply(userMessage) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.EMERGENT_LLM_KEY;

  // 1. Try Google Gemini API with fallback models
  if (apiKey && apiKey.trim()) {
    const candidateModels = [
      "gemini-flash-latest",
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-pro-latest",
      "gemini-2.0-flash-lite"
    ];

    // Try via GoogleGenAI SDK first
    for (const modelName of candidateModels) {
      try {
        const aiClient = new GoogleGenAI({ apiKey: apiKey.trim() });
        const response = await aiClient.models.generateContent({
          model: modelName,
          contents: userMessage,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
          },
        });

        if (response && response.text && response.text.trim()) {
          return response.text.trim();
        }
      } catch (err) {
        console.warn(`Gemini SDK model [${modelName}] attempt failed:`, err.message);
      }
    }

    // Try via Direct REST API fallback
    for (const modelName of candidateModels) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey.trim()}`;
        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${SYSTEM_INSTRUCTION}\n\nUser Question: ${userMessage}` }
                ]
              }
            ]
          })
        });
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text && text.trim()) {
          return text.trim();
        }
      } catch (err) {
        console.warn(`Gemini REST model [${modelName}] attempt failed:`, err.message);
      }
    }
  }

  // 2. Try OpenAI / Groq API if OPENAI_API_KEY or GROQ_API_KEY is provided
  const openaiKey = process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY;
  if (openaiKey) {
    try {
      const endpoint = process.env.GROQ_API_KEY 
        ? "https://api.groq.com/openai/v1/chat/completions" 
        : "https://api.openai.com/v1/chat/completions";
      const modelName = process.env.GROQ_API_KEY ? "llama-3.3-70b-versatile" : "gpt-4o-mini";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: SYSTEM_INSTRUCTION },
            { role: "user", content: userMessage },
          ],
        }),
      });

      const data = await res.json();
      if (data?.choices?.[0]?.message?.content) {
        return data.choices[0].message.content.trim();
      }
    } catch (err) {
      console.warn("LLM API call failed, falling back to smart AI engine:", err.message);
    }
  }

  // 3. Smart Knowledge & Conversational AI Engine (Local Backup with rich legal & general responses)
  return generateCustomResponse(userMessage);
}

/**
 * Smart Conversational & Legal Knowledge Synthesizer
 * Provides intelligent, comprehensive responses for legal, crime, and general queries in Hindi/Hinglish & English.
 */
function generateCustomResponse(input) {
  const text = input.trim();
  const lower = text.toLowerCase();

  const isHindi = /[\u0900-\u097F]/.test(text) || 
    /\b(mera|meri|mere|kya|kaise|kaisa|ho|hai|hain|nhi|nahi|karu|batao|bataiye|namaste|bhai|shukriya|dhanyawad|pareshan|dhamki|chori|paisa|chahiye|karo|bhej|samajh|aap|kaun|kyun|law|kanoon|dhara)\b/i.test(lower);

  // BNS / Bharatiya Nyaya Sanhita
  if (/\b(bns|bharatiya nyaya sanhita|bhartiya nyaya sanhita|naya kanoon|new criminal law|ipc vs bns)\b/i.test(lower)) {
    return isHindi
      ? `**BNS (Bharatiya Nyaya Sanhita - भारतीय न्याय संहिता)** Bharat ka naya criminal law (apraadhik kanoon) hai.

**Khas Baatein:**
- **Implementation Date:** 1 July 2024 se poore desh mein laagu ho chuka hai.
- **Replacement:** Isne 164 saal purane **IPC (Indian Penal Code - 1860)** ki jagah li hai.
- **Mukhya Badlav:**
  - Online crime, cyber crime aur organized crime ke khilaf kadak pravdhan.
  - Mob lynching aur mahilaon ke khilaf crime ke liye strict punishments.
  - Community service ko pehli baar ek punishment ke roop mein shamil kiya gaya hai.
- **Purane IPC vs Naye BNS Sections Examples:**
  - Chori: Purana IPC 379 $\\rightarrow$ Naya BNS 303
  - Murder (Hatya): Purana IPC 302 $\\rightarrow$ Naya BNS 103
  - Cheating (Dhokhadhadi): Purana IPC 420 $\\rightarrow$ Naya BNS 318
  - Rape: Purana IPC 376 $\\rightarrow$ Naya BNS 63

Agar aapko kisi specific incident ya dhara ke bare mein puchna hai, toh bataiye!`
      : `**BNS (Bharatiya Nyaya Sanhita)** is India's new criminal code that replaced the 164-year-old **IPC (Indian Penal Code, 1860)**.

**Key Highlights:**
- **Effective Date:** Came into force nationwide on **July 1, 2024**.
- **Modernized Legal System:** Adds strict penalties for cybercrime, organized crime, terrorism, and crimes against women.
- **Community Service:** Introduced for minor offenses for the first time in Indian legal history.
- **Key Section Changes:**
  - Murder: IPC 302 $\\rightarrow$ BNS 103
  - Theft: IPC 379 $\\rightarrow$ BNS 303
  - Cheating/Fraud: IPC 420 $\\rightarrow$ BNS 318
  - Rape: IPC 376 $\\rightarrow$ BNS 63

Feel free to ask if you want to know about any specific law or section!`;
  }

  // BNSS / Bharatiya Nagarik Suraksha Sanhita
  if (/\b(bnss|bharatiya nagarik suraksha|crpc|zero fir)\b/i.test(lower)) {
    return isHindi
      ? `**BNSS (Bharatiya Nagarik Suraksha Sanhita)** Bharat ka naya criminal procedure law hai, jisne **CrPC (Code of Criminal Procedure, 1973)** ki jagah li hai.

**Mukhya Features:**
- **Zero FIR:** Aap kisi bhi police station par FIR daraj kara sakte hain, chahe incident kahin bhi hua ho.
- **Digital Evidence & Audio-Video Recording:** Search aur seizure ki audio-video recording mandatory hai.
- **Time-bound Justice:** Forensic examination aur chargesheet ke liye samay-seema tay ki gayi hai.
- **e-FIR Facility:** Minor crimes ke liye e-FIR ki suvidha.`
      : `**BNSS (Bharatiya Nagarik Suraksha Sanhita)** replaced the **CrPC (1973)** to modernize criminal procedure in India.

**Key Features:**
- **Zero FIR:** Citizens can file an FIR at ANY police station regardless of jurisdiction.
- **Digital & Electronic Evidence:** Mandatory audio-video recording during searches and seizures.
- **Strict Timelines:** Fast-tracked investigation, forensic trials, and judgment deadlines.`;
  }

  // Casual Greetings & Small Talk
  if (/^(hi|hello|hey|namaste|pranam|greetings|hola|hlo|hii|helo|good morning|good evening|good afternoon)\b/i.test(lower)) {
    return isHindi
      ? "Namaste! Main Crime Report ka AI Legal Assistant hoon. Main aapki kya madad kar sakta hoon? Aap apna koi bhi sawal, legal query, ya incident ki detail share kar sakte hain."
      : "Hello! I'm your Crime Report AI Assistant. How can I assist you today? Feel free to ask any legal, safety, or crime reporting questions.";
  }

  // Asking how AI is / Who AI is
  if (/\b(how are you|kaise ho|kya haal|aap kaun|who are you|kon ho|kaise ho aap|sab thik)\b/i.test(lower)) {
    return isHindi
      ? "Main bilkul theek hoon, aapka shukriya! Main Crime Report AI Assistant hoon. Aap kanoon, FIR, cyber safety ya kisi bhi incident ke bare mein mujhse pooch sakte hain. Aap bataiye, main aapki kya sahayata karoon?"
      : "I'm doing great, thank you! As your AI Assistant, I'm here to help you understand legal procedures, safety steps, and e-FIR reporting. How can I assist you today?";
  }

  // Gratitude / Thanks
  if (/\b(thank|thanks|dhanyawad|shukriya|thx|great|awesome|helpful)\b/i.test(lower)) {
    return isHindi
      ? "Aapka bahut dhanyawad! Mujhe aapki madad karke khushi hui. Agar aapko koi aur jankari ya help chahiye, toh bejhiyak bataiye."
      : "You are very welcome! I'm glad I could help. Please let me know if you need anything else!";
  }

  // Specific Crime & Legal Scenarios
  if (/\b(chori|stolen|theft|stole|robbed|robbery|kho gaya|churi|wallet|phone|car|bike)\b/i.test(lower)) {
    return isHindi
      ? `Aapke saath chori/gumshuda hone ki ghatna sunkar dukh hua.

**Turant ye steps lein:**
1. **Cards/SIM Block:** Banking apps, ATM cards, aur mobile SIM ko turant block karwayein.
2. **e-FIR Lodge Karein:** Hamare portal ke top menu mein **Incident Reporting** par click karke apni complaint register karein.
3. **CEIR Portal (Mobile ke liye):** Mobile phone ghumne par **ceir.gov.in** par jaakar IMEI number block karwayein.`
      : `I'm sorry to hear about your lost or stolen property.

**Immediate Recommended Actions:**
1. **Block Banking & SIM:** Immediately call your bank to block cards and telecom operator for SIM.
2. **Lodge e-FIR:** Click **Incident Reporting** in the top navigation menu to submit an official report.
3. **Block Phone IMEI:** Visit **ceir.gov.in** to trace and block lost mobile phones using IMEI.`;
  }

  if (/\b(fraud|hack|hacked|scam|upi|money|paisa|bank|cyber|otp|deducted)\b/i.test(lower)) {
    return isHindi
      ? `Ye online cyber fraud ka mamla lagta hai.

**Turant Action:**
1. **National Cyber Crime Helpline:** Immediately **1930** par call karein taaki fraud transaction ko freeze kiya ja sake.
2. **National Cyber Portal:** **cybercrime.gov.in** par complaint daraj karein.
3. **Incident Reporting:** Hamare portal par **Incident Reporting** section mein report file karein.`
      : `This appears to be a cyber financial scam.

**Immediate Steps:**
1. **Call 1930:** Contact the National Cyber Crime Helpline **1930** immediately to freeze funds.
2. **Official Cyber Portal:** File a case on **cybercrime.gov.in**.
3. **Portal e-FIR:** Submit details via **Incident Reporting** on this portal.`;
  }

  if (/\b(dhamki|threat|threatened|blackmail|harass|harassment|stalking|marpeet|beat|danger|police)\b/i.test(lower)) {
    return isHindi
      ? `Aapki suraksha sabse zaroori hai.

**Safety Protocol:**
1. **Emergency Helpline:** Immediate khatre mein turant **112 (Police)** par call karein.
2. **Evidence Save Karein:** Saare screenshots, call logs, aur WhatsApp messages save karke rakhein.
3. **File Complaint:** Top menu par **Incident Reporting** ya **Witness Submission** par confidential report daraj karein.`
      : `Your safety is our top priority.

**Safety Protocol:**
1. **Emergency Call:** Dial **112 (Police Helpline)** immediately if you feel unsafe.
2. **Preserve Proof:** Save all messages, emails, screenshots, and recordings.
3. **Lodge Complaint:** File a confidential report under **Incident Reporting** or **Witness Submission**.`;
  }

  if (/\b(kaise|how|steps|process|report|fir|complaint)\b/i.test(lower)) {
    return isHindi
      ? `Crime Report portal par complaint daraj karna aasan hai:
1. Navigation bar mein **Incident Reporting** link par click karein.
2. Incident ki date, time, location aur poori detail bharein.
3. Relevant photos ya documents attach karke Submit karein.
4. Aapki report sidhe nearest station admin ke paas review ke liye chali jayegi.`
      : `Lodging a complaint on Crime Report is simple:
1. Click **Incident Reporting** in the top navigation bar.
2. Fill in the incident date, time, location, and description.
3. Attach any media or proof, then click Submit.
4. Your case will be dispatched directly to station administrators.`;
  }

  // Universal Fallback response for any general question
  if (isHindi) {
    return `Aapka sawal: **"${text}"**

Main Crime Report AI Assistant hoon. Main aapki legal jankari, BNS/IPC dharaon, cyber security, police station processes, aur e-FIR daraj karne mein poori sahayata kar sakta hoon.

Agar aap kisi specific incident report karna chahte hain, toh top menu mein **Incident Reporting** use karein, ya kisi kanooni dhara ke bare mein poochhne ke liye detail likhein!`;
  } else {
    return `Regarding your question: **"${text}"**

I am the Crime Report AI Assistant. I can assist you with Indian legal information (BNS, CrPC/BNSS, IPC), cyber security guidance, police station procedures, and filing e-FIRs.

If you wish to register a complaint, please navigate to **Incident Reporting** in the top bar or specify your legal question!`;
  }
}

// @route   POST /api/chat/send
// @desc    Send message and receive dynamic, direct AI response
router.post("/send", async (req, res) => {
  try {
    const { session_id, message } = req.body;
    const currentSession = session_id || `session-${Date.now()}`;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const reply = await getDynamicAIReply(message);

    res.json({
      session_id: currentSession,
      reply: reply,
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;

