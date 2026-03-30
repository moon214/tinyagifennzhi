# TinyAGI 百炼 Provider 插件 🦞

> 阿里云百炼 (Aliyun Bailian) Provider 插件 for TinyAGI/TinyClaw
> 
> 支持通义千问 Qwen 系列模型，兼容 OpenAI API 格式

[![npm version](https://img.shields.io/npm/v/@moon214/tinyagi-bailian-provider.svg)](https://www.npmjs.com/package/@moon214/tinyagi-bailian-provider)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)

---

## ✨ 功能特性

- ✅ **完整 Provider 实现** - 遵循 TinyClaw Provider 接口规范
- ✅ **OpenAI 兼容** - 使用百炼 OpenAI 兼容 API
- ✅ **多模型支持** - Qwen3.5、Qwen-Coder、Qwen-VL 等
- ✅ **自动重试** - 网络错误自动重试机制
- ✅ **超时控制** - 可配置请求超时
- ✅ **工具调用** - 支持 Function Calling
- ✅ **交互式配置** - 提供配对工具命令
- ✅ **中文文档** - 完整的中文使用说明

---

## 📦 安装

### 方式一：一键安装脚本（推荐）

```bash
curl -fsSL https://raw.githubusercontent.com/moon214/tinyagifennzhi/main/scripts/install.sh | bash
```

### 方式二：Git 克隆

```bash
# 1. 克隆仓库
git clone https://github.com/moon214/tinyagifennzhi.git
cd tinyagifennzhi

# 2. 安装依赖
npm install

# 3. 安装插件到 TinyAGI
tinyagi plugin install .
```

### 方式三：npm 安装（发布后）

```bash
npm install @moon214/tinyagi-bailian-provider
tinyagi plugin install node_modules/@moon214/tinyagi-bailian-provider
```

---

## 🔧 配置

### 方式一：交互式配置（推荐）

```bash
# 启动配置向导
tinyagi provider pair bailian

# 或使用工具命令
tinyagi run configure_bailian_provider
```

按提示输入：
- **API Key**: `sk-sp-xxxxxxxxxxxx`
- **基础 URL**: `https://coding.dashscope.aliyuncs.com/v1` (默认)
- **模型**: `qwen3.5-plus` (推荐)

### 方式二：手动编辑配置文件

编辑 `~/.tinyagi/settings.json`:

```json
{
  "providers": {
    "bailian": {
      "apiKey": "sk-sp-xxxxxxxxxxxxxxxxxxxxxxxx",
      "baseUrl": "https://coding.dashscope.aliyuncs.com/v1",
      "model": "qwen3.5-plus"
    }
  },
  "routing": {
    "tierMapping": {
      "complex": "bailian",
      "reasoning": "bailian",
      "simple": "bailian"
    }
  }
}
```

### 方式三：环境变量

```bash
export BAILIAN_API_KEY="sk-sp-xxxxxxxxxxxxxxxxxxxxxxxx"
export BAILIAN_BASE_URL="https://coding.dashscope.aliyuncs.com/v1"
export BAILIAN_MODEL="qwen3.5-plus"
```

---

## 📋 支持的模型

| 模型 ID | 名称 | 适用场景 |
|--------|------|----------|
| `qwen3.5-plus` | 通义千问 3.5 Plus | 通用对话、复杂任务 ⭐推荐 |
| `qwen3.5-turbo` | 通义千问 3.5 Turbo | 快速响应 |
| `qwen3-coder-plus` | 通义千问 Coder Plus | 编程任务 ⭐推荐 |
| `qwen3-coder-turbo` | 通义千问 Coder Turbo | 快速代码生成 |
| `qwen-max` | 通义千问 Max | 最强大模型 |
| `qwen-plus` | 通义千问 Plus | 平衡性能 |
| `qwen-turbo` | 通义千问 Turbo | 经济快速 |
| `qwen-vl-max` | 通义千问 VL Max | 视觉理解 |
| `qwen-vl-plus` | 通义千问 VL Plus | 视觉理解 |

查看完整模型列表：

```bash
tinyagi run list_bailian_models
```

---

## 🧪 测试

### 测试 API 连接

```bash
tinyagi run test_bailian_connection
```

### 发送测试消息

```bash
tinyagi chat "你好，请用一句话介绍你自己"
```

---

## 🛠️ 开发

### 构建

```bash
npm install
npm run build
```

### 测试

```bash
npm test
```

### 代码规范

```bash
npm run lint
```

---

## 📖 命令参考

| 命令 | 说明 |
|------|------|
| `configure_bailian_provider` | 配置 API Key、URL、模型 |
| `list_bailian_models` | 列出支持的模型 |
| `test_bailian_connection` | 测试 API 连接 |

---

## ⚠️ 注意事项

1. **API Key 安全**
   - 不要将 API Key 提交到版本控制
   - 使用 TinyAGI 的密钥管理功能存储

2. **网络要求**
   - 需要能访问 `coding.dashscope.aliyuncs.com`
   - 建议使用国内服务器或配置代理

3. **费用**
   - 百炼 API 按使用量计费
   - 查看：https://help.aliyun.com/zh/model-studio/pricing

4. **兼容性**
   - TinyAGI v0.0.13+
   - Node.js v18+

---

## 🐛 故障排除

### 问题：API Key 无效

```
错误：百炼 API 错误 (401): Invalid API key
```

**解决：**
1. 检查 API Key 格式是否正确（应以 `sk-sp-` 开头）
2. 确认 API Key 未过期
3. 重新运行配置命令

### 问题：连接超时

```
错误：请求超时 (60000ms)
```

**解决：**
1. 检查网络连接
2. 确认能访问百炼 API 端点
3. 增加超时配置

### 问题：插件未加载

```
错误：Provider 'bailian' not found
```

**解决：**
1. 确认插件已正确安装
2. 运行 `tinyagi plugin list` 查看已加载插件
3. 重启 TinyAGI

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 🔗 相关链接

- [TinyAGI 官方文档](https://github.com/TinyAGI/tinyagi)
- [阿里云百炼文档](https://help.aliyun.com/zh/model-studio/)
- [OpenAI 兼容 API 参考](https://help.aliyun.com/zh/model-studio/developer-reference/openai-compatible)
- [问题反馈](https://github.com/moon214/tinyagifennzhi/issues)

---

## 🙏 致谢

- TinyAGI/TinyClaw 团队 - 提供优秀的多智能体框架
- 阿里云 - 提供百炼平台和 Qwen 模型
