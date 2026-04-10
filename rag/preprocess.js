#!/usr/bin/env node
/**
 * RAG Preprocessing Script
 * Extracts text from Curtis "Orbital Mechanics for Engineering Students" PDF,
 * chunks it by section, computes BM25-ready data, and outputs knowledge-base.json.
 *
 * Usage: node rag/preprocess.js
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PDF_PATH = join(__dirname, '..', 'Papers', 'Curtis_OrbitamMechForEngineeringStudents.pdf');
const OUTPUT_PATH = join(__dirname, 'knowledge-base.json');

// ─── Config ────────────────────────────────────────────────────
const MAX_CHUNK_WORDS = 600;
const MIN_CHUNK_WORDS = 40;
const OVERLAP_SENTENCES = 2; // sentences of overlap between sub-chunks

// Chapter names for metadata
const CHAPTER_NAMES = {
    1: 'Dynamics of Point Masses',
    2: 'The Two-Body Problem',
    3: 'Orbital Position as a Function of Time',
    4: 'Orbits in Three Dimensions',
    5: 'Preliminary Orbit Determination',
    6: 'Orbital Maneuvers',
    7: 'Relative Motion and Rendezvous',
    8: 'Interplanetary Trajectories',
    9: 'Rigid-Body Dynamics',
    10: 'Satellite Attitude Dynamics',
    11: 'Rocket Vehicle Dynamics',
};

// ─── Step 1: Extract text from PDF ─────────────────────────────
console.log('Step 1: Extracting text from PDF...');

let rawText;
try {
    rawText = execSync(`pdftotext "${PDF_PATH}" -`, {
        maxBuffer: 50 * 1024 * 1024,
        encoding: 'utf-8',
    });
} catch (err) {
    console.error('Failed to extract PDF. Make sure poppler/pdftotext is installed.');
    console.error('  brew install poppler  (macOS)');
    console.error('  apt-get install poppler-utils  (Linux)');
    process.exit(1);
}

console.log(`  Extracted ${rawText.length} characters.`);

// Valid chapters in this textbook
const VALID_CHAPTERS = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);

// ─── Step 2: Clean the text ────────────────────────────────────
console.log('Step 2: Cleaning text...');

function cleanText(text) {
    // Remove form feeds
    text = text.replace(/\f/g, '\n');
    // Remove page headers like "34 Chapter 2 The two-body problem"
    text = text.replace(/^\d+\s+Chapter\s+\d+\s+.+$/gm, '');
    // Remove page footers (lines that are just numbers)
    text = text.replace(/^\s*\d{1,3}\s*$/gm, '');
    // Remove lines that are just "Contents", roman numerals, or "Chapter outline"
    text = text.replace(/^\s*(Contents|Chapter outline|viii|vii|vi|iv|v|ix|x|xi|xii|xiii|xiv|xv)\s*$/gim, '');
    // Remove standalone single letters (drop-cap artifacts from PDF like "T" on its own line)
    text = text.replace(/^\s*[A-Z]\s*$/gm, '');
    // Collapse multiple blank lines
    text = text.replace(/\n{4,}/g, '\n\n\n');
    // Remove leading/trailing whitespace per line but preserve structure
    text = text.split('\n').map(l => l.trimEnd()).join('\n');
    return text;
}

const cleanedText = cleanText(rawText);

// ─── Step 3: Split into sections ───────────────────────────────
console.log('Step 3: Splitting into sections...');

// Strict section header: chapter 1-11, section number, then a title starting with a letter
// This avoids matching equations like "23.93 hr" or "50.56 20.42"
function parseSectionHeader(line) {
    const match = line.match(/^(\d{1,2})\.(\d{1,2}(?:\.\d{1,2})?)\s+([A-Z][A-Za-z].*)$/);
    if (!match) return null;

    const chapterNum = parseInt(match[1], 10);
    if (!VALID_CHAPTERS.has(chapterNum)) return null;

    const sectionNum = `${match[1]}.${match[2]}`;
    const sectionTitle = match[3].trim();

    // Title must have at least 2 words and contain real text, not just numbers/units
    if (sectionTitle.split(/\s+/).length < 1) return null;
    if (/^\d/.test(sectionTitle)) return null;

    return { sectionNum, sectionTitle, chapterNum };
}

function isChapterOutlineBlock(lines, startIdx) {
    // Detect and skip "Chapter outline" list blocks (section list + page numbers)
    // They look like: "2.1 Introduction\n2.2 Equations of...\n..." with page numbers
    // We detect them by checking if the next ~5 lines are all section numbers
    let sectionLineCount = 0;
    for (let i = startIdx; i < Math.min(startIdx + 8, lines.length); i++) {
        if (/^\d{1,2}\.\d{1,2}/.test(lines[i].trim())) sectionLineCount++;
    }
    return sectionLineCount >= 4;
}

function splitIntoSections(text) {
    const lines = text.split('\n');
    const sections = [];
    let currentSection = null;
    let contentLines = [];
    let inOutlineBlock = false;

    // Find where actual content starts (after table of contents)
    // Look for the line "1.1" followed eventually by "Introduction" — the actual section start
    let contentStart = 0;
    for (let i = 0; i < lines.length; i++) {
        // First occurrence of "1.1" at the start of a line, after "Chapter outline"
        if (/^1\.1\s*$/.test(lines[i].trim()) && i > 500) {
            contentStart = i;
            break;
        }
    }

    for (let i = contentStart; i < lines.length; i++) {
        const line = lines[i];

        // Skip chapter outline blocks (section listings with page numbers)
        if (/^Chapter outline$/i.test(line.trim())) {
            inOutlineBlock = true;
            continue;
        }
        if (inOutlineBlock) {
            // End outline block when we hit a blank line after non-section content
            // or when we see actual prose (long line without section number pattern)
            if (line.trim().length === 0) continue;
            if (/^\d{1,2}\.\d/.test(line.trim()) && line.trim().length < 60) continue;
            if (/^\d{1,3}$/.test(line.trim())) continue; // page numbers
            if (/^Problems$/.test(line.trim())) continue;
            inOutlineBlock = false;
        }

        const parsed = parseSectionHeader(line.trim());
        if (parsed) {
            // Save previous section
            if (currentSection && contentLines.length > 0) {
                const content = contentLines.join('\n').trim();
                if (content.length > 50) {
                    sections.push({ ...currentSection, content });
                }
            }

            // Check if this is actually a chapter outline listing (not real content)
            if (isChapterOutlineBlock(lines, i)) {
                inOutlineBlock = true;
                currentSection = null;
                contentLines = [];
                continue;
            }

            currentSection = {
                id: parsed.sectionNum,
                title: parsed.sectionTitle,
                chapter: parsed.chapterNum,
                chapterName: CHAPTER_NAMES[parsed.chapterNum] || `Chapter ${parsed.chapterNum}`,
            };
            contentLines = [];
        } else if (currentSection) {
            contentLines.push(line);
        }
    }

    // Don't forget the last section
    if (currentSection && contentLines.length > 0) {
        const content = contentLines.join('\n').trim();
        if (content.length > 50) {
            sections.push({ ...currentSection, content });
        }
    }

    return sections;
}

const sections = splitIntoSections(cleanedText);
console.log(`  Found ${sections.length} sections.`);

// ─── Step 4: Chunk sections (split large ones, skip tiny ones) ─
console.log('Step 4: Chunking sections...');

function splitIntoSentences(text) {
    // Split on sentence boundaries (period/question/exclamation followed by space+capital or newline)
    return text
        .replace(/\n+/g, ' ')
        .replace(/\s+/g, ' ')
        .split(/(?<=[.!?])\s+(?=[A-Z])/)
        .filter(s => s.trim().length > 0);
}

function wordCount(text) {
    return text.split(/\s+/).filter(w => w.length > 0).length;
}

function chunkSection(section) {
    const chunks = [];
    const sentences = splitIntoSentences(section.content);

    if (wordCount(section.content) <= MAX_CHUNK_WORDS) {
        // Section fits in one chunk
        if (wordCount(section.content) >= MIN_CHUNK_WORDS) {
            chunks.push({
                id: `${section.id}_0`,
                sectionId: section.id,
                title: section.title,
                chapter: section.chapter,
                chapterName: section.chapterName,
                text: section.content.replace(/\n+/g, ' ').replace(/\s+/g, ' ').trim(),
            });
        }
        return chunks;
    }

    // Split into sub-chunks with overlap
    let currentSentences = [];
    let currentWords = 0;
    let chunkIndex = 0;

    for (let i = 0; i < sentences.length; i++) {
        const sentenceWords = wordCount(sentences[i]);
        currentSentences.push(sentences[i]);
        currentWords += sentenceWords;

        if (currentWords >= MAX_CHUNK_WORDS || i === sentences.length - 1) {
            const text = currentSentences.join(' ').trim();
            if (wordCount(text) >= MIN_CHUNK_WORDS) {
                chunks.push({
                    id: `${section.id}_${chunkIndex}`,
                    sectionId: section.id,
                    title: section.title,
                    chapter: section.chapter,
                    chapterName: section.chapterName,
                    text,
                });
                chunkIndex++;
            }

            // Keep last OVERLAP_SENTENCES for context continuity
            const overlap = currentSentences.slice(-OVERLAP_SENTENCES);
            currentSentences = [...overlap];
            currentWords = wordCount(overlap.join(' '));
        }
    }

    return chunks;
}

let allChunks = [];
for (const section of sections) {
    allChunks.push(...chunkSection(section));
}

console.log(`  Created ${allChunks.length} chunks.`);

// ─── Step 5: Compute BM25 data ────────────────────────────────
console.log('Step 5: Computing BM25 index...');

// Stopwords (common English words that add noise to search)
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
]);

function tokenize(text) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s\-]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 1 && !STOPWORDS.has(w));
}

function computeTermFrequency(tokens) {
    const tf = {};
    for (const token of tokens) {
        tf[token] = (tf[token] || 0) + 1;
    }
    return tf;
}

// Tokenize all chunks and compute TF
const N = allChunks.length;
let totalWords = 0;
const docData = allChunks.map(chunk => {
    const tokens = tokenize(chunk.text + ' ' + chunk.title + ' ' + chunk.chapterName);
    const tf = computeTermFrequency(tokens);
    totalWords += tokens.length;
    return { tokens, tf, length: tokens.length };
});

const avgdl = totalWords / N;

// Compute document frequency (df) for each term
const df = {};
for (const { tf } of docData) {
    for (const term of Object.keys(tf)) {
        df[term] = (df[term] || 0) + 1;
    }
}

// Build the final knowledge base
const knowledgeBase = {
    metadata: {
        source: 'Orbital Mechanics for Engineering Students - Howard D. Curtis',
        totalChunks: N,
        avgDocLength: Math.round(avgdl),
        createdAt: new Date().toISOString(),
    },
    // BM25 global data
    bm25: {
        N,
        avgdl,
        df,
    },
    // Chunks with their TF data
    chunks: allChunks.map((chunk, i) => ({
        id: chunk.id,
        sectionId: chunk.sectionId,
        title: chunk.title,
        chapter: chunk.chapter,
        chapterName: chunk.chapterName,
        text: chunk.text,
        tf: docData[i].tf,
        dl: docData[i].length,
    })),
};

// ─── Step 6: Write to disk ─────────────────────────────────────
console.log('Step 6: Writing knowledge-base.json...');

writeFileSync(OUTPUT_PATH, JSON.stringify(knowledgeBase, null, 2), 'utf-8');

const fileSizeMB = (readFileSync(OUTPUT_PATH).length / 1024 / 1024).toFixed(2);
console.log(`\nDone! Created ${OUTPUT_PATH}`);
console.log(`  Chunks: ${N}`);
console.log(`  Avg chunk length: ${Math.round(avgdl)} tokens`);
console.log(`  Vocabulary size: ${Object.keys(df).length} terms`);
console.log(`  File size: ${fileSizeMB} MB`);
