import mongoose, { Schema, Document } from 'mongoose';

export interface IAnalysis extends Document {
  history: any[];
  productivityScore: number;
  totalTime: number;
  productiveTime: number;
  distractingTime: number;
  topDistractions: string[];
  insights: string[];
  suggestions: string[];
  createdAt: Date;
}

const AnalysisSchema: Schema = new Schema({
  history: { type: Array, required: true },
  productivityScore: { type: Number, required: true },
  totalTime: { type: Number, required: true },
  productiveTime: { type: Number, required: true },
  distractingTime: { type: Number, required: true },
  topDistractions: { type: [String], default: [] },
  insights: { type: [String], default: [] },
  suggestions: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

export const Analysis = mongoose.model<IAnalysis>('Analysis', AnalysisSchema);
