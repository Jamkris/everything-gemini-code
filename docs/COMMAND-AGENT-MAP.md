# Command ↔ Agent Map

Quick reference for which agents are invoked by each command.

| Command | Agent Used | Description |
|---------|------------|-------------|
| `/plan` | planner | Feature implementation planning |
| `/tdd` | tdd-guide | Test-driven development |
| `/code-review` | code-reviewer | Code quality review |
| `/build-fix` | build-error-resolver | Fix build errors |
| `/e2e` | e2e-runner | E2E test generation |
| `/refactor-clean` | refactor-cleaner | Dead code removal |
| `/update-docs` | doc-updater | Documentation sync |
| `/verify` | — | Runs verification loop skill |
| `/eval` | — | Evaluation against criteria |
| `/go-build` | go-build-resolver | Go build error resolution |
| `/go-review` | go-reviewer | Go code review |
| `/go-test` | — | Go TDD workflow |
| `/python-review` | python-reviewer | Python code review |
| `/kotlin-build` | kotlin-build-resolver | Kotlin build errors |
| `/kotlin-review` | kotlin-reviewer | Kotlin code review |
| `/rust-build` | rust-build-resolver | Rust build errors |
| `/rust-review` | rust-reviewer | Rust code review |
| `/cpp-build` | cpp-build-resolver | C++ build errors |
| `/cpp-review` | cpp-reviewer | C++ code review |
| `/orchestrate` | — | Multi-agent coordination |
| `/multi-plan` | planner | Multi-agent task decomposition |
| `/sessions` | — | Session history management |
| `/skill-create` | — | Generate skills from git history |
| `/learn` | — | Extract patterns from session |
| `/evolve` | — | Cluster instincts into skills |
| `/checkpoint` | — | Save verification state |

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
