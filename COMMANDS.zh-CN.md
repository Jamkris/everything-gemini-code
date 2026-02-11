# Gemini CLI Extension Commands (中文)

`everything-gemini-code` 提供命令列表。

| 命令               | 描述                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `/build-fix`       | 分析构建错误并尝试使用 `build-error-resolver` 代理自动修复。                                                 |
| `/checkpoint`      | 暂存所有更改并使用 AI 生成的消息提交。                                                                       |
| `/code-review`     | 使用 `code-reviewer` 代理对当前更改或特定文件进行全面的代码审查。                                            |
| `/e2e`             | 使用 Playwright 生成并运行端到端测试。创建测试旅程，运行测试，捕获屏幕截图/视频/跟踪，并上传工件。           |
| `/eval`            | 在当前上下文中执行代码片段或评估表达式。                                                                     |
| `/evolve`          | 将相关的本能聚类为技能、命令或代理。                                                                         |
| `/go-build`        | 逐步修复 Go 构建错误、vet 警告和 linter 问题。调用 `go-build-resolver` 代理。                                |
| `/go-review`       | 针对惯用模式、并发安全性、错误处理和安全性进行全面的 Go 代码审查。调用 `go-reviewer` 代理。                  |
| `/go-test`         | 强制执行 Go 的 TDD 工作流。首先编写表驱动测试，然后实现。验证 80%+ 的覆盖率。                                |
| `/instinct-export` | 将学习到的本能导出到文件，以便与队友或其他项目共享。                                                         |
| `/instinct-import` | 从文件或其他来源导入本能。                                                                                   |
| `/instinct-status` | 显示所有当前学习到的本能及其使用次数和置信度水平。                                                           |
| `/learn`           | 明确地教授代理新的模式或偏好（“本能”）。                                                                     |
| `/multi-backend`   | 启动专注于后端开发的多代理工作流。                                                                           |
| `/multi-execute`   | 并行或按顺序使用多个专用代理执行多阶段计划。                                                                 |
| `/multi-frontend`  | 启动专注于前端开发的多代理工作流。                                                                           |
| `/multi-plan`      | 使用 `planner` 代理制定全面的实施计划，为多个代理分解任务。                                                  |
| `/multi-workflow`  | 使用多个代理的特定工作流步骤。                                                                               |
| `/orchestrate`     | 用于管理代码库中复杂的、多步骤任务的高级编排命令。                                                           |
| `/plan`            | 重述需求，评估风险，并制定分步实施计划。在继续之前等待用户确认。                                             |
| `/pm2`             | 自动分析项目并生成 PM2 服务配置 (`ecosystem.config.cjs`) 和管理命令。                                        |
| `/python-review`   | 针对 PEP 8 合规性、类型提示、安全性和 Pythonic 习语进行全面的 Python 代码审查。调用 `python-reviewer` 代理。 |
| `/refactor-clean`  | 识别并删除死代码、未使用的导入和遗留工件。                                                                   |
| `/sessions`        | 管理和列出活动的 Gemini 会话。                                                                               |
| `/setup-pm`        | 为项目配置首选的包管理器 (npm/pnpm/yarn/bun)。                                                               |
| `/skill-create`    | 分析本地 git 历史记录以提取编码模式并生成 `SKILL.md` 文件。                                                  |
| `/tdd`             | 强制执行测试驱动开发工作流。搭建接口，首先生成测试，然后实现最少的代码以通过测试。                           |
| `/test-coverage`   | 分析当前的测试覆盖率并建议改进测试。                                                                         |
| `/update-codemaps` | 刷新代码库映射（AST/依赖图），以确保代理具有最新的上下文。                                                   |
| `/update-docs`     | 根据最近的代码更改更新特定文档文件。                                                                         |
| `/verify`          | 运行完整的验证套件（lint、构建、测试）以确保项目健康。                                                       |
