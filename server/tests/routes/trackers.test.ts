import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import { testProfileId } from '../setup';

const pid = () => testProfileId;

describe('Cardio API', () => {
  it('POST /api/cardio — logs cardio with auto calorie estimation', async () => {
    const res = await request(app).post('/api/cardio').send({
      profileId: pid(),
      date: '2026-04-07',
      activityType: 'running',
      duration: 30,
    });

    expect(res.status).toBe(201);
    expect(res.body.activityType).toBe('running');
    expect(res.body.caloriesBurned).toBeGreaterThan(0);
  });

  it('GET /api/cardio — retrieves cardio by date', async () => {
    await request(app).post('/api/cardio').send({
      profileId: pid(), date: '2026-04-07', activityType: 'cycling', duration: 45,
    });

    const res = await request(app).get(`/api/cardio?profileId=${pid()}&date=2026-04-07`);
    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
  });

  it('DELETE /api/cardio/:id — deletes cardio session', async () => {
    const create = await request(app).post('/api/cardio').send({
      profileId: pid(), date: '2026-04-07', activityType: 'walking', duration: 60,
    });

    const res = await request(app).delete(`/api/cardio/${create.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});

describe('Water API', () => {
  it('POST /api/water — logs water', async () => {
    const res = await request(app).post('/api/water').send({
      profileId: pid(), date: '2026-04-07', amount: 6, unit: 'glasses',
    });

    expect(res.status).toBe(200);
    expect(res.body.amount).toBe(6);
  });

  it('POST /api/water — upserts on same date', async () => {
    await request(app).post('/api/water').send({
      profileId: pid(), date: '2026-04-07', amount: 4, unit: 'glasses',
    });
    const res = await request(app).post('/api/water').send({
      profileId: pid(), date: '2026-04-07', amount: 8, unit: 'glasses',
    });

    expect(res.body.amount).toBe(8);
  });

  it('GET /api/water — returns water for date', async () => {
    await request(app).post('/api/water').send({
      profileId: pid(), date: '2026-04-07', amount: 5, unit: 'glasses',
    });

    const res = await request(app).get(`/api/water?profileId=${pid()}&date=2026-04-07`);
    expect(res.body.amount).toBe(5);
  });

  it('GET /api/water — returns default for no data', async () => {
    const res = await request(app).get(`/api/water?profileId=${pid()}&date=2025-01-01`);
    expect(res.body.amount).toBe(0);
  });
});

describe('Sleep API', () => {
  it('POST /api/sleep — logs sleep', async () => {
    const res = await request(app).post('/api/sleep').send({
      profileId: pid(), date: '2026-04-07', hours: 7.5, quality: 'good',
      bedtime: '23:00', wakeTime: '06:30',
    });

    expect(res.status).toBe(200);
    expect(res.body.hours).toBe(7.5);
    expect(res.body.quality).toBe('good');
  });

  it('GET /api/sleep — returns sleep for date', async () => {
    await request(app).post('/api/sleep').send({
      profileId: pid(), date: '2026-04-07', hours: 8, quality: 'good',
    });

    const res = await request(app).get(`/api/sleep?profileId=${pid()}&date=2026-04-07`);
    expect(res.body.hours).toBe(8);
  });
});

describe('Steps API', () => {
  it('POST /api/steps — logs steps', async () => {
    const res = await request(app).post('/api/steps').send({
      profileId: pid(), date: '2026-04-07', count: 8500,
    });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(8500);
  });

  it('POST /api/steps — upserts on same date', async () => {
    await request(app).post('/api/steps').send({
      profileId: pid(), date: '2026-04-07', count: 5000,
    });
    const res = await request(app).post('/api/steps').send({
      profileId: pid(), date: '2026-04-07', count: 12000,
    });

    expect(res.body.count).toBe(12000);
  });
});

describe('Weight API', () => {
  it('POST /api/weight — logs weight', async () => {
    const res = await request(app).post('/api/weight').send({
      profileId: pid(), date: '2026-04-07', weight: 74.5,
    });

    expect(res.status).toBe(200);
    expect(res.body.weight).toBe(74.5);
  });

  it('GET /api/weight — returns weight history', async () => {
    await request(app).post('/api/weight').send({
      profileId: pid(), date: '2026-04-05', weight: 75.0,
    });
    await request(app).post('/api/weight').send({
      profileId: pid(), date: '2026-04-06', weight: 74.8,
    });
    await request(app).post('/api/weight').send({
      profileId: pid(), date: '2026-04-07', weight: 74.5,
    });

    const res = await request(app).get(`/api/weight?profileId=${pid()}&range=1W`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
    expect(res.body[0].date).toBe('2026-04-05');
  });
});

describe('Targets API', () => {
  it('POST /api/targets — creates a custom target', async () => {
    const res = await request(app).post('/api/targets').send({
      profileId: pid(), name: 'Take vitamins',
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Take vitamins');
    expect(res.body.isActive).toBe(true);
  });

  it('GET /api/targets — returns active targets', async () => {
    await request(app).post('/api/targets').send({ profileId: pid(), name: 'Stretch' });
    await request(app).post('/api/targets').send({ profileId: pid(), name: 'Meditate' });

    const res = await request(app).get(`/api/targets?profileId=${pid()}`);
    expect(res.body).toHaveLength(2);
  });

  it('PUT /api/targets/:id — updates a target', async () => {
    const create = await request(app).post('/api/targets').send({
      profileId: pid(), name: 'Old Name',
    });

    const res = await request(app).put(`/api/targets/${create.body.id}`).send({
      name: 'New Name',
    });

    expect(res.body.name).toBe('New Name');
  });

  it('DELETE /api/targets/:id — deletes a target', async () => {
    const create = await request(app).post('/api/targets').send({
      profileId: pid(), name: 'Delete me',
    });

    const res = await request(app).delete(`/api/targets/${create.body.id}`);
    expect(res.body.success).toBe(true);
  });

  it('POST /api/targets/daily — logs daily completion', async () => {
    const res = await request(app).post('/api/targets/daily').send({
      profileId: pid(),
      date: '2026-04-07',
      completionPct: 85,
      targetsMet: { water: true, sleep: true, steps: false },
    });

    expect(res.status).toBe(200);
    expect(res.body.completionPct).toBe(85);
  });
});
