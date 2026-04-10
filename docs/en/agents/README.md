# Agent Reference

Specialized subagents for Gemini CLI. Invoke with `@agent-name` syntax.

**Language:** English | [한국어](../ko-KR/agents/README.md)

---

## Core Agents

| Agent | Description | When to Use |
|-------|-------------|-------------|
| [planner](planner.md) | Implementation planning for complex features | Before starting any feature |
| [architect](architect.md) | System design and technical decisions | Architecture decisions, large refactors |
| [tdd-guide](tdd-guide.md) | Test-driven development workflow | New features, bug fixes |
| [code-reviewer](code-reviewer.md) | Code quality, security, maintainability | After writing or modifying code |
| [security-reviewer](security-reviewer.md) | Vulnerability analysis | Before commits, pre-production |

## Build Error Resolvers

| Agent | Description |
|-------|-------------|
| [build-error-resolver](build-error-resolver.md) | TypeScript/Node.js build errors |
| [go-build-resolver](go-build-resolver.md) | Go build errors |
| [cpp-build-resolver](cpp-build-resolver.md) | C++ CMake/compilation errors |
| [java-build-resolver](java-build-resolver.md) | Java/Maven/Gradle errors |
| [kotlin-build-resolver](kotlin-build-resolver.md) | Kotlin/Gradle errors |
| [rust-build-resolver](rust-build-resolver.md) | Rust compilation errors |
| [pytorch-build-resolver](pytorch-build-resolver.md) | PyTorch/CUDA training errors |

## Code Reviewers

| Agent | Description |
|-------|-------------|
| [go-reviewer](go-reviewer.md) | Go idioms, concurrency, error handling |
| [python-reviewer](python-reviewer.md) | Python code quality and safety |
| [typescript-reviewer](typescript-reviewer.md) | TypeScript/JavaScript type safety |
| [java-reviewer](java-reviewer.md) | Java/Spring Boot best practices |
| [kotlin-reviewer](kotlin-reviewer.md) | Kotlin/Android/KMP code |
| [rust-reviewer](rust-reviewer.md) | Rust memory safety, ownership |
| [cpp-reviewer](cpp-reviewer.md) | C++ memory safety, modern idioms |
| [database-reviewer](database-reviewer.md) | SQL queries, indexes, RLS |
| [flutter-reviewer](flutter-reviewer.md) | Flutter/Dart code review |
| [csharp-reviewer](csharp-reviewer.md) | C# .NET conventions, async, nullable |
| [dart-build-resolver](dart-build-resolver.md) | Dart/Flutter build errors |

## Analysis Agents

| Agent | Description |
|-------|-------------|
| [code-architect](code-architect.md) | Feature architecture and implementation blueprints |
| [code-explorer](code-explorer.md) | Codebase analysis and pattern discovery |
| [code-simplifier](code-simplifier.md) | Code clarity and refactoring |
| [comment-analyzer](comment-analyzer.md) | PR comment and conversation analysis |
| [conversation-analyzer](conversation-analyzer.md) | Session behavior analysis for hooks |
| [performance-optimizer](performance-optimizer.md) | Performance profiling and optimization |
| [silent-failure-hunter](silent-failure-hunter.md) | Hidden error and silent failure detection |
| [type-design-analyzer](type-design-analyzer.md) | Type system design review |
| [pr-test-analyzer](pr-test-analyzer.md) | PR test coverage analysis |

## GAN Harness Agents

| Agent | Description |
|-------|-------------|
| [gan-evaluator](gan-evaluator.md) | GAN harness evaluator agent |
| [gan-generator](gan-generator.md) | GAN harness generator agent |
| [gan-planner](gan-planner.md) | GAN harness planning agent |

## Open Source Agents

| Agent | Description |
|-------|-------------|
| [opensource-forker](opensource-forker.md) | Fork and sanitize repos for open source |
| [opensource-packager](opensource-packager.md) | Generate open-source packaging |
| [opensource-sanitizer](opensource-sanitizer.md) | Strip secrets and sensitive data |

## Workflow Agents

| Agent | Description |
|-------|-------------|
| [e2e-runner](e2e-runner.md) | Playwright E2E test generation and execution |
| [refactor-cleaner](refactor-cleaner.md) | Dead code cleanup |
| [doc-updater](doc-updater.md) | Documentation sync and updates |
| [docs-lookup](docs-lookup.md) | Documentation and API reference lookup |

## Specialized Agents

| Agent | Description |
|-------|-------------|
| [chief-of-staff](chief-of-staff.md) | Multi-channel communication management |
| [loop-operator](loop-operator.md) | Autonomous loop execution |
| [harness-optimizer](harness-optimizer.md) | Agent harness configuration tuning |
| [healthcare-reviewer](healthcare-reviewer.md) | Healthcare/HIPAA compliance review |
| [seo-specialist](seo-specialist.md) | SEO analysis and optimization |

---

## Gemini CLI Tool Names

Agents in Everything Gemini Code use Gemini CLI tool names:

| Tool | Description |
|------|-------------|
| `read_file` | Read file contents |
| `write_file` | Write to files |
| `replace_in_file` | Edit file content |
| `run_shell_command` | Execute shell commands |
| `search_files` | Search/grep in files |
| `list_directory` | List directory contents |
| `google_web_search` | Web search |
