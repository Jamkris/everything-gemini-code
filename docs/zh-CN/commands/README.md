**Language:** [English](../../en/commands/README.md) | [한국어](../../ko-KR/commands/README.md) | **简体中文**

# Gemini CLI Extension Commands (中文)

`everything-gemini-code` 提供的命令列表。

| 命令               | 描述                                                                                                         |
| ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `/egc-build-fix`       | 分析构建错误并使用 `build-error-resolver` 代理自动修复。                                                       |
| `/egc-checkpoint`      | 暂存所有更改并使用 AI 生成的消息提交。                                                                          |
| `/egc-code-review`     | 使用 `code-reviewer` 代理对当前更改进行全面代码审查。                                                           |
| `/egc-e2e`             | 使用 Playwright 生成并运行端到端测试。                                                                          |
| `/egc-plan`        | 重述需求、评估风险并制定分步实施计划。(别名: `/everything-gemini-code:plan`)                                      |
| `/egc-docs`        | 通过 Context7 查找库或主题的最新文档。(别名: `/everything-gemini-code:docs`)                                     |
| `/egc-eval`            | 管理 eval 驱动的开发工作流。                                                                                    |
| `/egc-evolve`          | 将相关直觉聚类为技能、命令或代理。                                                                               |
| `/egc-go-build`        | 逐步修复 Go 构建错误、go vet 警告和 linter 问题。                                                               |
| `/egc-go-review`       | 全面的 Go 代码审查 — 惯用模式、并发安全、错误处理、安全性。                                                       |
| `/egc-go-test`         | Go TDD 工作流。先编写表驱动测试，再实现代码。                                                                    |
| `/egc-instinct-export` | 将学习的直觉导出到文件。                                                                                        |
| `/egc-instinct-import` | 从文件或其他来源导入直觉。                                                                                      |
| `/egc-instinct-status` | 显示所有已学习直觉及其置信度。                                                                                   |
| `/egc-learn`           | 从当前会话中提取可重用模式。                                                                                     |
| `/egc-multi-backend`   | 后端专注的多代理工作流。                                                                                        |
| `/egc-multi-execute`   | 使用多个专业代理执行多阶段计划。                                                                                 |
| `/egc-multi-frontend`  | 前端专注的多代理工作流。                                                                                        |
| `/egc-multi-plan`      | 使用多个代理创建全面的实施计划。                                                                                 |
| `/egc-multi-workflow`  | 多模型协作开发工作流。                                                                                          |
| `/egc-orchestrate`     | 复杂多步骤任务的高级编排。                                                                                      |
| `/egc-pm2`             | 自动分析项目并生成 PM2 服务命令。                                                                                |
| `/egc-python-review`   | PEP 8、类型提示和安全性的全面 Python 代码审查。                                                                  |
| `/egc-refactor-clean`  | 识别并删除死代码、未使用的导入和遗留工件。                                                                        |
| `/egc-sessions`        | 管理和列出活动的 Gemini 会话。                                                                                  |
| `/egc-setup-pm`        | 配置首选包管理器（npm/pnpm/yarn/bun）。                                                                         |
| `/egc-skill-create`    | 分析本地 git 历史以提取编码模式并生成 `SKILL.md` 文件。                                                          |
| `/egc-tdd`             | 实施测试驱动开发工作流。                                                                                        |
| `/egc-test-coverage`   | 分析当前测试覆盖率并建议改进方法。                                                                               |
| `/egc-update-codemaps` | 刷新代码库映射以确保代理拥有最新上下文。                                                                          |
| `/egc-update-docs`     | 根据最近的代码更改更新文档。                                                                                     |
| `/egc-verify`          | 运行完整验证套件（lint、构建、测试）。                                                                            |
