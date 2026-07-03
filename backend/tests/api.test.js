const request = require('supertest');
const app = require('../app');

describe('API Integration tests', () => {
  test('GET /health returns status OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('OK');
  });

  test('GET /api/weather validates query parameters', async () => {
    const res = await request(app).get('/api/weather'); // Missing q
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error.message).toContain('required');
  });

  test('GET /api/weather returns weather data for valid query', async () => {
    const res = await request(app).get('/api/weather?q=Tokyo');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.location.name).toBe('Tokyo');
  });

  test('POST /api/chatbot validates input fields', async () => {
    const res = await request(app).post('/api/chatbot').send({}); // Missing message
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('POST /api/chatbot runs conversation flow successfully', async () => {
    const res = await request(app)
      .post('/api/chatbot')
      .send({ message: 'How is the wind in Paris?' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.sessionId).toBeDefined();
    expect(res.body.data.reply).toBeDefined();
    expect(res.body.data.location).toBe('Paris');
  });
});
