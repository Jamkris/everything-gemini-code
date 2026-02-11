# Gemini CLI Extension Commands

List of available commands provided by `everything-gemini-code`.

| Command            | Description                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/build-fix`       | Analyze build errors and attempt to fix them automatically using the `build-error-resolver` agent.                                               |
| `/checkpoint`      | Stage all changes and commit them with an AI-generated message.                                                                                  |
| `/code-review`     | comprehensive code review of the current changes or specific files using the `code-reviewer` agent.                                              |
| `/e2e`             | Generate and run end-to-end tests with Playwright. Creates test journeys, runs tests, captures screenshots/videos/traces, and uploads artifacts. |
| `/eval`            | Execute a code snippet or evaluate an expression within the current context.                                                                     |
| `/evolve`          | Cluster related instincts into skills, commands, or agents.                                                                                      |
| `/go-build`        | Fix Go build errors, go vet warnings, and linter issues incrementally. Invokes the `go-build-resolver` agent.                                    |
| `/go-review`       | Comprehensive Go code review for idiomatic patterns, concurrency safety, error handling, and security. Invokes the `go-reviewer` agent.          |
| `/go-test`         | Enforce TDD workflow for Go. Write table-driven tests first, then implement. Verify 80%+ coverage.                                               |
| `/instinct-export` | Export learned instincts to a file for sharing with teammates or other projects.                                                                 |
| `/instinct-import` | Import instincts from a file or another source.                                                                                                  |
| `/instinct-status` | Show all currently learned instincts with their usage counts and confidence levels.                                                              |
| `/learn`           | Explicitly teach the agent about a new pattern or preference ("instinct").                                                                       |
| `/multi-backend`   | Initiate a multi-agent workflow focused on backend development.                                                                                  |
| `/multi-execute`   | Execute a multi-phase plan using multiple specialized agents in parallel or sequence.                                                            |
| `/multi-frontend`  | Initiate a multi-agent workflow focused on frontend development.                                                                                 |
| `/multi-plan`      | Create a comprehensive implementation plan using the `planner` agent, breaking down tasks for multiple agents.                                   |
| `/multi-workflow`  | specific workflow steps using multiple agents.                                                                                                   |
| `/orchestrate`     | High-level orchestration command to manage complex, multi-step tasks across the codebase.                                                        |
| `/plan`            | Restate requirements, assess risks, and create step-by-step implementation plan. Waits for user confirmation before proceeding.                  |
| `/pm2`             | Auto-analyze project and generate PM2 service configuration (`ecosystem.config.cjs`) and management commands.                                    |
| `/python-review`   | Comprehensive Python code review for PEP 8 compliance, type hints, security, and Pythonic idioms. Invokes the `python-reviewer` agent.           |
| `/refactor-clean`  | Identify and remove dead code, unused imports, and legacy artifacts.                                                                             |
| `/sessions`        | Manage and list active Gemini sessions.                                                                                                          |
| `/setup-pm`        | Configure your preferred package manager (npm/pnpm/yarn/bun) for the project.                                                                    |
| `/skill-create`    | Analyze local git history to extract coding patterns and generate `SKILL.md` files.                                                              |
| `/tdd`             | Enforce test-driven development workflow. Scaffold interfaces, generate tests FIRST, then implement minimal code to pass.                        |
| `/test-coverage`   | Analyze current test coverage and suggest tests to improve it.                                                                                   |
| `/update-codemaps` | Refresh the codebase maps (AST/dependency graphs) to ensure the agent has the latest context.                                                    |
| `/update-docs`     | specific documentation files based on recent code changes.                                                                                       |
| `/verify`          | Run a full verification suite (lint, build, test) to ensure project health.                                                                      |
