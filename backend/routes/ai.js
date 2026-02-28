import { Router } from "express";
import OpenAI from "openai";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
import { PDFParse } from "pdf-parse"
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import Portfolio from "../models/Portfolio.js";
import ChatSession from "../models/ChatSession.js";
import Resume from "../models/Resume.js";

const router = Router();

// OpenAI client using GitHub Models
const client = new OpenAI({
    baseURL: "https://models.github.ai/inference",
    apiKey: process.env.GITHUB_TOKEN,
});
const MODEL = "openai/gpt-4o-mini";

// ─────────────────────── HELPERS ───────────────────────

async function aiChat(messages, temperature = 0.7, maxTokens = 2000) {
    const response = await client.chat.completions.create({
        model: MODEL,
        messages,
        temperature,
        top_p: 1.0,
        max_tokens: maxTokens,
    });
    return response.choices[0].message.content;
}

function extractJSON(text) {
    try {
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();
        return JSON.parse(jsonStr);
    } catch {
        return null;
    }
}

// Portfolio sections we need to collect
const REQUIRED_SECTIONS = ["name", "title", "about", "skills", "experience", "education", "projects", "contact"];

function getMissingSections(data) {
    const missing = [];
    if (!data.name) missing.push("name");
    if (!data.title) missing.push("title");
    if (!data.about) missing.push("about");
    if (!data.skills || data.skills.length === 0) missing.push("skills");
    if (!data.experience || data.experience.length === 0) missing.push("experience");
    if (!data.education || data.education.length === 0) missing.push("education");
    if (!data.projects || data.projects.length === 0) missing.push("projects");
    if (!data.contact || (!data.contact.email && !data.contact.phone && !data.contact.linkedin && !data.contact.github)) missing.push("contact");
    return missing;
}

// ─────────────────────── SYSTEM PROMPTS ───────────────────────

const COLLECTION_PROMPT = (collectedData) => {
    const missing = getMissingSections(collectedData);
    const collected = REQUIRED_SECTIONS.filter((s) => !missing.includes(s));

    return `You are a friendly, professional portfolio assistant named "Folio AI". Your job is to collect the user's professional information by asking ONE question at a time.

CURRENT STATE:
- Collected sections: ${collected.length > 0 ? collected.join(", ") : "none yet"}
- Missing sections: ${missing.length > 0 ? missing.join(", ") : "ALL DONE!"}
- Current data: ${JSON.stringify(collectedData)}

COLLECTION ORDER (follow this order for missing sections):
1. name - "What's your full name?"
2. title - "What's your professional title/role?" (e.g. Full Stack Developer)
3. about - "Give me a brief intro about yourself (2-3 lines)"
4. experience - "Tell me about your work experience (company, role, duration, what you did)"
   - After each entry ask: "Do you have more work experience to add?"
5. education - "Where did you study? (college, degree, field, years)"
6. projects - "Tell me about a project you've built (name, what it does, tech used)"
   - After each entry ask: "Any more projects to add?"
7. skills - "What are your key technical skills?"
8. contact - "What's your contact info? (email, LinkedIn, GitHub, phone - whatever you'd like to share)"

RULES:
1. Ask ONLY ONE question at a time
2. Be conversational, warm, and encouraging (use emojis occasionally)
3. Acknowledge what the user said before asking the next question
4. After EVERY user response, you MUST include a JSON block at the END of your message to save the extracted data
5. For array fields (skills, experience, education, projects), MERGE new entries with existing data
6. When ALL sections are collected, say exactly "ALL_SECTIONS_COMPLETE" somewhere in your response
7. If user says "skip" for a section, move to the next one
8. Keep your responses concise (2-3 sentences + the question)

JSON FORMAT — include this at the end of EVERY response:
\`\`\`json
{"save": {"field": "name", "value": "John Doe"}}
\`\`\`

For array fields:
\`\`\`json
{"save": {"field": "skills", "value": [{"name": "React", "level": "Advanced"}, {"name": "Node.js", "level": "Intermediate"}]}}
\`\`\`

For experience:
\`\`\`json
{"save": {"field": "experience", "value": [{"company": "...", "role": "...", "startDate": "...", "endDate": "...", "description": "..."}]}}
\`\`\`

For education:
\`\`\`json
{"save": {"field": "education", "value": [{"institution": "...", "degree": "...", "field": "...", "startYear": "...", "endYear": "..."}]}}
\`\`\`

For projects:
\`\`\`json
{"save": {"field": "projects", "value": [{"title": "...", "description": "...", "techStack": ["React", "Node.js"], "liveUrl": "", "githubUrl": ""}]}}
\`\`\`

For contact:
\`\`\`json
{"save": {"field": "contact", "value": {"email": "...", "phone": "...", "linkedin": "...", "github": "..."}}}
\`\`\`

IMPORTANT: If the user gives you casual/raw info, still extract and structure it properly in the JSON.`;
};

