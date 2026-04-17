import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import { testProfileId } from '../setup';

const pid = () => testProfileId;

describe('Dashboard API', () => {
  it('GET /api/dashboard — returns full day data', async () => {
    await request(app).post('/api/meals').send({
      profileId: pid(), date: '2026-04-07', category: 'breakfast',
      name: 'Oats', calories: 300, protein: 10, carbs: 50, fats: 5,
    });
    await request(app).post('/api/water').send({
      profileId: pid(), date: '2026-04-07', amount: 6, unit: 'glasses',
    });
    await request(app).post('/api/steps').send({
      profileId: pid(), date: '2026-04-07', count: 7500,
    });

    const res = await request(app).get(`/api/dashboard?profileId=${pid()}&date=2026-04-07`);

    expect(res.status).toBe(200);
    expect(res.body.profile.name).toBe('Test User');
    expect(res.body.calories.consumed).toBe(300);
    expect(res.body.water.amount).toBe(6);
    expect(res.body.steps.count).toBe(7500);
    expect(res.body.meals.breakfast).toHaveLength(1);
  });

  it('GET /api/dashboard — returns 404 for bad profile', async () => {
    const res = await request(app).get('/api/dashboard?profileId=99999&date=2026-04-07');
    expect(res.status).toBe(404);
  });

  it('GET /api/dashboard — requires profileId', async () => {
    const res = await request(app).get('/api/dashboard?date=2026-04-07');
    expect(res.status).toBe(400);
  });
});

describe('Progress API', () => {
  it('GET /api/progress/calories — returns calorie trend', async () => {
    await request(app).post('/api/meals').send({
      profileId: pid(), date: '2026-04-06', category: 'lunch',
      name: 'Rice', calories: 500, protein: 15, carbs: 80, fats: 5,
    });
    await request(app).post('/api/meals').send({
      profileId: pid(), date: '2026-04-07', category: 'lunch',
      name: 'Pasta', calories: 600, protein: 20, carbs: 70, fats: 15,
    });

    const res = await request(app).get(`/api/progress/calories?profileId=${pid()}&range=1W`);

    expect(res.status).toBe(200);
    expect(res.body.target).toBe(2672);
    expect(res.body.data.length).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/progress/macros — returns macro averages', async () => {
    await request(app).post('/api/meals').send({
      profileId: pid(), date: '2026-04-07', category: 'breakfast',
      name: 'Eggs', calories: 300, protein: 25, carbs: 5, fats: 20,
    });

    const res = await request(app).get(`/api/progress/macros?profileId=${pid()}&range=1W`);

    expect(res.status).toBe(200);
    expect(res.body.protein).toBeGreaterThan(0);
    expect(res.body.days).toBeGreaterThanOrEqual(1);
  });

  it('GET /api/progress/habits — returns habit analysis', async () => {
    const res = await request(app).get(`/api/progress/habits?profileId=${pid()}`);

    expect(res.status).toBe(200);
    expect(res.body.all).toHaveLength(5);
    expect(res.body.best).toBeDefined();
    expect(res.body.worst).toBeDefined();
  });

  it('GET /api/progress/summary — returns weekly summary', async () => {
    const res = await request(app).get(`/api/progress/summary?profileId=${pid()}`);

    expect(res.status).toBe(200);
    expect(res.body.period).toBeDefined();
    expect(res.body.calories).toBeDefined();
    expect(res.body.workouts).toBeDefined();
    expect(res.body.water).toBeDefined();
    expect(res.body.sleep).toBeDefined();
    expect(res.body.steps).toBeDefined();
  });
});

describe('Streaks & Achievements API', () => {
  it('GET /api/streaks — returns streak data', async () => {
    const res = await request(app).get(`/api/streaks?profileId=${pid()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('currentStreak');
    expect(res.body).toHaveProperty('bestStreak');
  });

  it('GET /api/achievements — returns all badges', async () => {
    const res = await request(app).get(`/api/achievements?profileId=${pid()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(14);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('earned');
  });
});

describe('Quote API', () => {
  it('GET /api/quote — returns a quote', async () => {
    const res = await request(app).get('/api/quote');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('text');
    expect(res.body).toHaveProperty('author');
  });
});

describe('Settings API', () => {
  it('GET /api/settings — returns settings', async () => {
    const res = await request(app).get(`/api/settings?profileId=${pid()}`);

    expect(res.status).toBe(200);
    expect(res.body.theme).toBe('dark');
    expect(res.body.waterGoal).toBe(8);
    expect(res.body.stepGoal).toBe(10000);
  });

  it('PUT /api/settings — updates settings', async () => {
    const res = await request(app).put(`/api/settings?profileId=${pid()}`).send({
      theme: 'light',
      waterGoal: 10,
      stepGoal: 12000,
    });

    expect(res.status).toBe(200);
    expect(res.body.theme).toBe('light');
    expect(res.body.waterGoal).toBe(10);
    expect(res.body.stepGoal).toBe(12000);
  });
});
