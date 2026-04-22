**Language:** **English** | [한국어](../../ko-KR/commands/README.md) | [简体中文](../../zh-CN/COMMANDS.md)

# Gemini CLI Extension Commands

List of available commands provided by `everything-gemini-code`.

| Command            | Description                                                                                                                                      |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/egc-agent-sort`      | Sort and organize agent configurations.                                                                                                          |
| `/egc-build-fix`       | Analyze build errors and attempt to fix them automatically using the `build-error-resolver` agent.                                               |
| `/egc-checkpoint`      | Stage all changes and commit them with an AI-generated message.                                                                                  |
| `/egc-code-review`     | Comprehensive code review of the current changes or specific files using the `code-reviewer` agent.                                              |
| `/egc-e2e`             | Generate and run end-to-end tests with Playwright.                                                                                               |
| `/egc-plan`        | Restate requirements, assess risks, and create step-by-step implementation plan. (alias: `/everything-gemini-code:plan`)                         |
| `/egc-docs`        | Look up current documentation for a library or topic via Context7. (alias: `/everything-gemini-code:docs`)                                       |
| `/egc-eval`            | Manage eval-driven development workflow.                                                                                                         |
| `/egc-evolve`          | Cluster related instincts into skills, commands, or agents.                                                                                      |
| `/egc-feature-dev`     | Guided feature development with codebase understanding.                                                                                          |
| `/egc-flutter-build`   | Fix Dart analyzer errors and Flutter build failures.                                                                                             |
| `/egc-flutter-review`  | Review Flutter/Dart code for idiomatic patterns.                                                                                                 |
| `/egc-flutter-test`    | Run Flutter/Dart tests and fix failures.                                                                                                         |
| `/egc-gan-build`       | GAN-style three-agent build loop.                                                                                                                |
| `/egc-gan-design`      | GAN-style design harness for frontend quality.                                                                                                   |
| `/egc-go-build`        | Fix Go build errors, go vet warnings, and linter issues incrementally.                                                                           |
| `/egc-go-review`       | Comprehensive Go code review for idiomatic patterns, concurrency safety, error handling, and security.                                           |
| `/egc-go-test`         | Enforce TDD workflow for Go. Write table-driven tests first, then implement.                                                                     |
| `/egc-hookify`         | Create hooks to prevent unwanted behaviors.                                                                                                      |
| `/egc-hookify-configure` | Enable or disable hookify rules.                                                                                                               |
| `/egc-hookify-help`    | Hookify system documentation.                                                                                                                    |
| `/egc-hookify-list`    | List configured hookify rules.                                                                                                                   |
| `/egc-instinct-export` | Export learned instincts to a file for sharing.                                                                                                  |
| `/egc-instinct-import` | Import instincts from a file or another source.                                                                                                  |
| `/egc-instinct-status` | Show all currently learned instincts with confidence levels.                                                                                     |
| `/egc-jira`            | Jira ticket integration.                                                                                                                         |
| `/egc-learn`           | Extract reusable patterns from the current session.                                                                                              |
| `/egc-multi-backend`   | Backend-focused multi-agent workflow.                                                                                                            |
| `/egc-multi-execute`   | Execute a multi-phase plan using multiple specialized agents.                                                                                    |
| `/egc-multi-frontend`  | Frontend-focused multi-agent workflow.                                                                                                           |
| `/egc-multi-plan`      | Create a comprehensive implementation plan using multiple agents.                                                                                |
| `/egc-multi-workflow`  | Multi-model collaborative development workflow.                                                                                                  |
| `/egc-orchestrate`     | High-level orchestration for complex, multi-step tasks.                                                                                          |
| `/egc-pm2`             | Auto-analyze project and generate PM2 service commands.                                                                                          |
| `/egc-prp-commit`      | Natural language commit targeting.                                                                                                               |
| `/egc-prp-implement`   | Execute implementation plans with validation.                                                                                                    |
| `/egc-prp-plan`        | Create implementation plans with codebase analysis.                                                                                              |
| `/egc-prp-pr`          | Create GitHub PRs from current branch.                                                                                                           |
| `/egc-prp-prd`         | Interactive PRD generator.                                                                                                                       |
| `/egc-python-review`   | Comprehensive Python code review for PEP 8, type hints, and security.                                                                           |
| `/egc-refactor-clean`  | Identify and remove dead code, unused imports, and legacy artifacts.                                                                             |
| `/egc-review-pr`       | Comprehensive multi-perspective PR review.                                                                                                       |
| `/egc-santa-loop`      | Adversarial dual-review convergence loop.                                                                                                        |
| `/egc-sessions`        | Manage and list active Gemini sessions.                                                                                                          |
| `/egc-setup-pm`        | Configure your preferred package manager (npm/pnpm/yarn/bun).                                                                                   |
| `/egc-skill-create`    | Analyze local git history to extract coding patterns and generate `SKILL.md` files.                                                              |
| `/egc-tdd`             | Enforce test-driven development workflow.                                                                                                        |
| `/egc-test-coverage`   | Analyze current test coverage and suggest tests to improve it.                                                                                   |
| `/egc-update-codemaps` | Refresh the codebase maps to ensure the agent has the latest context.                                                                            |
| `/egc-update-docs`     | Update documentation files based on recent code changes.                                                                                         |
| `/egc-verify`          | Run a full verification suite (lint, build, test).                                                                                               |

---

## Core Commands

### /egc-plan

Restate requirements, assess risks, and create step-by-step implementation plan. WAIT for user CONFIRM before touching any code.

### /egc-tdd

Enforce test-driven development workflow. Scaffold interfaces, generate tests FIRST, then implement minimal code to pass. Ensure 80%+ coverage.

### /egc-code-review

Comprehensive security and quality review of uncommitted changes.

### /egc-build-fix

Incrementally fix TypeScript and build errors.

### /egc-refactor-clean

Safely identify and remove dead code with test verification.

### /egc-e2e

Generate and run end-to-end tests with Playwright. Creates test journeys, runs tests, captures screenshots/videos/traces, and uploads artifacts.

---

## Multi-Agent Commands

### /egc-multi-plan

Multi-model collaborative planning - Context retrieval + Dual-model analysis.

### /egc-multi-execute

Multi-model collaborative execution - Get prototype from plan, refactor and implement, audit and deliver.

### /egc-multi-backend

Backend-focused workflow (Research, Ideation, Plan, Execute, Optimize, Review).

### /egc-multi-frontend

Frontend-focused workflow (Research, Ideation, Plan, Execute, Optimize, Review).

### /egc-multi-workflow

Multi-model collaborative development workflow with intelligent routing: Frontend to Gemini, Backend to Codex.

### /egc-orchestrate

Sequential agent workflow for complex tasks.

### /egc-pm2

Auto-analyze project and generate PM2 service commands.

---

## Language-Specific Commands

### /egc-go-build

Fix Go build errors, go vet warnings, and linter issues incrementally. Invokes the go-build-resolver agent.

### /egc-go-review

Comprehensive Go code review for idiomatic patterns, concurrency safety, error handling, and security. Invokes the go-reviewer agent.

### /egc-go-test

Enforce TDD workflow for Go. Write table-driven tests first, then implement. Verify 80%+ coverage.

### /egc-python-review

Comprehensive Python code review for PEP 8 compliance, type hints, security, and Pythonic idioms. Invokes the python-reviewer agent.

### /egc-kotlin-build, /egc-kotlin-review, /egc-kotlin-test

Kotlin build error resolution, code review, and TDD workflow.

### /egc-cpp-build, /egc-cpp-review, /egc-cpp-test

C++ build error resolution, code review, and TDD workflow.

### /egc-rust-build, /egc-rust-review, /egc-rust-test

Rust build error resolution, code review, and TDD workflow.

### /egc-gradle-build

Fix Gradle/Android build errors and dependency issues.

---

## Learning & Evolution Commands

### /egc-learn

Analyze the current session and extract any patterns worth saving as skills.

### /egc-skill-create

Analyze local git history to extract coding patterns and generate SKILL.md files.

### /egc-evolve

Cluster related instincts into skills, commands, or agents.

### /egc-instinct-import, /egc-instinct-export, /egc-instinct-status

Import, export, and view learned instincts.

### /egc-learn-eval

Extract reusable patterns with self-evaluation.

### /egc-promote, /egc-prune, /egc-projects

Promote instincts to global scope, prune low-confidence instincts, list known projects.

---

## Utility Commands

### /egc-setup-pm

Configure your preferred package manager (npm/pnpm/yarn/bun).

### /egc-update-docs, /egc-update-codemaps

Sync documentation and refresh codebase architecture maps.

### /egc-verify, /egc-checkpoint, /egc-eval

Verification suite, workflow checkpoints, and eval-driven development.

### /egc-sessions, /egc-save-session, /egc-resume-session

Session management - list, save, load, and alias sessions.

### /egc-docs

Look up current documentation for a library or topic via Context7.

### /egc-context-budget

Monitor and manage context window usage.

### /egc-model-route

Route tasks to the optimal model based on complexity.

---

## Feature Development

### /egc-feature-dev

Guided feature development workflow with codebase exploration, architecture design, and quality review.

### /egc-review-pr

Multi-perspective PR review using specialized agents (code-reviewer, comment-analyzer, pr-test-analyzer, etc.).

---

## GAN Harness

### /egc-gan-build

Three-agent adversarial build loop: planner, generator, evaluator iterate until quality threshold is met.

### /egc-gan-design

Design-focused GAN loop emphasizing visual excellence and creative breakthroughs.

---

## Hookify

### /egc-hookify, /egc-hookify-configure, /egc-hookify-list, /egc-hookify-help

Create, configure, list, and document behavior-prevention hooks.

---

## PRP (Plan-Review-Push)

### /egc-prp-prd, /egc-prp-plan, /egc-prp-implement, /egc-prp-commit, /egc-prp-pr

Full development pipeline: PRD → plan → implement → commit → PR.

---

## Flutter

### /egc-flutter-build, /egc-flutter-review, /egc-flutter-test

Flutter/Dart build error resolution, code review, and testing.
