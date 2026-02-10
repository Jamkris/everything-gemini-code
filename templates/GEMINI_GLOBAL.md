# Gemini CLI Global Context

## Agent Orchestration

### Available Agents

Located in `~/.gemini/agents/`:

| Agent                | Purpose                 | When to Use                   |
| -------------------- | ----------------------- | ----------------------------- |
| planner              | Implementation planning | Complex features, refactoring |
| architect            | System design           | Architectural decisions       |
| tdd-guide            | Test-driven development | New features, bug fixes       |
| code-reviewer        | Code review             | After writing code            |
| security-reviewer    | Security analysis       | Before commits                |
| build-error-resolver | Fix build errors        | When build fails              |
| e2e-runner           | E2E testing             | Critical user flows           |
| refactor-cleaner     | Dead code cleanup       | Code maintenance              |
| doc-updater          | Documentation           | Updating docs                 |

### Immediate Agent Usage

No user prompt needed:

1. Complex feature requests - Use **planner** agent
2. Code just written/modified - Use **code-reviewer** agent
3. Bug fix or new feature - Use **tdd-guide** agent
4. Architectural decision - Use **architect** agent

### Parallel Task Execution

ALWAYS use parallel Task execution for independent operations.

## Coding Style (General)

### Immutability (CRITICAL)

ALWAYS create new objects, NEVER mutate existing ones.
Rationale: Immutable data prevents hidden side effects, makes debugging easier, and enables safe concurrency.

### File Organization

MANY SMALL FILES > FEW LARGE FILES:

- High cohesion, low coupling
- 200-400 lines typical, 800 max
- Extract utilities from large modules
- Organize by feature/domain, not by type

### Error Handling

ALWAYS handle errors comprehensively:

- Handle errors explicitly at every level
- Provide user-friendly error messages in UI-facing code
- Log detailed error context on the server side
- Never silently swallow errors

### Input Validation

ALWAYS validate at system boundaries:

- Validate all user input before processing
- Use schema-based validation where available
- Fail fast with clear error messages
- Never trust external data (API responses, user input, file content)

### Code Quality Checklist

Before marking work complete:

- [ ] Code is readable and well-named
- [ ] Functions are small (<50 lines)
- [ ] Files are focused (<800 lines)
- [ ] No deep nesting (>4 levels)
- [ ] Proper error handling
- [ ] No hardcoded values (use constants or config)
- [ ] No mutation (immutable patterns used)

## Security

### Secret Management

NEVER commit secrets to git.

- Use `.env` files (gitignored)
- Use environment variables
- Use secret management services (Vault, AWS Secrets Manager)

### Input Sanitization

Prevent Injection Attacks:

- SQL Injection: Use parameterized queries/ORMs
- XSS: Escape user input in HTML/JS
- Command Injection: Avoid `eval`, `exec` with user input

### Authentication & Authorization

- Use strong password hashing (Argon2, bcrypt)
- Implement proper session management
- Verify ownership of resources before access (IDOR check)
- Use HTTPS everywhere

## Testing Strategy

### TDD Workflow

1. Write a failing test
2. Write minimal code to pass
3. Refactor

### Coverage Goals

- Unit Tests: 80%+
- Integration Tests: Critical paths
- E2E Tests: Main user flows

### Test Principles

- Tests must be independent
- Tests must be deterministic
- Mock external dependencies in unit tests
- Use descriptive test names
