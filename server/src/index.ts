import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import { PrismaClient } from '@prisma/client';

// Route imports
import profileRoutes from './routes/profile.routes';
import mealsRoutes from './routes/meals.routes';
import workoutsRoutes from './routes/workouts.routes';
import cardioRoutes from './routes/cardio.routes';
import waterRoutes from './routes/water.routes';
import sleepRoutes from './routes/sleep.routes';
import stepsRoutes from './routes/steps.routes';
import weightRoutes from './routes/weight.routes';
import targetsRoutes from './routes/targets.routes';
import settingsRoutes from './routes/settings.routes';
import dashboardRoutes from './routes/dashboard.routes';
import progressRoutes from './routes/progress.routes';
import streaksRoutes from './routes/streaks.routes';
import achievementsRoutes from './routes/achievements.routes';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
export const prisma = new PrismaClient();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Quote of the day
app.get('/api/quote', async (_req, res, next) => {
  try {
    const count = await prisma.quote.count();
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const index = (dayOfYear % count) + 1;
    const quote = await prisma.quote.findFirst({ skip: index - 1 });
    res.json(quote);
  } catch (err) {
    next(err);
  }
});

// API Routes
app.use('/api/profile', profileRoutes);
app.use('/api/meals', mealsRoutes);
app.use('/api/workouts', workoutsRoutes);
app.use('/api/cardio', cardioRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/sleep', sleepRoutes);
app.use('/api/steps', stepsRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/targets', targetsRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/streaks', streaksRoutes);
app.use('/api/achievements', achievementsRoutes);

// AI food estimator
app.post('/api/ai/estimate-food', async (req, res, next) => {
  try {
    const { description } = req.body;
    if (!description?.trim()) { res.status(400).json({ error: 'description is required' }); return; }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `You are a nutrition expert. For the food described below, respond ONLY with a valid JSON object with these exact fields: name (string, clean food name), calories (number, kcal total), protein (number, grams total), carbs (number, grams total), fats (number, grams total). No markdown, no code blocks, just raw JSON.\n\nFood: ${description}`;
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');
    res.json(JSON.parse(text));
  } catch (err) { next(err); }
});

// Error handler
app.use(errorHandler);

// Start server (skip in test environment)
if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
app.listen(env.PORT, () => {
  console.log(`🏋️ Hercules API running on http://localhost:${env.PORT}`);
  console.log(`\nRoutes:`);
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/quote`);
  console.log(`   POST/GET/PUT    /api/profile`);
  console.log(`   POST/GET/PUT/DEL /api/meals`);
  console.log(`   POST/GET/DEL    /api/workouts`);
  console.log(`   POST/GET/DEL    /api/cardio`);
  console.log(`   POST/GET        /api/water`);
  console.log(`   POST/GET        /api/sleep`);
  console.log(`   POST/GET        /api/steps`);
  console.log(`   POST/GET        /api/weight`);
  console.log(`   POST/GET/PUT/DEL /api/targets`);
  console.log(`   GET/PUT         /api/settings`);
  console.log(`   GET             /api/dashboard`);
  console.log(`   GET             /api/progress/*`);
  console.log(`   GET             /api/streaks`);
  console.log(`   GET             /api/achievements`);
});
}

export default app;
