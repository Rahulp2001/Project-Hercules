import { Router, Request, Response, NextFunction } from 'express';
import OpenAI from 'openai';

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/estimate-food', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { description } = req.body;
    if (!description?.trim()) {
      res.status(400).json({ error: 'description is required' });
      return;
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a nutrition expert. When given a food description, respond ONLY with a valid JSON object with these fields: name (string, clean food name), calories (number, kcal), protein (number, grams), carbs (number, grams), fats (number, grams). No extra text, no markdown, just the JSON.',
        },
        {
          role: 'user',
          content: description,
        },
      ],
      temperature: 0.2,
      max_tokens: 150,
    });

    const text = completion.choices[0].message.content?.trim() || '{}';
    const result = JSON.parse(text);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

export default router;
