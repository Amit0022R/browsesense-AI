import { Groq } from 'groq-sdk';
import { HistoryItem, ProcessedHistoryItem, AIAnalysisResponse } from '../types';

let groq: Groq | null = null;

const getGroqClient = () => {
  if (!groq) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not set in environment variables");
    }
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

const PRECLASSIFIED_DOMAINS: Record<string, string> = {
  'youtube.com': 'distracting',
  'instagram.com': 'distracting',
  'twitter.com': 'distracting',
  'github.com': 'productive',
  'leetcode.com': 'productive',
  'stackoverflow.com': 'productive',
};

export const processHistoryData = (data: HistoryItem[]): ProcessedHistoryItem[] => {
  return data.map(item => {
    let timeSpent = item.timeSpent;
    if (timeSpent === undefined && item.visitCount !== undefined) {
      timeSpent = item.visitCount * 2;
    }
    return {
      url: item.url,
      timeSpent: timeSpent || 0,
    };
  });
};

export const analyzeWithAI = async (processedData: ProcessedHistoryItem[]): Promise<AIAnalysisResponse> => {
  const enrichedData = processedData.map(item => {
    let category = 'unclassified';
    for (const [domain, cat] of Object.entries(PRECLASSIFIED_DOMAINS)) {
      if (item.url.includes(domain)) {
        category = cat;
        break;
      }
    }
    return { ...item, suggestedCategory: category !== 'unclassified' ? category : undefined };
  });

  const prompt = `
Analyze the following user's browsing history.
The input data contains the URL, estimated time spent in minutes, and an optionally suggested category.

Data:
${JSON.stringify(enrichedData, null, 2)}

Classify websites into:
- Productive (learning, coding, work)
- Neutral
- Distracting (social media, entertainment)

Then calculate and return:
- productivityScore: A score from 0 to 100 representing overall productivity.
- totalTime: Total time spent in minutes across all websites.
- productiveTime: Total time spent on productive websites in minutes.
- distractingTime: Total time spent on distracting websites in minutes.
- topDistractions: An array of the top distracting website domains.
- insights: An array of exactly 3 behavioral insights based on the data.
- suggestions: An array of exactly 3 actionable suggestions to improve productivity.

Return ONLY a valid JSON object matching the requested structure. Do not include markdown formatting like \`\`\`json.
`;

  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert productivity analyst. You strictly output valid JSON matching the exact schema requested.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    max_tokens: 1024,
  });

  const content = completion.choices[0]?.message?.content || "{}";
  
  try {
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith('```')) {
      cleanedContent = cleanedContent.replace(/^```(json)?\n?/i, '').replace(/\n?```$/i, '');
    }
    const parsed = JSON.parse(cleanedContent);
    return parsed as AIAnalysisResponse;
  } catch (error) {
    console.error("Failed to parse Groq response:", content);
    throw new Error("AI returned invalid JSON.");
  }
};

export const chatWithAI = async (question: string, rawHistoryData: any[]): Promise<string> => {
  const processedData = processHistoryData(rawHistoryData);

  const systemPrompt = `You are a productivity assistant analyzing a user's browsing history.
Answer the user's question using ONLY the provided data.
Be:
* Clear
* Practical
* Insightful
* Slightly conversational

Do NOT make up data.
Provide actionable advice when possible.`;

  const userPrompt = `User Question:
${question}

Browsing Data:
${JSON.stringify(processedData)}`;

  const completion = await getGroqClient().chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.5,
    max_tokens: 500,
  });

  return completion.choices[0]?.message?.content || "I couldn't process an answer right now.";
};
