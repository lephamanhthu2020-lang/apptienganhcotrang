import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// 1. Buddy AI Chat Endpoint for kids (6-11 years old)
app.post('/api/gemini/buddy-chat', async (req: Request, res: Response) => {
  try {
    const { message, gradeLevel = 3, topic = 'General', history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (!ai) {
      // Friendly fallback if key is not configured
      return res.json({
        reply: `Hello little explorer! 🌟 (Xin chào bạn nhỏ!) I am Buddy! You asked: "${message}". You are doing great! Let's practice saying: "I love English!" What is your favourite animal?`,
        suggestedNext: ['I like cats 🐱', 'I like dogs 🐶', 'I like pandas 🐼'],
      });
    }

    const systemPrompt = `You are "Buddy", a cheerful, enthusiastic 3D blue-and-white robot AI tutor and companion designed for Vietnamese primary school students aged 6–11 (Lớp 1 to 5, Chương trình GDPT 2018).
Current Student Grade: Grade ${gradeLevel}. Topic: ${topic}.
Rules:
- Be warm, extremely encouraging, patient, playful and polite.
- Use short sentences with simple, child-friendly English words suitable for primary school.
- When introducing a new or key English word or phrase, you may provide a brief Vietnamese translation in parentheses, like "Hello! (Xin chào!)".
- Keep responses short (under 60 words).
- End each response with an easy question or choice to invite the child to speak.
- Never ask for personal data (phone numbers, full names, addresses).
- Never discuss adult, sensitive, or harmful topics. Keep strictly focused on learning English happily.`;

    // Format contents
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      // Include up to last 4 turns
      const recent = history.slice(-4);
      for (const turn of recent) {
        contents.push({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text || '' }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const text = response.text || 'Great job! Keep practicing English with Buddy! 🌟';
    return res.json({ reply: text });
  } catch (error: any) {
    console.error('Error in buddy-chat:', error);
    return res.json({
      reply: `Beep boop! 🤖 Buddy is so proud of you for trying! Let's say: "Hello, my name is..."! What is your name?`,
      fallback: true,
    });
  }
});

// 2. Speaking Evaluation Endpoint
app.post('/api/gemini/evaluate-speaking', async (req: Request, res: Response) => {
  try {
    const { transcript, targetSentence, gradeLevel = 3 } = req.body;

    if (!transcript || !targetSentence) {
      return res.status(400).json({ error: 'Transcript and target sentence required' });
    }

    if (!ai) {
      // Rule-based fallback calculation
      const tNorm = transcript.trim().toLowerCase().replace(/[.,!?'"]/g, '');
      const sNorm = targetSentence.trim().toLowerCase().replace(/[.,!?'"]/g, '');
      const isMatch = tNorm === sNorm;
      const score = isMatch ? 100 : tNorm.includes(sNorm) || sNorm.includes(tNorm) ? 85 : 70;
      return res.json({
        score,
        stars: score >= 90 ? 3 : score >= 75 ? 2 : 1,
        feedback: score >= 90 ? 'Xuất sắc! Con phát âm rất rõ ràng!' : 'Làm tốt lắm! Con hãy luyện nói to và tự tin hơn nhé!',
        tips: `Con hãy chú ý từ trọng tâm: "${targetSentence.split(' ')[0]}"`,
      });
    }

    const prompt = `You are evaluating a Vietnamese primary school student (Grade ${gradeLevel}) practicing spoken English.
Target sentence: "${targetSentence}"
Child said (transcribed): "${transcript}"

Evaluate in friendly, encouraging Vietnamese:
Output JSON with:
{
  "score": number between 50 and 100,
  "stars": number (1, 2, or 3),
  "feedback": "Short encouraging sentence in Vietnamese for primary student",
  "tips": "One short simple tip for improvement, highlighting key sound or word"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    let result = {
      score: 90,
      stars: 3,
      feedback: 'Con phát âm rất giỏi! Buddy tặng con 3 ngôi sao!',
      tips: 'Tiếp tục phát huy nhé!',
    };

    try {
      if (response.text) {
        result = JSON.parse(response.text);
      }
    } catch (e) {
      // fallback
    }

    return res.json(result);
  } catch (error: any) {
    console.error('Error in evaluate-speaking:', error);
    return res.json({
      score: 85,
      stars: 2,
      feedback: 'Rất tốt! Con nói rõ ràng và tự tin!',
      tips: 'Hãy cùng Buddy nói lại một lần nữa để nhận 3 sao nhé!',
    });
  }
});

// 3. AI Lesson Creator for Teachers
app.post('/api/gemini/generate-lesson', async (req: Request, res: Response) => {
  try {
    const {
      gradeLevel = '3',
      lessonName = 'My Toys',
      topic = 'Toys and Games',
      objectives = 'Học từ vựng về đồ chơi và mẫu câu I have a...',
      vocabCount = 6,
      difficulty = 'Phát triển',
    } = req.body;

    if (!ai) {
      return res.json({
        lessonName,
        gradeLevel,
        topic,
        vocabularies: [
          { word: 'Ball', phonetic: '/bɔːl/', meaning: 'Quả bóng', example: 'I have a red ball.' },
          { word: 'Doll', phonetic: '/dɒl/', meaning: 'Búp bê', example: 'She has a pretty doll.' },
          { word: 'Robot', phonetic: '/ˈroʊbɒt/', meaning: 'Người máy', example: 'Buddy is my robot friend.' },
          { word: 'Car', phonetic: '/kɑːr/', meaning: 'Xe ô tô đồ chơi', example: 'This is a blue car.' },
        ],
        dialogue: [
          { speaker: 'Buddy', text: 'Hello! What toy do you have?' },
          { speaker: 'Student', text: 'I have a robot.' },
          { speaker: 'Buddy', text: 'That is awesome! Do you love your robot?' },
          { speaker: 'Student', text: 'Yes, I do!' },
        ],
        quizQuestions: [
          {
            question: 'What is this? ⚽',
            options: ['Ball', 'Doll', 'Car', 'Kite'],
            correctIndex: 0,
            explanation: 'Ball nghĩa là quả bóng tròn.',
          },
          {
            question: 'Complete the sentence: "I ____ a blue robot."',
            options: ['have', 'has', 'is', 'am'],
            correctIndex: 0,
            explanation: 'Với chủ ngữ "I", ta dùng động từ "have".',
          },
        ],
        differentiatedTiers: {
          tier1Support: 'Học sinh làm quen 3 từ vựng cơ bản với hình ảnh minh họa lớn và nghe mẫu 3 lần.',
          tier2Core: 'Học sinh ghi nhớ 5-6 từ và thực hành ghép câu "I have a [toy]".',
          tier3Advanced: 'Học sinh mô tả màu sắc và kích thước đồ chơi "I have a big red ball and I play with it."',
        },
      });
    }

    const prompt = `You are an expert curriculum designer for Vietnamese primary school English (Chương trình GDPT 2018).
Create a complete lesson module for Grade ${gradeLevel}:
Lesson Name: "${lessonName}"
Topic: "${topic}"
Objectives: "${objectives}"
Number of vocab words: ${vocabCount}
Level: "${difficulty}"

Return valid JSON conforming to this schema:
{
  "lessonName": "${lessonName}",
  "gradeLevel": "${gradeLevel}",
  "topic": "${topic}",
  "vocabularies": [
    { "word": "string", "phonetic": "string", "meaning": "Vietnamese string", "example": "English sentence" }
  ],
  "dialogue": [
    { "speaker": "Buddy" | "Student", "text": "string" }
  ],
  "quizQuestions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": number (0 to 3),
      "explanation": "Vietnamese explanation string"
    }
  ],
  "differentiatedTiers": {
    "tier1Support": "Củng cố nền tảng: description in Vietnamese",
    "tier2Core": "Phát triển: description in Vietnamese",
    "tier3Advanced": "Khám phá nâng cao: description in Vietnamese"
  }
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return res.json(data);
    }

    throw new Error('No response from Gemini');
  } catch (error: any) {
    console.error('Error in generate-lesson:', error);
    return res.status(500).json({ error: 'Could not generate lesson' });
  }
});

// Configure Vite middleware in development or serve static in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 English Buddy AI Server is running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
