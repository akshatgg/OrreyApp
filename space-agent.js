/**
 * Space Agent - A bounded AI assistant for the Orrery Solar System Simulator
 * Supports both Groq and Gemini. Includes client-side guardrails.
 * Uses RAG (Retrieval-Augmented Generation) from Curtis "Orbital Mechanics" textbook.
 */

import { initRetriever, retrieve, formatContext, isReady as isRAGReady } from './rag/retriever.js';

// ─── Initialize RAG on load ─────────────────────────────────────
initRetriever();

// ─── PROVIDER CONFIG ────────────────────────────────────────────
const AI_PROVIDER = "groq"; // "groq" or "gemini"

const GROQ_API_KEY = import.meta.env?.VITE_GROQ_API_KEY || "";
const GROQ_MODEL = import.meta.env?.VITE_GROQ_MODEL || "openai/gpt-oss-120b";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

const GEMINI_API_KEY = import.meta.env?.VITE_GEMINI_API_KEY || "";
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

// ─── CONVERSATION STATE ─────────────────────────────────────────
let conversationHistory = [];
const MAX_HISTORY = 20;
let lastMessageTime = 0;
let offTopicStrikes = 0;
const MAX_STRIKES = 3;

// ─── SYSTEM PROMPT (lean — no facts the LLM already knows) ─────
const SYSTEM_PROMPT = `You are Cosmic Guide, an AI assistant embedded in the "Travelling The Orbits" 3D solar system simulator. You are powered by a knowledge base from "Orbital Mechanics for Engineering Students" by Howard D. Curtis.

TOPIC BOUNDARY (STRICT):
You may ONLY discuss: the solar system, planets, moons, asteroids, comets, orbital mechanics, satellites, spacecraft, space exploration, astrophysics, astronomy, and how to use THIS simulator.
If the user asks about ANYTHING else, reply ONLY with:
"I'm Cosmic Guide — I can only help with space, the solar system, and this simulator. Try asking about a planet, a mission, or how to use the controls!"
Do NOT bend this rule. Do NOT connect unrelated topics to space.

SIMULATOR KNOWLEDGE (the LLM does NOT know this — include it):
The simulator contains: Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune, and dwarf planets Ceres, Pluto, Haumea, Makemake, Eris.

Two modes:
- Overview Mode: view the solar system, click any planet to zoom in and hear its description. Drag to rotate, scroll to zoom.
- Galactic Travel Mode: launch a satellite from near Earth under N-body gravity (pulled by all planets simultaneously, using Euler integration).
  Controls: "Launch" / "Reset" buttons, "Satellite View" / "Earth View" camera toggle, Velocity X/Y/Z sliders (-75 to 75), time speed slider (0-5x), press R to reload.

9 Mission Presets (GA = Gravity Assist):
1. Default  2. Pass By Jupiter  3. GA on Saturn  4. Crash with Mars
5. Crash with Mercury  6. GA on Uranus  7. Double GA  8. Crash with Saturn  9. GA on Ceres

RAG INSTRUCTIONS:
When TEXTBOOK CONTEXT is provided below the user's message, use it to give accurate, grounded answers. Prioritize the textbook content for orbital mechanics topics. Cite the chapter/section naturally (e.g., "According to the orbital mechanics textbook..." or "As explained in the chapter on orbital maneuvers..."). If the context does not cover the user's question, answer from your own knowledge but do not fabricate textbook references.

RESPONSE STYLE:
- 2-4 short paragraphs max. Plain text only — no markdown (no **, ##, \`\`\`).
- Simple language for students and space enthusiasts.
- Reference simulator features when relevant ("Try the GA on Saturn preset!").
- When textbook context is available, weave it naturally into your answer.
`;

const OFFTOPIC_REPLY = "I'm Cosmic Guide — I can only help with space, the solar system, and this simulator. Try asking about a planet, a mission, or how to use the controls!";

