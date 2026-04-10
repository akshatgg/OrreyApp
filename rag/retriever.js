/**
 * RAG Retriever — Client-side BM25 search over the Curtis textbook knowledge base.
 *
 * Loads the pre-processed knowledge-base.json and retrieves the most relevant
 * chunks for a given user query. Used by space-agent.js to augment LLM prompts.
 */

// ─── BM25 Parameters ──────────────────────────────────────────
const K1 = 1.5;  // term frequency saturation
const B = 0.75;  // document length normalization

// ─── Stopwords ─────────────────────────────────────────────────
const STOPWORDS = new Set([
    'a', 'an', 'the', 'is', 'it', 'of', 'in', 'to', 'and', 'or', 'for',
    'on', 'at', 'by', 'as', 'be', 'was', 'are', 'were', 'been', 'has',
    'had', 'do', 'does', 'did', 'but', 'not', 'no', 'so', 'if', 'from',
    'that', 'this', 'with', 'which', 'we', 'he', 'she', 'they', 'its',
    'can', 'will', 'may', 'would', 'could', 'should', 'shall', 'must',
    'have', 'than', 'then', 'when', 'where', 'what', 'how', 'who', 'whom',
    'each', 'every', 'all', 'both', 'few', 'more', 'most', 'other', 'some',
    'such', 'only', 'own', 'same', 'about', 'up', 'out', 'into', 'over',
    'after', 'before', 'between', 'under', 'again', 'further', 'once',
    'here', 'there', 'just', 'also', 'very', 'too', 'those', 'these',
    'tell', 'me', 'explain', 'describe', 'please', 'know', 'want',
]);

// ─── State ─────────────────────────────────────────────────────
let kb = null;       // loaded knowledge base
let ready = false;

// ─── Tokenizer (must match preprocess.js) ──────────────────────
function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s\-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 1 && !STOPWORDS.has(w));
}

// ─── Load knowledge base ───────────────────────────────────────
export async function initRetriever() {
    if (ready) return;
    try {
        const resp = await fetch(new URL('./knowledge-base.json', import.meta.url));
        if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
        kb = await resp.json();
        ready = true;
        console.log(`[RAG] Loaded ${kb.metadata.totalChunks} chunks from "${kb.metadata.source}"`);
    } catch (err) {
        console.error('[RAG] Failed to load knowledge base:', err);
    }
}

// ─── BM25 scoring ──────────────────────────────────────────────
function bm25Score(queryTokens, chunk) {
    const { N, avgdl, df } = kb.bm25;
    let score = 0;

    for (const term of queryTokens) {
        const termDf = df[term] || 0;
        if (termDf === 0) continue;

        // IDF: log((N - df + 0.5) / (df + 0.5) + 1)
        const idf = Math.log((N - termDf + 0.5) / (termDf + 0.5) + 1);

        // Term frequency in this chunk
        const tf = chunk.tf[term] || 0;
        if (tf === 0) continue;

        // BM25 TF component
        const tfNorm = (tf * (K1 + 1)) / (tf + K1 * (1 - B + B * (chunk.dl / avgdl)));

        score += idf * tfNorm;
    }

    return score;
}

// ─── Title boost ───────────────────────────────────────────────
function titleBoost(queryTokens, chunk) {
    const titleTokens = tokenize(chunk.title + ' ' + chunk.chapterName);
    let matches = 0;
    for (const qt of queryTokens) {
        if (titleTokens.includes(qt)) matches++;
    }
    // Boost: up to 30% of BM25 score for title matches
    return matches > 0 ? 1 + (matches / queryTokens.length) * 0.3 : 1;
}

// ─── Main retrieval function ───────────────────────────────────
/**
 * Retrieve the top-K most relevant chunks for a query.
 * @param {string} query - User's question
 * @param {number} topK  - Number of chunks to return (default 4)
 * @returns {Array<{id, title, chapter, chapterName, text, score}>}
 */
export function retrieve(query, topK = 4) {
    if (!ready || !kb) return [];

    const queryTokens = tokenize(query);
    if (queryTokens.length === 0) return [];

    // Score every chunk
    const scored = kb.chunks.map(chunk => {
        const base = bm25Score(queryTokens, chunk);
        const boost = titleBoost(queryTokens, chunk);
        return {
            id: chunk.id,
            sectionId: chunk.sectionId,
            title: chunk.title,
            chapter: chunk.chapter,
            chapterName: chunk.chapterName,
            text: chunk.text,
            score: base * boost,
        };
    });

    // Sort by score descending and take top K
    scored.sort((a, b) => b.score - a.score);

    // Deduplicate: avoid returning multiple sub-chunks of the same section
    const results = [];
    for (const item of scored) {
        if (results.length >= topK) break;
        // Allow at most 2 chunks from the same section
        const sectionCount = results.filter(r => r.sectionId === item.sectionId).length;
        if (sectionCount >= 2) continue;
        if (item.score > 0) {
            results.push(item);
        }
    }

    return results;
}

/**
 * Format retrieved chunks into a context string for the LLM prompt.
 * @param {Array} chunks - Output from retrieve()
 * @returns {string}
 */
export function formatContext(chunks) {
    if (chunks.length === 0) return '';

    return chunks
        .map((c, i) =>
            `[Source ${i + 1}: Chapter ${c.chapter} "${c.chapterName}" - Section ${c.title}]\n${c.text}`
        )
        .join('\n\n');
}

export function isReady() {
    return ready;
}