const REFINEMENT_PROMPT = (portfolioData) => `You are "Folio AI", a portfolio content editor. The user's portfolio is live and they want to refine the content.

CURRENT PORTFOLIO DATA:
${JSON.stringify(portfolioData, null, 2)}

WHAT YOU CAN DO:
✅ Change any text content — about section, project descriptions, experience descriptions, skill names/levels, title, name, education details, contact info
✅ Rewrite content to be more professional, concise, or impactful
✅ Add or remove items from lists (skills, projects, experience, etc.)

WHAT YOU CANNOT DO:
❌ Change colors, fonts, layout, button styles, or any visual/design elements
❌ Modify the template code or structure
❌ Add images or media

RULES:
1. When the user asks for a content change, make the change and include a JSON block
2. If user asks for design/visual changes, politely refuse: "I can only update text content! For design changes, try switching to a different template 😊"
3. After making a change, briefly describe what you changed and ask if they're satisfied
4. Be concise and helpful

JSON FORMAT for updates:
\`\`\`json
{"update": {"about": "new about text...", "title": "new title..."}}
\`\`\`

For array updates (replace entire array):
\`\`\`json
{"update": {"skills": [{"name": "React", "level": "Expert"}, ...]}}
\`\`\``;

const RESUME_PARSE_PROMPT = `You are a resume parser. Extract ALL professional information from the resume text below and return ONLY a JSON object.

Return this EXACT structure (fill in what you find, leave empty strings/arrays for missing data):
\`\`\`json
{
    "name": "",
    "title": "",
    "about": "Generate a 2-3 sentence professional summary based on the resume",
    "skills": [{"name": "SkillName", "level": "Beginner|Intermediate|Advanced|Expert"}],
    "experience": [{"company": "", "role": "", "startDate": "", "endDate": "", "description": "", "current": false}],
    "education": [{"institution": "", "degree": "", "field": "", "startYear": "", "endYear": "", "description": ""}],
    "projects": [{"title": "", "description": "", "techStack": [], "liveUrl": "", "githubUrl": ""}],
    "certificates": [{"title": "", "issuer": "", "date": "", "url": ""}],
    "contact": {"email": "", "phone": "", "linkedin": "", "github": "", "twitter": "", "website": ""}
}
\`\`\`

RULES:
- Extract EVERYTHING you can find
- For skills, estimate the level based on years of experience or context
- Generate a professional "about" summary from the resume content
- For experience descriptions, use action verbs and be concise
- Return ONLY the JSON, no extra text`;

const POLISH_PROMPT = `You are a professional content writer. Take the raw portfolio data below and polish it into impressive, professional content.

RULES:
- Make the "about" section compelling and professional (2-3 sentences)
- Make project descriptions concise but impressive
- Make experience descriptions impactful with action verbs
- Ensure skill levels are reasonable
- Keep the same structure, just improve the text quality
- Return the COMPLETE data object with polished content as JSON

Return ONLY a JSON object with the same structure as the input, but with polished text.`;

// ═══════════════════════════════════════════════════════════
// POST /api/ai/resume-parse — Upload PDF, extract portfolio data
// ═══════════════════════════════════════════════════════════
router.post("/resume-parse", auth, upload.single("resume"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: { message: "PDF file is required", code: "NO_FILE" },
            });
        }

        console.log(req.file.originalname);
        // return;
        // Extract text from PDF
        const parser = new PDFParse({ data: req.file.buffer });
        const pdfData = await parser.getText();
        const resumeText = pdfData.text;
        console.log("FU", resumeText)

        if (!resumeText) {
            return res.status(400).json({
                success: false,
                error: { message: "Could not extract text from PDF. Make sure it's not a scanned image.", code: "PARSE_FAILED" },
            });
        }

        // Send to AI for structured extraction
        const responseText = await aiChat([
            { role: "system", content: RESUME_PARSE_PROMPT },
            { role: "user", content: resumeText },
        ], 0.3, 3000);

        const parsedData = extractJSON(responseText);

        if (!parsedData) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to parse resume data", code: "AI_PARSE_FAILED" },
            });
        }

        const resume = await Resume.create({
            userId: req.user._id,
            data: parsedData,
        });

        return res.json({
            success: true,
            data: parsedData,
        });
    } catch (error) {
        console.error("Resume Parse Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to parse resume", code: "RESUME_ERROR" },
        });
    }
});

