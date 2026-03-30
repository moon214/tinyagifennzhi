#!/bin/bash
#
# TinyAGI 百炼 Provider 插件安装脚本
# 
# 用法：curl -fsSL <script-url> | bash
#

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🦞 TinyAGI 百炼 Provider 插件安装程序${NC}"
echo "=========================================="

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 错误：未找到 Node.js${NC}"
    echo "请先安装 Node.js v18+: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ 错误：Node.js 版本过低 (v$NODE_VERSION)${NC}"
    echo "请升级到 Node.js v18+"
    exit 1
fi

echo -e "${GREEN}✓ Node.js 版本：$(node -v)${NC}"

# 检查 npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ 错误：未找到 npm${NC}"
    exit 1
fi

echo -e "${GREEN}✓ npm 版本：$(npm -v)${NC}"

# 检查 TinyAGI
if ! command -v tinyagi &> /dev/null; then
    echo -e "${YELLOW}⚠ 警告：未找到 TinyAGI${NC}"
    echo "TinyAGI 未安装或不在 PATH 中"
    echo ""
    echo "请先安装 TinyAGI:"
    echo "  curl -fsSL https://raw.githubusercontent.com/TinyAGI/tinyagi/main/scripts/remote-install.sh | bash"
    echo ""
    read -p "是否继续安装插件？(y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ TinyAGI: $(which tinyagi)${NC}"

# 检查 tmux
if ! command -v tmux &> /dev/null; then
    echo -e "${YELLOW}⚠ 警告：未找到 tmux${NC}"
    echo "TinyAGI 需要 tmux 运行"
fi

# 创建安装目录
INSTALL_DIR="$HOME/.tinyagi/plugins/bailian-provider"
echo ""
echo -e "${BLUE}📦 安装目录：${INSTALL_DIR}${NC}"

mkdir -p "$INSTALL_DIR"

# 下载插件
echo ""
echo -e "${BLUE}📥 下载插件...${NC}"

PLUGIN_REPO="https://github.com/moon214/tinyagifennzhi.git"
TEMP_DIR=$(mktemp -d)

git clone "$PLUGIN_REPO" "$TEMP_DIR" || {
    echo -e "${RED}❌ 克隆仓库失败${NC}"
    echo "请检查网络连接或手动下载："
    echo "  $PLUGIN_REPO"
    exit 1
}

# 复制文件
cp -r "$TEMP_DIR"/* "$INSTALL_DIR/"
rm -rf "$TEMP_DIR"

# 安装依赖
echo ""
echo -e "${BLUE}🔧 安装依赖...${NC}"
cd "$INSTALL_DIR"
npm install --production

# 安装插件到 TinyAGI
if command -v tinyagi &> /dev/null; then
    echo ""
    echo -e "${BLUE}🔌 注册插件到 TinyAGI...${NC}"
    tinyagi plugin install "$INSTALL_DIR" || {
        echo -e "${YELLOW}⚠ 插件注册失败，可手动运行：${NC}"
        echo "  tinyagi plugin install $INSTALL_DIR"
    }
fi

# 完成
echo ""
echo -e "${GREEN}✅ 安装完成！${NC}"
echo ""
echo "=========================================="
echo "📝 下一步配置："
echo ""
echo "1. 启动 TinyAGI (如果未运行):"
echo "   ${BLUE}tinyagi start${NC}"
echo ""
echo "2. 配置百炼 API Key:"
echo "   ${BLUE}tinyagi provider pair bailian${NC}"
echo ""
echo "3. 或手动编辑配置文件:"
echo "   ${BLUE}~/.tinyagi/settings.json${NC}"
echo ""
echo "4. 测试连接:"
echo "   ${BLUE}tinyagi provider test bailian${NC}"
echo ""
echo "=========================================="
echo "📖 文档：https://github.com/moon214/tinyagifennzhi"
echo "=========================================="
