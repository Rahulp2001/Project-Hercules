import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import { testProfileId } from '../setup';

describe('Profile API', () => {
  it('POST /api/profile — creates a profile with calculated TDEE', async () => {
    const res = await request(app).post('/api/profile').send({
      name: 'New User',
      age: 28,
      gender: 'male',
      weight: 80,
      weightUnit: 'kg',
      height: 180,
      heightUnit: 'cm',
      activityLevel: 'moderate',
      goal: 'cut',
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('New User');
    expect(res.body.bmr).toBeGreaterThan(0);
    expect(res.body.tdee).toBeGreaterThan(res.body.bmr);
    expect(res.body.calorieTarget).toBeLessThan(res.body.tdee);
    expect(res.body.macros).toBeDefined();
    expect(res.body.settings).toBeDefined();
  });

  it('GET /api/profile/:id — retrieves a profile', async () => {
    const res = await request(app).get(`/api/profile/${testProfileId}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test User');
    expect(res.body.macros).toBeDefined();
  });

  it('GET /api/profile/:id — returns 404 for non-existent profile', async () => {
    const res = await request(app).get('/api/profile/99999');
    expect(res.status).toBe(404);
  });

  it('PUT /api/profile/:id — updates and recalculates TDEE', async () => {
    const res = await request(app).put(`/api/profile/${testProfileId}`).send({
      weight: 80,
      goal: 'bulk',
    });

    expect(res.status).toBe(200);
    expect(res.body.weight).toBe(80);
    expect(res.body.goal).toBe('bulk');
    expect(res.body.calorieTarget).toBeGreaterThan(res.body.tdee);
  });

  it('POST /api/profile — validates required fields', async () => {
    const res = await request(app).post('/api/profile').send({
      name: 'Incomplete',
    });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe('Validation Error');
    expect(res.body.details.length).toBeGreaterThan(0);
  });
});