// ═══════════════════════════════════════════════════════════
// POST /api/ai/polish — Polish raw data into professional content
// ═══════════════════════════════════════════════════════════
router.post("/polish", auth, async (req, res) => {
    try {
        const { data } = req.body;
        if (!data) {
            return res.status(400).json({
                success: false,
                error: { message: "Portfolio data is required", code: "NO_DATA" },
            });
        }

        // const responseText = await aiChat([
        //     { role: "system", content: POLISH_PROMPT },
        //     { role: "user", content: `Polish this portfolio data:\n${JSON.stringify(data)}` },
        // ], 0.5, 3000);

        // const polishedData = extractJSON(responseText);

        // console.log("Polished data", polishedData)
        res.json({
            success: true,
            data: data, // fallback to original if parse fails
        });
    } catch (error) {
        console.error("Polish Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Failed to polish content", code: "POLISH_ERROR" },
        });
    }
});

// ═══════════════════════════════════════════════════════════
// POST /api/ai/onboard — Data collection chat (no portfolio needed)
// ═══════════════════════════════════════════════════════════
router.post("/onboard", auth, async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        // Find or create session
        let session;
        if (sessionId) {
            session = await ChatSession.findOne({ _id: sessionId, userId: req.user._id, status: "active" });
        }
        if (!session) {
            session = await ChatSession.create({
                userId: req.user._id,
                phase: "collection",
                messages: [],
                collectedData: {},
            });
        }

        // Build messages for AI
        const systemPrompt = COLLECTION_PROMPT(session.collectedData);
        const messages = [{ role: "system", content: systemPrompt }];

        // Add conversation history
        for (const msg of session.messages) {
            messages.push({ role: msg.role, content: msg.content });
        }

        // Add current message
        if (message) {
            messages.push({ role: "user", content: message });
            session.messages.push({ role: "user", content: message });
        } else {
            // First message — AI should greet and ask first question
            messages.push({ role: "user", content: "Hi, I want to create my portfolio." });
            session.messages.push({ role: "user", content: "Hi, I want to create my portfolio." });
        }

        // Call AI
        const responseText = await aiChat(messages, 0.7, 1500);

        // Save assistant message
        session.messages.push({ role: "assistant", content: responseText });

        // Extract save data from response
        const saveData = extractJSON(responseText);
        if (saveData?.save) {
            const { field, value } = saveData.save;
            // For array fields, merge with existing
            if (Array.isArray(value) && Array.isArray(session.collectedData[field])) {
                session.collectedData[field] = [...session.collectedData[field], ...value];
            } else {
                session.collectedData[field] = value;
            }
            session.markModified("collectedData");
        }

        // Check if all sections are complete
        const isComplete = responseText.includes("ALL_SECTIONS_COMPLETE");
        if (isComplete) {
            session.status = "completed";
        }

        await session.save();

        res.json({
            success: true,
            data: {
                sessionId: session._id,
                message: responseText.replace(/```json[\s\S]*?```/g, "").trim(), // Clean response (remove JSON blocks)
                collectedData: session.collectedData,
                isComplete,
            },
        });
    } catch (error) {
        console.error("Onboard Chat Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Chat failed", code: "CHAT_ERROR" },
        });
    }
});

