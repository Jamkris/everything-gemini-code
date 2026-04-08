**Language:** **English** | [한국어](../../ko-KR/commands/README.md) | [简体中文](../../zh-CN/COMMANDS.md)

# Gemini CLI Extension Commands

List of available commands provided by `everything-gemini-code`.

| Command            | Description                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/build-fix`       | Analyze build errors and attempt to fix them automatically using the `build-error-resolver` agent.                                               |
| `/checkpoint`      | Stage all changes and commit them with an AI-generated message.                                                                                  |
| `/code-review`     | Comprehensive code review of the current changes or specific files using the `code-reviewer` agent.                                              |
| `/e2e`             | Generate and run end-to-end tests with Playwright.                                                                                               |
| `/ecc-plan`        | Restate requirements, assess risks, and create step-by-step implementation plan. (alias: `/everything-gemini-code:plan`)                         |
| `/ecc-docs`        | Look up current documentation for a library or topic via Context7. (alias: `/everything-gemini-code:docs`)                                       |
| `/eval`            | Manage eval-driven development workflow.                                                                                                         |
| `/evolve`          | Cluster related instincts into skills, commands, or agents.                                                                                      |
| `/go-build`        | Fix Go build errors, go vet warnings, and linter issues incrementally.                                                                           |
| `/go-review`       | Comprehensive Go code review for idiomatic patterns, concurrency safety, error handling, and security.                                           |
| `/go-test`         | Enforce TDD workflow for Go. Write table-driven tests first, then implement.                                                                     |
| `/instinct-export` | Export learned instincts to a file for sharing.                                                                                                  |
| `/instinct-import` | Import instincts from a file or another source.                                                                                                  |
| `/instinct-status` | Show all currently learned instincts with confidence levels.                                                                                     |
| `/learn`           | Extract reusable patterns from the current session.                                                                                              |
| `/multi-backend`   | Backend-focused multi-agent workflow.                                                                                                            |
| `/multi-execute`   | Execute a multi-phase plan using multiple specialized agents.                                                                                    |
| `/multi-frontend`  | Frontend-focused multi-agent workflow.                                                                                                           |
| `/multi-plan`      | Create a comprehensive implementation plan using multiple agents.                                                                                |
| `/multi-workflow`  | Multi-model collaborative development workflow.                                                                                                  |
| `/orchestrate`     | High-level orchestration for complex, multi-step tasks.                                                                                          |
| `/pm2`             | Auto-analyze project and generate PM2 service commands.                                                                                          |
| `/python-review`   | Comprehensive Python code review for PEP 8, type hints, and security.                                                                           |
| `/refactor-clean`  | Identify and remove dead code, unused imports, and legacy artifacts.                                                                             |
| `/sessions`        | Manage and list active Gemini sessions.                                                                                                          |
| `/setup-pm`        | Configure your preferred package manager (npm/pnpm/yarn/bun).                                                                                   |
| `/skill-create`    | Analyze local git history to extract coding patterns and generate `SKILL.md` files.                                                              |
| `/tdd`             | Enforce test-driven development workflow.                                                                                                        |
| `/test-coverage`   | Analyze current test coverage and suggest tests to improve it.                                                                                   |
| `/update-codemaps` | Refresh the codebase maps to ensure the agent has the latest context.                                                                            |
| `/update-docs`     | Update documentation files based on recent code changes.                                                                                         |
| `/verify`          | Run a full verification suite (lint, build, test).                                                                                               |

---

## Core Commands

### /ecc-plan

Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.

### /tdd

Enforce test-driven development workflow. Scaffold interfaces, generate tests FIRST, then implement minimal code to pass. Ensure 80%+ coverage.

### /code-review

Comprehensive security and quality review of uncommitted changes.

### /build-fix

Incrementally fix TypeScript and build errors.

### /refactor-clean

Safely identify and remove dead code with test verification.

### /e2e

Generate and run end-to-end tests with Playwright. Creates test journeys, runs tests, captures screenshots/videos/traces, and uploads artifacts.

---

## Multi-Agent Commands

### /multi-plan

Multi-model collaborative planning - Context retrieval + Dual-model analysis.

### /multi-execute

Multi-model collaborative execution - Get prototype from plan, refactor and implement, audit and deliver.

### /multi-backend

Backend-focused workflow (Research, Ideation, Plan, Execute, Optimize, Review).

### /multi-frontend

Frontend-focused workflow (Research, Ideation, Plan, Execute, Optimize, Review).

### /multi-workflow

Multi-model collaborative development workflow with intelligent routing: Frontend to Gemini, Backend to Codex.

### /orchestrate

Sequential agent workflow for complex tasks.

### /pm2

Auto-analyze project and generate PM2 service commands.

---

## Language-Specific Commands

### /go-build

Fix Go build errors, go vet warnings, and linter issues incrementally. Invokes the go-build-resolver agent.

### /go-review

Comprehensive Go code review for idiomatic patterns, concurrency safety, error handling, and security. Invokes the go-reviewer agent.

### /go-test

Enforce TDD workflow for Go. Write table-driven tests first, then implement. Verify 80%+ coverage.

### /python-review

Comprehensive Python code review for PEP 8 compliance, type hints, security, and Pythonic idioms. Invokes the python-reviewer agent.

### /kotlin-build, /kotlin-review, /kotlin-test

Kotlin build error resolution, code review, and TDD workflow.

### /cpp-build, /cpp-review, /cpp-test

C++ build error resolution, code review, and TDD workflow.

### /rust-build, /rust-review, /rust-test

Rust build error resolution, code review, and TDD workflow.

### /gradle-build

Fix Gradle/Android build errors and dependency issues.

---

## Learning & Evolution Commands

### /learn

Analyze the current session and extract any patterns worth saving as skills.

### /skill-create

Analyze local git history to extract coding patterns and generate SKILL.md files.

### /evolve

Cluster related instincts into skills, commands, or agents.

### /instinct-import, /instinct-export, /instinct-status

Import, export, and view learned instincts.

### /learn-eval

Extract reusable patterns with self-evaluation.

### /promote, /prune, /projects

Promote instincts to global scope, prune low-confidence instincts, list known projects.

---

## Utility Commands

### /setup-pm

Configure your preferred package manager (npm/pnpm/yarn/bun).

### /update-docs, /update-codemaps

Sync documentation and refresh codebase architecture maps.

### /verify, /checkpoint, /eval

Verification suite, workflow checkpoints, and eval-driven development.

### /sessions, /save-session, /resume-session

Session management - list, save, load, and alias sessions.

### /ecc-docs

Look up current documentation for a library or topic via Context7.

### /context-budget

Monitor and manage context window usage.

### /model-route

Route tasks to the optimal model based on complexity.
