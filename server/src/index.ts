import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { z } from 'zod';
import { processHistoryData, analyzeWithAI, chatWithAI } from './services/ai.service';
import { HistoryItem } from './types';
import { connectDB } from './config/db';
import { Analysis } from './models/Analysis';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const HistoryItemSchema = z.object({
  url: z.string(),
  visitCount: z.number().optional(),
  timeSpent: z.number().optional(),
}).refine(data => data.visitCount !== undefined || data.timeSpent !== undefined, {
  message: "Either visitCount or timeSpent must be provided",
});

app.use(express.json({ limit: '50mb' }));

app.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const rawHistoryData: HistoryItem[] = req.body;
    
    if (!Array.isArray(rawHistoryData)) {
      res.status(400).json({ error: 'Invalid input data format. Expected an array.' });
      return;
    }

    const processedData = processHistoryData(rawHistoryData);
    
    const analysisResult = await analyzeWithAI(processedData);
    try {
      const newAnalysis = new Analysis({
        history: processedData,
        productivityScore: analysisResult.productivityScore,
        totalTime: analysisResult.totalTime,
        productiveTime: analysisResult.productiveTime,
        distractingTime: analysisResult.distractingTime,
        topDistractions: analysisResult.topDistractions,
        insights: analysisResult.insights,
        suggestions: analysisResult.suggestions
      });
      await newAnalysis.save();
    } catch (dbError) {
      console.error("Failed to save analysis to DB:", dbError);
    }

    res.json(analysisResult);
  } catch (error) {
    console.error("Analyze Error:", error);
    res.status(500).json({ error: 'Failed to analyze data', message: (error as Error).message });
  }
});

const ChatRequestSchema = z.object({
  question: z.string().min(1),
  history: z.array(z.any()),
});

app.post('/chat', async (req, res) => {
  try {
    const { question, history } = ChatRequestSchema.parse(req.body);
    const response = await chatWithAI(question, history);
    res.json({ response });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Invalid input format', details: error.issues });
    } else {
      console.error("Chat Error:", error);
      res.status(500).json({ error: 'Failed to process chat', message: (error as Error).message });
    }
  }
});

app.get('/history', async (req, res) => {
  try {
    const recentAnalyses = await Analysis.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('productivityScore topDistractions createdAt');
    
    res.json(recentAnalyses);
  } catch (error) {
    console.error("Fetch History Error:", error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
