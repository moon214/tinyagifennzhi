/**
 * 百炼 Provider 配对工具
 * 
 * 用于 TinyAGI 交互式配置 API Key 和模型
 */

import type {
  Tool,
  SecretsManagerInterface,
  ConfigManagerInterface
} from '@tinyclaw/types';
import { BAILIAN_MODELS, DEFAULT_CONFIG } from './types.js';

const BAILIAN_SECRET_KEY = 'provider.bailian.apiKey';
const BAILIAN_MODEL_KEY = 'providers.bailian.model';
const BAILIAN_BASE_URL_KEY = 'providers.bailian.baseUrl';

/**
 * 创建百炼配对工具
 */
export function createBailianPairingTools(
  secrets: SecretsManagerInterface,
  configManager: ConfigManagerInterface
): Tool[] {
  return [
    {
      name: 'configure_bailian_provider',
      description: '配置阿里云百炼 Provider - 设置 API Key、基础 URL 和默认模型',
      parameters: {
        type: 'object',
        properties: {
          apiKey: {
            type: 'string',
            description: '百炼 API Key (格式：sk-sp-xxxxxxxx)',
          },
          baseUrl: {
            type: 'string',
            description: 'API 基础 URL',
            default: DEFAULT_CONFIG.baseUrl,
          },
          model: {
            type: 'string',
            description: '默认模型',
            enum: Object.keys(BAILIAN_MODELS),
            default: DEFAULT_CONFIG.model,
          },
        },
        required: ['apiKey'],
      },
      execute: async (args: Record<string, unknown>) => {
        const { apiKey, baseUrl, model } = args;

        if (typeof apiKey !== 'string' || !apiKey.startsWith('sk-')) {
          return {
            success: false,
            error: '无效的 API Key 格式，应以 sk- 开头',
          };
        }

        // 存储 API Key
        await secrets.store(BAILIAN_SECRET_KEY, apiKey.trim());

        // 存储配置
        if (typeof baseUrl === 'string') {
          configManager.set(BAILIAN_BASE_URL_KEY, baseUrl);
        }

        if (typeof model === 'string' && model in BAILIAN_MODELS) {
          configManager.set(BAILIAN_MODEL_KEY, model);
        }

        const modelName = BAILIAN_MODELS[model as keyof typeof BAILIAN_MODELS] || model;

        return {
          success: true,
          message: `✅ 百炼 Provider 配置成功！\n\n模型：${modelName}\nAPI URL: ${baseUrl || DEFAULT_CONFIG.baseUrl}`,
        };
      },
    },
    {
      name: 'list_bailian_models',
      description: '列出阿里云百炼支持的所有模型',
      parameters: {
        type: 'object',
        properties: {},
      },
      execute: async () => {
        const modelList = Object.entries(BAILIAN_MODELS)
          .map(([id, name]) => `- **${id}**: ${name}`)
          .join('\n');

        return {
          success: true,
          message: `## 阿里云百炼支持模型\n\n${modelList}`,
        };
      },
    },
    {
      name: 'test_bailian_connection',
      description: '测试百炼 API 连接是否正常',
      parameters: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: '测试消息',
            default: '你好，请回复"连接正常"',
          },
        },
      },
      execute: async (args: Record<string, unknown>) => {
        const { message } = args;
        const apiKey = await secrets.resolveProviderKey('bailian');

        if (!apiKey) {
          return {
            success: false,
            error: '百炼 API Key 未配置，请先运行 configure_bailian_provider',
          };
        }

        const baseUrl = configManager.get<string>(BAILIAN_BASE_URL_KEY) || DEFAULT_CONFIG.baseUrl;
        const model = configManager.get<string>(BAILIAN_MODEL_KEY) || DEFAULT_CONFIG.model;

        try {
          const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model,
              messages: [{ role: 'user', content: message as string || '你好' }],
              max_tokens: 50,
            }),
          });

          if (!response.ok) {
            const errorBody = await response.text().catch(() => 'Unknown error');
            return {
              success: false,
              error: `API 错误 (${response.status}): ${errorBody}`,
            };
          }

          const data = await response.json();
          const reply = data.choices?.[0]?.message?.content || '无响应';

          return {
            success: true,
            message: `✅ 百炼 API 连接正常！\n\n模型：${model}\n回复：${reply}`,
          };
        } catch (error) {
          return {
            success: false,
            error: `连接失败：${error instanceof Error ? error.message : String(error)}`,
          };
        }
      },
    },
  ];
}

export default createBailianPairingTools;
