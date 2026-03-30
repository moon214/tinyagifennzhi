/**
 * 百炼 Provider 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { createBailianProvider } from '../src/provider.js';
import { DEFAULT_CONFIG } from '../src/types.js';

// 测试用 API Key（实际测试时需要真实 Key）
const TEST_API_KEY = process.env.BAILIAN_API_KEY || 'sk-test-placeholder';

describe('Bailian Provider', () => {
  let provider: ReturnType<typeof createBailianProvider>;

  beforeEach(() => {
    provider = createBailianProvider({
      apiKey: TEST_API_KEY,
      baseUrl: DEFAULT_CONFIG.baseUrl,
      model: DEFAULT_CONFIG.model,
    });
  });

  describe('Provider Info', () => {
    it('should have correct id', () => {
      expect(provider.id).toBe('bailian');
    });

    it('should have correct name', () => {
      expect(provider.name).toContain('阿里云百炼');
    });

    it('should have correct model in name', () => {
      expect(provider.name).toContain(DEFAULT_CONFIG.model);
    });
  });

  describe('Config Management', () => {
    it('should return full config', () => {
      const config = provider.getConfig();
      expect(config.apiKey).toBe(TEST_API_KEY);
      expect(config.baseUrl).toBe(DEFAULT_CONFIG.baseUrl);
      expect(config.model).toBe(DEFAULT_CONFIG.model);
    });

    it('should update config', () => {
      provider.updateConfig({ model: 'qwen3-coder-plus' });
      const config = provider.getConfig();
      expect(config.model).toBe('qwen3-coder-plus');
      expect(provider.name).toContain('qwen3-coder-plus');
    });
  });

  describe('Availability Check', () => {
    it('should return boolean for isAvailable', async () => {
      const available = await provider.isAvailable();
      expect(typeof available).toBe('boolean');
    });
  });

  describe('Chat (Integration)', () => {
    it.skip('should send chat message', async () => {
      // 需要真实 API Key 才能运行
      const messages = [
        { role: 'user' as const, content: '你好，请用一句话介绍你自己' }
      ];
      
      const response = await provider.chat(messages);
      expect(response.type).toBe('text');
      expect(response.content).toBeDefined();
      expect(response.content!.length).toBeGreaterThan(0);
    });
  });
});
