/**
 * 阿里云百炼 Provider 类型定义
 * 
 * 基于 TinyClaw Provider 接口规范
 * 参考：https://mintlify.com/warengonzaga/tinyclaw/plugins/provider-plugins
 */

import type {
  Provider,
  Message,
  LLMResponse,
  Tool,
  ToolCall
} from '@tinyclaw/types';

/**
 * 百炼 API 配置
 */
export interface BailianConfig {
  /** API Key (sk-sp-xxxxxxxx) */
  apiKey: string;
  /** API 基础 URL */
  baseUrl: string;
  /** 默认模型 */
  model: string;
  /** 请求超时 (毫秒) */
  timeout?: number;
  /** 最大重试次数 */
  maxRetries?: number;
}

/**
 * 百炼 API 请求体 (OpenAI 兼容格式)
 */
export interface BailianChatRequest {
  model: string;
  messages: BailianMessage[];
  tools?: BailianTool[];
  tool_choice?: 'auto' | 'none' | { type: 'function'; function: { name: string } };
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

/**
 * 百炼 API 消息格式
 */
export interface BailianMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  tool_calls?: BailianToolCall[];
  tool_call_id?: string;
}

/**
 * 百炼 API 工具定义
 */
export interface BailianTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

/**
 * 百炼 API 工具调用
 */
export interface BailianToolCall {
  id: string;
  type: 'function';
  function: {
    name: string;
    arguments: string;
  };
}

/**
 * 百炼 API 响应格式
 */
export interface BailianChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: BailianMessage;
    finish_reason: string | null;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * 百炼 Provider 实现
 */
export interface BailianProvider extends Provider {
  /** 获取当前配置 */
  getConfig(): BailianConfig;
  /** 更新配置 */
  updateConfig(config: Partial<BailianConfig>): void;
}

/**
 * 支持的百炼模型列表
 */
export const BAILIAN_MODELS = {
  // 通义千问主力模型
  'qwen3.5-plus': '通义千问 3.5 Plus (推荐)',
  'qwen3.5-turbo': '通义千问 3.5 Turbo',
  'qwen3-coder-plus': '通义千问 Coder Plus (编程专用)',
  'qwen3-coder-turbo': '通义千问 Coder Turbo',
  'qwen-max': '通义千问 Max',
  'qwen-plus': '通义千问 Plus',
  'qwen-turbo': '通义千问 Turbo',
  // 视觉模型
  'qwen-vl-max': '通义千问 VL Max (视觉)',
  'qwen-vl-plus': '通义千问 VL Plus (视觉)',
} as const;

/**
 * 默认配置
 */
export const DEFAULT_CONFIG: Omit<BailianConfig, 'apiKey'> = {
  baseUrl: 'https://coding.dashscope.aliyuncs.com/v1',
  model: 'qwen3.5-plus',
  timeout: 60000,
  maxRetries: 3,
};
