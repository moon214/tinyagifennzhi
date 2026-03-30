/**
 * 阿里云百炼 Provider 插件入口
 * 
 * TinyAGI Provider Plugin for Aliyun Bailian (Qwen Models)
 * 
 * @packageDocumentation
 */

import type {
  ProviderPlugin,
  SecretsManagerInterface,
  ConfigManagerInterface,
  Tool,
} from '@tinyclaw/types';
import { createBailianProvider } from './provider.js';
import { createBailianPairingTools } from './pairing.js';
import { DEFAULT_CONFIG, BAILIAN_MODELS } from './types.js';

/**
 * 百炼 Provider 插件
 * 
 * 支持阿里云百炼平台的所有 OpenAI 兼容模型
 * 包括：通义千问 Qwen 系列、Qwen-Coder 系列、Qwen-VL 视觉模型
 */
const bailianPlugin: ProviderPlugin = {
  id: '@moon214/tinyagi-bailian-provider',
  name: '阿里云百炼',
  description: '阿里云百炼 Provider - 支持通义千问 Qwen 系列模型 (OpenAI 兼容 API)',
  type: 'provider',
  version: '1.0.0',

  /**
   * 创建 Provider 实例
   * 
   * @param secrets - 密钥管理接口
   * @returns 初始化的百炼 Provider
   */
  async createProvider(secrets: SecretsManagerInterface) {
    const apiKey = await secrets.resolveProviderKey('bailian');

    if (!apiKey) {
      throw new Error(
        '百炼 API Key 未配置。请运行以下命令配置：\n' +
        '  tinyagi provider pair bailian\n' +
        '或在 .tinyagi/settings.json 中添加 provider.bailian.apiKey'
      );
    }

    // 从配置中读取可选参数
    const configManager = (secrets as unknown as { configManager?: ConfigManagerInterface }).configManager;
    
    const baseUrl = configManager?.get<string>('providers.bailian.baseUrl') || DEFAULT_CONFIG.baseUrl;
    const model = configManager?.get<string>('providers.bailian.model') || DEFAULT_CONFIG.model;

    return createBailianProvider({
      apiKey,
      baseUrl,
      model,
    });
  },

  /**
   * 获取配对工具
   * 
   * 提供交互式配置命令：
   * - configure_bailian_provider: 配置 API Key 和模型
   * - list_bailian_models: 列出支持的模型
   * - test_bailian_connection: 测试 API 连接
   */
  getPairingTools(
    secrets: SecretsManagerInterface,
    configManager: ConfigManagerInterface
  ): Tool[] {
    return createBailianPairingTools(secrets, configManager);
  },
};

export default bailianPlugin;
export { createBailianProvider, createBailianPairingTools };
export * from './types.js';
