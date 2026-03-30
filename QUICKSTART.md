# 快速开始指南 🚀

> 5 分钟让你的 TinyAGI 使用阿里云百炼 Qwen 模型

---

## 📋 前置要求

- ✅ TinyAGI 已安装并运行
- ✅ Node.js v18+
- ✅ 阿里云百炼 API Key（[获取方式](#获取-api-key)）

---

## 步骤 1：安装插件

### 方式 A：一键安装

```bash
curl -fsSL https://raw.githubusercontent.com/moon214/tinyagifennzhi/main/scripts/install.sh | bash
```

### 方式 B：手动安装

```bash
# 1. 克隆仓库
git clone https://github.com/moon214/tinyagifennzhi.git
cd tinyagifennzhi

# 2. 安装依赖
npm install

# 3. 安装到 TinyAGI
tinyagi plugin install .
```

---

## 步骤 2：配置 API Key

### 方式 A：交互式配置（推荐）

```bash
tinyagi provider pair bailian
```

按提示输入：
1. API Key: `sk-sp-xxxxxxxxxxxxxxxxxxxxxxxx`
2. 基础 URL: 直接回车（使用默认）
3. 模型：选择 `qwen3.5-plus`（推荐）

### 方式 B：手动配置

编辑 `~/.tinyagi/settings.json`:

```json
{
  "providers": {
    "bailian": {
      "apiKey": "sk-sp-你的 API Key"
    }
  }
}
```

---

## 步骤 3：测试连接

```bash
tinyagi run test_bailian_connection
```

预期输出：
```
✅ 百炼 API 连接正常！

模型：qwen3.5-plus
回复：你好！我是阿里云百炼的 Qwen 模型...
```

---

## 步骤 4：开始使用

```bash
# 启动 TinyAGI（如果未运行）
tinyagi start

# 发送消息
tinyagi chat "你好，请用 Python 写一个快速排序"
```

---

## 步骤 5：设置为默认 Provider（可选）

编辑 `~/.tinyagi/settings.json`:

```json
{
  "routing": {
    "tierMapping": {
      "complex": "bailian",
      "reasoning": "bailian",
      "simple": "bailian"
    }
  }
}
```

---

## 获取 API Key

### 1. 访问百炼控制台

https://bailian.console.aliyun.com/

### 2. 开通服务

- 登录阿里云账号
- 进入百炼控制台
- 开通"模型服务"

### 3. 创建 API Key

- 进入"API-KEY 管理"
- 点击"创建新的 API-KEY"
- 复制 Key（格式：`sk-sp-xxxxxxxx`）

### 4. 查看额度

- 新用户有免费额度
- 查看：https://help.aliyun.com/zh/model-studio/pricing

---

## 常见问题

### Q: 安装后插件未加载？

```bash
# 检查插件列表
tinyagi plugin list

# 重启 TinyAGI
tinyagi stop
tinyagi start
```

### Q: API Key 无效？

- 确认 Key 以 `sk-sp-` 开头
- 检查是否过期
- 重新创建新的 Key

### Q: 连接超时？

- 检查服务器网络
- 确认能访问 `coding.dashscope.aliyuncs.com`
- 国内服务器速度更快

---

## 下一步

- 📖 查看 [完整文档](README.md)
- 🐛 遇到问题？[提交 Issue](https://github.com/moon214/tinyagifennzhi/issues)
- 💬 讨论：[TinyAGI Discord](https://discord.gg/jH6AcEChuD)

---

祝你使用愉快！🦞
