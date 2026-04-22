# Command ↔ Agent Map

Quick reference for which agents are invoked by each command.

| Command | Agent Used | Description |
|---------|------------|-------------|
| `/egc-plan` | planner | Feature implementation planning |
| `/egc-tdd` | tdd-guide | Test-driven development |
| `/egc-code-review` | code-reviewer | Code quality review |
| `/egc-build-fix` | build-error-resolver | Fix build errors |
| `/egc-e2e` | e2e-runner | E2E test generation |
| `/egc-refactor-clean` | refactor-cleaner | Dead code removal |
| `/egc-update-docs` | doc-updater | Documentation sync |
| `/egc-verify` | — | Runs verification loop skill |
| `/egc-eval` | — | Evaluation against criteria |
| `/egc-go-build` | go-build-resolver | Go build error resolution |
| `/egc-go-review` | go-reviewer | Go code review |
| `/egc-go-test` | — | Go TDD workflow |
| `/egc-python-review` | python-reviewer | Python code review |
| `/egc-kotlin-build` | kotlin-build-resolver | Kotlin build errors |
| `/egc-kotlin-review` | kotlin-reviewer | Kotlin code review |
| `/egc-rust-build` | rust-build-resolver | Rust build errors |
| `/egc-rust-review` | rust-reviewer | Rust code review |
| `/egc-cpp-build` | cpp-build-resolver | C++ build errors |
| `/egc-cpp-review` | cpp-reviewer | C++ code review |
| `/egc-orchestrate` | — | Multi-agent coordination |
| `/egc-multi-plan` | planner | Multi-agent task decomposition |
| `/egc-sessions` | — | Session history management |
| `/egc-skill-create` | — | Generate skills from git history |
| `/egc-learn` | — | Extract patterns from session |
| `/egc-evolve` | — | Cluster instincts into skills |
| `/egc-checkpoint` | — | Save verification state |

---

## Direct Agent Invocation

For agents without a dedicated command, invoke directly:

```bash
@security-reviewer "Audit this file for vulnerabilities"
@architect "Design a microservices system for..."
@typescript-reviewer "Review this TypeScript code"
@database-reviewer "Check these SQL queries"
@chief-of-staff "Triage my emails"
@loop-operator "Run the verification loop"
```
