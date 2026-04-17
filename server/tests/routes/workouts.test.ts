import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../src/index';
import { testProfileId } from '../setup';

const pid = () => testProfileId;

const makeSampleWorkout = () => ({
  profileId: pid(),
  date: '2026-04-07',
  name: 'Push Day',
  duration: 60,
  exercises: [
    {
      name: 'Bench Press',
      category: 'Chest',
      sortOrder: 0,
      sets: [
        { reps: 10, weight: 60, type: 'normal', sortOrder: 0 },
        { reps: 8, weight: 70, type: 'normal', sortOrder: 1 },
        { reps: 6, weight: 80, type: 'normal', sortOrder: 2 },
      ],
    },
    {
      name: 'Shoulder Press',
      category: 'Shoulders',
      sortOrder: 1,
      sets: [
        { reps: 12, weight: 30, type: 'normal', sortOrder: 0 },
        { reps: 10, weight: 35, type: 'normal', sortOrder: 1 },
      ],
    },
  ],
});

describe('Workouts API', () => {
  it('POST /api/workouts — creates workout with nested exercises and sets', async () => {
    const res = await request(app).post('/api/workouts').send(makeSampleWorkout());

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Push Day');
    expect(res.body.exercises).toHaveLength(2);
    expect(res.body.exercises[0].sets).toHaveLength(3);
    expect(res.body.exercises[1].sets).toHaveLength(2);
  });

  it('GET /api/workouts — retrieves workouts by date', async () => {
    await request(app).post('/api/workouts').send(makeSampleWorkout());

    const res = await request(app).get(`/api/workouts?profileId=${pid()}&date=2026-04-07`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].exercises[0].name).toBe('Bench Press');
  });

  it('GET /api/workouts/:id — retrieves a single workout', async () => {
    const create = await request(app).post('/api/workouts').send(makeSampleWorkout());

    const res = await request(app).get(`/api/workouts/${create.body.id}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Push Day');
    expect(res.body.exercises).toHaveLength(2);
  });

  it('DELETE /api/workouts/:id — deletes workout and cascades', async () => {
    const create = await request(app).post('/api/workouts').send(makeSampleWorkout());

    const res = await request(app).delete(`/api/workouts/${create.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);

    const check = await request(app).get(`/api/workouts/${create.body.id}`);
    expect(check.status).toBe(404);
  });

  it('GET /api/workouts/templates — returns only templates', async () => {
    await request(app).post('/api/workouts').send({
      ...makeSampleWorkout(),
      isTemplate: true,
      name: 'Push Template',
    });
    await request(app).post('/api/workouts').send(makeSampleWorkout());

    const res = await request(app).get(`/api/workouts/templates?profileId=${pid()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].name).toBe('Push Template');
  });

  it('GET /api/workouts/records — returns personal records', async () => {
    await request(app).post('/api/workouts').send(makeSampleWorkout());

    const res = await request(app).get(`/api/workouts/records?profileId=${pid()}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(1);

    const benchRecord = res.body.find((r: any) => r.exercise === 'bench press');
    expect(benchRecord).toBeDefined();
    expect(benchRecord.weight).toBe(80);
  });

  it('POST /api/workouts — validates required fields', async () => {
    const res = await request(app).post('/api/workouts').send({
      profileId: pid(),
      date: '2026-04-07',
      name: 'Empty Workout',
      exercises: [],
    });

    expect(res.status).toBe(400);
  });
});
