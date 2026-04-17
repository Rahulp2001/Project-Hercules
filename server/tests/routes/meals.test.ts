import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import { testProfileId } from '../setup';

// Helper to get current profileId (it changes each beforeEach)
const pid = () => testProfileId;

describe('Meals API', () => {
  it('POST /api/meals — logs a meal', async () => {
    const res = await request(app).post('/api/meals').send({
      profileId: pid(),
      date: '2026-04-07',
      category: 'breakfast',
      name: 'Eggs and toast',
      calories: 400,
      protein: 25,
      carbs: 30,
      fats: 15,
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Eggs and toast');
    expect(res.body.calories).toBe(400);
  });

  it('GET /api/meals — retrieves meals by date', async () => {
    await request(app).post('/api/meals').send({
      profileId: pid(), date: '2026-04-07', category: 'breakfast',
      name: 'Oats', calories: 300, protein: 10, carbs: 50, fats: 5,
    });
    await request(app).post('/api/meals').send({
      profileId: pid(), date: '2026-04-07', category: 'lunch',
      name: 'Chicken rice', calories: 600, protein: 40, carbs: 60, fats: 15,
    });

    const res = await request(app).get(`/api/meals?profileId=${pid()}&date=2026-04-07`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
  });

  it('PUT /api/meals/:id — updates a meal', async () => {
    const create = await request(app).post('/api/meals').send({
      profileId: pid(), date: '2026-04-07', category: 'snacks',
      name: 'Apple', calories: 95, protein: 0, carbs: 25, fats: 0,
    });

    const res = await request(app).put(`/api/meals/${create.body.id}`).send({
      name: 'Apple with peanut butter',
      calories: 250,
      protein: 8,
      fats: 16,
    });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Apple with peanut butter');
    expect(res.body.calories).toBe(250);
  });

  it('DELETE /api/meals/:id — deletes a meal', async () => {
    const create = await request(app).post('/api/meals').send({
      profileId: pid(), date: '2026-04-07', category: 'dinner',
      name: 'Pizza', calories: 800, protein: 30, carbs: 80, fats: 35,
    });

    const res = await request(app).delete(`/api/meals/${create.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/meals — validates required fields', async () => {
    const res = await request(app).post('/api/meals').send({
      profileId: pid(),
      date: '2026-04-07',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
  });

  it('GET /api/meals/favorites — returns favorite meals', async () => {
    await request(app).post('/api/meals').send({
      profileId: pid(), date: '2026-04-07', category: 'breakfast',
      name: 'Fav Meal', calories: 300, protein: 20, carbs: 30, fats: 10,
      isFavorite: true,
    });

    const res = await request(app).get(`/api/meals/favorites?profileId=${pid()}`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    expect(res.body[0].isFavorite).toBe(true);
  });
});
