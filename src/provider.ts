/**
 * 阿里云百炼 Provider 实现
 * 
 * 兼容 OpenAI Chat Completions API 格式
 * 文档：https://help.aliyun.com/zh/model-studio/developer-reference/openai-compatible
 */

import type {
  Provider,
  Message,
  LLMResponse,
  Tool,
  ToolCall
} from '@tinyclaw/types';
import type {
  BailianConfig,
  BailianProvider,
  BailianChatRequest,
  BailianMessage,
  BailianTool,
  BailianChatResponse
} from './types.js';
import { DEFAULT_CONFIG, BAILIAN_MODELS } from './types.js';

/**
 * 创建百炼 Provider 实例
 */
export function createBailianProvider(config: BailianConfig): BailianProvider {
  const fullConfig: BailianConfig = {
    ...DEFAULT_CONFIG,
    ...config,
  };

  let currentConfig = { ...fullConfig };

  /**
   * 转换消息格式 (TinyClaw -> 百炼)
   */
  function convertMessages(messages: Message[]): BailianMessage[] {
    return messages.map(msg => {
      const bailianMsg: BailianMessage = {
        role: msg.role,
        content: msg.content,
      };

      if (msg.toolCalls && msg.toolCalls.length > 0) {
        bailianMsg.tool_calls = msg.toolCalls.map(tc => ({
          id: tc.id,
          type: 'function',
          function: {
            name: tc.name,
            arguments: JSON.stringify(tc.arguments),
          },
        }));
      }

      if (msg.toolCallId) {
        bailianMsg.tool_call_id = msg.toolCallId;
      }

      return bailianMsg;
    });
  }

  /**
   * 转换工具格式 (TinyClaw -> 百炼)
   */
  function convertTools(tools?: Tool[]): BailianTool[] | undefined {
    if (!tools || tools.length === 0) return undefined;

    return tools.map(tool => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description || '',
        parameters: tool.parameters as Record<string, unknown>,
      },
    }));
  }

  /**
   * 转换响应格式 (百炼 -> TinyClaw)
   */
  function convertResponse(response: BailianChatResponse): LLMResponse {
    const choice = response.choices[0];
    const message = choice.message;

    if (message.tool_calls && message.tool_calls.length > 0) {
      const toolCalls: ToolCall[] = message.tool_calls.map(tc => ({
        id: tc.id,
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments) as Record<string, unknown>,
      }));

      return {
        type: 'tool_calls',
        toolCalls,
      };
    }

    return {
      type: 'text',
      content: message.content || '',
    };
  }

  /**
   * 发送 API 请求 (带重试)
   */
  async function sendRequest(
    request: BailianChatRequest
  ): Promise<BailianChatResponse> {
    const { timeout = 60000, maxRetries = 3 } = currentConfig;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(`${currentConfig.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${currentConfig.apiKey}`,
          },
          body: JSON.stringify(request),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorBody = await response.text().catch(() => 'Unknown error');
          throw new Error(`百炼 API 错误 (${response.status}): ${errorBody}`);
        }

        const data: BailianChatResponse = await response.json();
        return data;
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // 非重试错误，直接抛出
        if (lastError.name === 'AbortError') {
          throw new Error(`请求超时 (${timeout}ms)`);
        }
        
        // 4xx 错误不重试
        if (lastError.message.includes('4')) {
          throw lastError;
        }

        // 等待后重试
        if (attempt < maxRetries - 1) {
          const delay = Math.min(1000 * Math.pow(2, attempt), 10000);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('百炼 API 请求失败');
  }

  /**
   * Provider 实例
   */
  const provider: BailianProvider = {
    id: 'bailian',
    name: `阿里云百炼 (${currentConfig.model})`,

    getConfig() {
      return { ...currentConfig };
    },

    updateConfig(newConfig: Partial<BailianConfig>) {
      currentConfig = { ...currentConfig, ...newConfig };
      // 更新显示名称
      provider.name = `阿里云百炼 (${currentConfig.model})`;
    },

    async chat(messages: Message[], tools?: Tool[]): Promise<LLMResponse> {
      if (!currentConfig.apiKey) {
        throw new Error('百炼 API Key 未配置');
      }

      const request: BailianChatRequest = {
        model: currentConfig.model,
        messages: convertMessages(messages),
        tools: convertTools(tools),
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 4096,
        stream: false,
      };

      const response = await sendRequest(request);
      return convertResponse(response);
    },

    async isAvailable(): Promise<boolean> {
      try {
        // 发送一个简单的测试请求
        const testRequest: BailianChatRequest = {
          model: currentConfig.model,
          messages: [{ role: 'user', content: '你好' }],
          max_tokens: 10,
        };

        await sendRequest(testRequest);
        return true;
      } catch {
        return false;
      }
    },
  };

  return provider;
}

export default createBailianProvider;
