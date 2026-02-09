**Language:** [English](README.md) | [한국어](README.ko.md) | **简体中文**

# Everything Gemini Code

[![Stars](https://img.shields.io/github/stars/Jamkris/everything-gemini-code?style=flat)](https://github.com/Jamkris/everything-gemini-code/stargazers)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**适用于 Gemini CLI / Antigravity 的综合配置套件。**

该扩展提供了生产级的 Agents、Skills、Hooks、Commands、Rules 和 MCP 配置，旨在通过 Gemini 极大地增强您的开发工作流。

---

## 🚀 快速开始

只需两分钟即可完成设置：

### 选项 1：通过 Gemini CLI 安装（推荐）

```bash
# 直接从 GitHub 安装
gemini extensions install https://github.com/Jamkris/everything-gemini-code
```

### 选项 2：手动安装（高级）

如果您偏好手动控制或需要自定义特定组件：

```bash
# 克隆仓库
git clone https://github.com/Jamkris/everything-gemini-code.git

# 复制 Agents
cp everything-gemini-code/agents/*.md ~/.gemini/agents/

# 复制 Commands
cp everything-gemini-code/commands/*.md ~/.gemini/commands/

# 复制 Skills
cp -r everything-gemini-code/skills/* ~/.gemini/skills/

# 安装 Rules（两种安装方式均必需）
cp -r everything-gemini-code/rules/common/* ~/.gemini/rules/
```

> ⚠️ **注意：** Rules（规则）无法通过扩展自动分发，必须手动安装到 `~/.gemini/rules/` 目录。

---

## 💻 使用方法

安装完成后，您可以直接在 Gemini CLI 中使用这些新功能。

### 斜杠命令 (Slash Commands)

使用自定义命令自动化工作流：

```bash
# 规划功能实现
/plan "添加 JWT 用户认证"

# 开始 TDD 工作流
/tdd "创建用户服务"

# 运行代码审查
/code-review
```

### 智能体 (Agents)

将复杂任务委托给专用智能体：

```bash
# 使用架构师智能体进行系统设计
@architect "为...设计微服务架构"

# 使用安全审查员进行漏洞检查
@security-reviewer "审计此文件的注入漏洞"
```

### 技能 (Skills)

Gemini 会在与您的请求相关时自动利用已安装的技能，例如“TDD 工作流”或“后端模式”。

---

## 📦 包含内容

此扩展包含完整的开发环境配置：

```
everything-gemini-code/
├── gemini-extension.json  # 扩展清单
├── agents/                # 专用子智能体 (@planner, @architect 等)
├── skills/                # 工作流定义 (TDD, Patterns 等)
├── commands/              # 斜杠命令 (/plan, /tdd 等)
├── rules/                 # 编码指南 (TypeScript, Python, Go)
├── hooks/                 # 自动化触发器 (hooks.json)
└── mcp-configs/           # MCP 服务器配置
```

---

## 🤝 贡献

**欢迎贡献！**

如果您有有用的智能体、技能或配置，请提交 Pull Request。

---

## 📄 许可证

MIT - 自由使用和修改。