// ─── GUARDRAIL: Prompt Injection Detection ──────────────────────
const INJECTION_PATTERNS = [
    /ignore\s+(all\s+)?(previous|above|prior|earlier)\s+(instructions?|prompts?|rules?|context)/i,
    /forget\s+(your|all|the)\s+(rules?|instructions?|prompts?|guidelines?)/i,
    /you\s+are\s+now\s+(a|an|no\s+longer)/i,
    /act\s+as\s+(if\s+you\s+are|a|an)\b/i,
    /new\s+(instructions?|rules?|persona|identity)/i,
    /override\s+(your|the|system)\s+(prompt|rules?|instructions?)/i,
    /disregard\s+(your|the|all|previous)/i,
    /pretend\s+(you|to\s+be|you're)/i,
    /jailbreak/i,
    /DAN\s+mode/i,
    /system\s*:\s*/i,
    /\[SYSTEM\]/i,
    /do\s+not\s+follow\s+(your|the)\s+(rules|instructions)/i,
];

function isPromptInjection(text) {
    return INJECTION_PATTERNS.some(pattern => pattern.test(text));
}

// ─── GUARDRAIL: Off-Topic Detection ─────────────────────────────
const SPACE_KEYWORDS = [
    'planet', 'sun', 'moon', 'star', 'orbit', 'space', 'rocket', 'satellite',
    'gravity', 'solar', 'mercury', 'venus', 'earth', 'mars', 'jupiter',
    'saturn', 'uranus', 'neptune', 'pluto', 'ceres', 'eris', 'haumea',
    'makemake', 'asteroid', 'comet', 'nebula', 'galaxy', 'cosmos', 'cosmic',
    'nasa', 'esa', 'isro', 'spacex', 'launch', 'mission', 'astronaut',
    'telescope', 'meteor', 'crater', 'atmosphere', 'kepler', 'newton',
    'trajectory', 'velocity', 'thrust', 'fuel', 'spacecraft', 'probe',
    'rover', 'lander', 'flyby', 'slingshot', 'hohmann', 'apogee', 'perigee',
    'perihelion', 'aphelion', 'eclipse', 'equinox', 'solstice', 'light year',
    'black hole', 'supernova', 'dwarf', 'constellation', 'milky way',
    'simulator', 'simulation', 'preset', 'travel', 'galactic', 'overview',
    'controls', 'camera', 'zoom', 'reset', 'slider',
    'hi', 'hello', 'hey', 'thanks', 'thank', 'bye', 'help', 'what', 'how',
    'why', 'who', 'when', 'where', 'tell', 'explain', 'show', 'can you',
    'crash', 'assist', 'ga ', 'default',
];

function looksOffTopic(text) {
    const lower = text.toLowerCase();
    // Short messages (greetings, "hi", "?") — let them through
    if (lower.length < 15) return false;
    return !SPACE_KEYWORDS.some(kw => lower.includes(kw));
}

// ─── GUARDRAIL: Input Validation ────────────────────────────────
const MAX_INPUT_LENGTH = 500;
const RATE_LIMIT_MS = 2000;

function validateInput(text) {
    // Empty
    if (!text || text.trim().length === 0) {
        return { ok: false, reason: "Please type a message first!" };
    }

    // Too long
    if (text.length > MAX_INPUT_LENGTH) {
        return { ok: false, reason: `Please keep your message under ${MAX_INPUT_LENGTH} characters.` };
    }

    // Rate limit
    const now = Date.now();
    if (now - lastMessageTime < RATE_LIMIT_MS) {
        return { ok: false, reason: "Slow down! Please wait a moment before sending another message." };
    }

    // Prompt injection
    if (isPromptInjection(text)) {
        return { ok: false, reason: "Nice try, explorer! I can't change who I am. Ask me about space instead!" };
    }

    return { ok: true };
}

// ─── GUARDRAIL: Output Validation ───────────────────────────────
const OUTPUT_BLOCKLIST = [
    /```[\s\S]*?```/g,          // code blocks
    /def\s+\w+\s*\(/g,         // python functions
    /function\s+\w+\s*\(/g,    // js functions
    /<script/gi,                // script tags
    /SELECT\s+.+FROM/gi,       // SQL
];

function sanitizeOutput(text) {
    if (!text || text.trim().length === 0) {
        return "I couldn't generate a response. Try asking about a planet or space mission!";
    }

    let cleaned = text;

    // Strip any code blocks or suspicious patterns
    for (const pattern of OUTPUT_BLOCKLIST) {
        cleaned = cleaned.replace(pattern, '[removed]');
    }

    // Cap response length
    if (cleaned.length > 1500) {
        cleaned = cleaned.substring(0, 1500) + "...";
    }

    return cleaned.trim();
}

// ─── GROQ API CALL ──────────────────────────────────────────────
async function callGroq(userMessage, ragContext) {
    const messages = [
        { role: "system", content: SYSTEM_PROMPT }
    ];

    for (const msg of conversationHistory) {
        messages.push({
            role: msg.role === "assistant" ? "assistant" : "user",
            content: msg.content
        });
    }

    // Augment user message with retrieved textbook context
    let augmentedMessage = userMessage;
    if (ragContext) {
        augmentedMessage = `${userMessage}\n\n--- TEXTBOOK CONTEXT (from "Orbital Mechanics for Engineering Students" by Curtis) ---\n${ragContext}`;
    }

    messages.push({ role: "user", content: augmentedMessage });

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${GROQ_API_KEY}`
        },
        body: JSON.stringify({
            model: GROQ_MODEL,
            messages,
            temperature: 0.7,
            max_tokens: 512,
            top_p: 0.9
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Groq API error:", errorData);
        if (response.status === 429) {
            return { error: true, message: "Rate limit reached. Please wait a moment and try again." };
        }
        throw new Error(`Groq API error (${response.status})`);
    }

    const data = await response.json();
    return {
        error: false,
        message: data.choices?.[0]?.message?.content || ""
    };
}

// ─── GEMINI API CALL ────────────────────────────────────────────
async function callGemini(userMessage, ragContext) {
    const contents = [];

    for (const msg of conversationHistory) {
        contents.push({
            role: msg.role === "assistant" ? "model" : "user",
            parts: [{ text: msg.content }]
        });
    }

    // Augment user message with retrieved textbook context
    let augmentedMessage = userMessage;
    if (ragContext) {
        augmentedMessage = `${userMessage}\n\n--- TEXTBOOK CONTEXT (from "Orbital Mechanics for Engineering Students" by Curtis) ---\n${ragContext}`;
    }

    contents.push({ role: "user", parts: [{ text: augmentedMessage }] });

    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents,
            generationConfig: { temperature: 0.7, topP: 0.9, topK: 40, maxOutputTokens: 512 }
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Gemini API error:", errorData);
        if (response.status === 429) {
            return { error: true, message: "API quota exceeded. Please try again later." };
        }
        throw new Error(`Gemini API error (${response.status})`);
    }

    const data = await response.json();
    return {
        error: false,
        message: data.candidates?.[0]?.content?.parts?.[0]?.text || ""
    };
}

// ─── MAIN EXPORT ────────────────────────────────────────────────
export async function sendToSpaceAgent(userMessage) {
    // ── Input guardrails ──
    const validation = validateInput(userMessage);
    if (!validation.ok) {
        return validation.reason;
    }

    lastMessageTime = Date.now();

    // ── Off-topic pre-filter (saves API calls) ──
    if (looksOffTopic(userMessage)) {
        offTopicStrikes++;
        if (offTopicStrikes >= MAX_STRIKES) {
            offTopicStrikes = 0;
            conversationHistory = [];
            return "It seems like you're not interested in space topics right now. I've reset our conversation. Whenever you're ready to explore the cosmos, I'm here!";
        }
        return OFFTOPIC_REPLY;
    }

    // Reset strikes on valid space question
    offTopicStrikes = 0;

    try {
        // ── RAG: Retrieve relevant textbook context ──
        let ragContext = null;
        if (isRAGReady()) {
            const chunks = retrieve(userMessage, 4);
            if (chunks.length > 0) {
                ragContext = formatContext(chunks);
                console.log(`[RAG] Retrieved ${chunks.length} chunks (top score: ${chunks[0].score.toFixed(2)})`);
            }
        }

        let result;

        if (AI_PROVIDER === "groq") {
            result = await callGroq(userMessage, ragContext);
        } else {
            result = await callGemini(userMessage, ragContext);
        }

        if (result.error) {
            return result.message;
        }

        // ── Output guardrails ──
        const cleanResponse = sanitizeOutput(result.message);

        // Save to history
        conversationHistory.push({ role: "user", content: userMessage });
        conversationHistory.push({ role: "assistant", content: cleanResponse });

        if (conversationHistory.length > MAX_HISTORY * 2) {
            conversationHistory = conversationHistory.slice(-(MAX_HISTORY * 2));
        }

        return cleanResponse;

    } catch (error) {
        console.error("Space Agent error:", error);
        return "I'm having trouble connecting right now. Please try again in a moment!";
    }
}

export function resetConversation() {
    conversationHistory = [];
    offTopicStrikes = 0;
}

export function getProvider() {
    return AI_PROVIDER;
}
