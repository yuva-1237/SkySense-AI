const chatbotService = require('../services/chatbotService');

describe('ChatbotService tests', () => {
  test('extractLocationRegex identifies city names from queries', () => {
    const loc1 = chatbotService.extractLocationRegex('What is the weather in Paris?', '');
    const loc2 = chatbotService.extractLocationRegex('Forecast for Tokyo today', '');
    expect(loc1).toBe('Paris');
    expect(loc2).toBe('Tokyo');
  });

  test('extractLocationRegex falls back to history or default location', () => {
    const loc1 = chatbotService.extractLocationRegex('Will it rain tomorrow?', 'Paris');
    const loc2 = chatbotService.extractLocationRegex('What about wind speeds?', '');
    expect(loc1).toBe('Paris');
    expect(loc2).toBe('Manchester');
  });

  test('sendMessage returns grounded answers and snapshots', async () => {
    const res = await chatbotService.sendMessage('test-session-uuid', 'Is it going to rain in London?');
    expect(res.reply).toContain('London');
    expect(res.location).toBe('London');
    expect(res.weatherSnapshot.temp_c).toBeDefined();
    expect(res.weatherSnapshot.insights).toBeDefined();
  });
});