// ═══════════════════════════════════════════════════════════
// POST /api/ai/refine — Refinement chat (portfolio exists)
// ═══════════════════════════════════════════════════════════
router.post("/refine", auth, async (req, res) => {
    try {
        const { portfolioId, message, sessionId } = req.body;

        const portfolio = await Portfolio.findOne({
            _id: portfolioId,
            userId: req.user._id,
        });

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                error: { message: "Portfolio not found", code: "NOT_FOUND" },
            });
        }

        // Find or create refinement session
        let session;
        if (sessionId) {
            session = await ChatSession.findOne({ _id: sessionId, userId: req.user._id, phase: "refinement" });
        }
        if (!session) {
            session = await ChatSession.create({
                userId: req.user._id,
                portfolioId: portfolio._id,
                phase: "refinement",
                messages: [],
                collectedData: {},
            });
        }

        // Build messages
        const systemPrompt = REFINEMENT_PROMPT(portfolio.data);
        const messages = [{ role: "system", content: systemPrompt }];

        // Add conversation history (last 20 messages to save tokens)
        const recentMessages = session.messages.slice(-20);
        for (const msg of recentMessages) {
            messages.push({ role: msg.role, content: msg.content });
        }

        messages.push({ role: "user", content: message });
        session.messages.push({ role: "user", content: message });

        // Call AI
        const responseText = await aiChat(messages, 0.6, 2000);

        session.messages.push({ role: "assistant", content: responseText });

        // Extract update data
        const updateData = extractJSON(responseText);
        if (updateData?.update) {
            const currentData = portfolio.data.toObject();
            Object.assign(currentData, updateData.update);
            portfolio.data = currentData;
            await portfolio.save();
        }

        await session.save();

        res.json({
            success: true,
            data: {
                sessionId: session._id,
                message: responseText.replace(/```json[\s\S]*?```/g, "").trim(),
                portfolioData: portfolio.data,
                updated: !!updateData?.update,
            },
        });
    } catch (error) {
        console.error("Refine Chat Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "Refinement failed", code: "REFINE_ERROR" },
        });
    }
});

// ═══════════════════════════════════════════════════════════
// GET /api/ai/session — Get active chat session for user
// ═══════════════════════════════════════════════════════════
router.get("/session", auth, async (req, res) => {
    try {
        const session = await ChatSession.findOne({
            userId: req.user._id,
            status: "active",
            phase: "collection",
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: session
                ? {
                    sessionId: session._id,
                    messages: session.messages,
                    collectedData: session.collectedData,
                    phase: session.phase,
                }
                : null,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: "Failed to fetch session", code: "SESSION_ERROR" },
        });
    }
});

// ═══════════════════════════════════════════════════════════
// POST /api/ai/generate — Generate content for a section (kept for backward compat)
// ═══════════════════════════════════════════════════════════
router.post("/generate", auth, async (req, res) => {
    try {
        const { portfolioId, section, userInput } = req.body;

        if (!portfolioId || !section || !userInput) {
            return res.status(400).json({
                success: false,
                error: { message: "portfolioId, section, and userInput are required", code: "MISSING_FIELDS" },
            });
        }

        const portfolio = await Portfolio.findOne({
            _id: portfolioId,
            userId: req.user._id,
        });

        if (!portfolio) {
            return res.status(404).json({
                success: false,
                error: { message: "Portfolio not found", code: "NOT_FOUND" },
            });
        }

        const sectionPrompts = {
            about: `Generate a professional "About Me" for: "${userInput}". Return ONLY: {"about": "...", "title": "..."}`,
            skills: `Based on: "${userInput}", generate skills. Return ONLY: {"skills": [{"name": "...", "level": "Advanced"}]}`,
            experience: `Based on: "${userInput}", generate experience. Return ONLY: {"experience": [{"company": "...", "role": "...", "startDate": "...", "endDate": "...", "description": "..."}]}`,
            projects: `Based on: "${userInput}", generate projects. Return ONLY: {"projects": [{"title": "...", "description": "...", "techStack": [...]}]}`,
        };

        const prompt = sectionPrompts[section];
        if (!prompt) {
            return res.status(400).json({
                success: false,
                error: { message: "Invalid section", code: "INVALID_SECTION" },
            });
        }

        const responseText = await aiChat([
            { role: "system", content: "You are a professional portfolio content writer. Return ONLY valid JSON." },
            { role: "user", content: prompt },
        ]);

        const parsedData = extractJSON(responseText);

        if (parsedData) {
            const updateData = { ...portfolio.data.toObject() };
            if (parsedData[section] !== undefined) updateData[section] = parsedData[section];
            if (parsedData.title && section === "about") updateData.title = parsedData.title;
            portfolio.data = updateData;
            await portfolio.save();
        }

        res.json({
            success: true,
            data: { generatedText: responseText, parsedData, section },
        });
    } catch (error) {
        console.error("AI Generate Error:", error);
        res.status(500).json({
            success: false,
            error: { message: "AI generation failed", code: "AI_ERROR" },
        });
    }
});

export default router;
