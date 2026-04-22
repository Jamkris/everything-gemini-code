---
description: Retrieve a Jira ticket, analyze requirements, update status, or add comments. Uses the jira-integration skill and MCP or REST API.
---

# Jira Command

Interact with Jira tickets directly from your workflow — fetch tickets, analyze requirements, add comments, and transition status.

## Usage

```
/egc-jira get <TICKET-KEY>          # Fetch and analyze a ticket
/egc-jira comment <TICKET-KEY>      # Add a progress comment
/egc-jira transition <TICKET-KEY>   # Change ticket status
/egc-jira search <JQL>              # Search issues with JQL
```

## What This Command Does

1. **Get & Analyze** — Fetch a Jira ticket and extract requirements, acceptance criteria, test scenarios, and dependencies
2. **Comment** — Add structured progress updates to a ticket
3. **Transition** — Move a ticket through workflow states (To Do → In Progress → Done)
4. **Search** — Find issues using JQL queries

## How It Works

### `/egc-jira get <TICKET-KEY>`

1. Fetch the ticket from Jira (via MCP `jira_get_issue` or REST API)
2. Extract all fields: summary, description, acceptance criteria, priority, labels, linked issues
3. Optionally fetch comments for additional context
4. Produce a structured analysis:

```
Ticket: PROJ-1234
Summary: [title]
Status: [status]
Priority: [priority]
Type: [Story/Bug/Task]

Requirements:
1. [extracted requirement]
2. [extracted requirement]

Acceptance Criteria:
- [ ] [criterion from ticket]

Test Scenarios:
- Happy Path: [description]
- Error Case: [description]
- Edge Case: [description]

Dependencies:
- [linked issues, APIs, services]

Recommended Next Steps:
- /egc-plan to create implementation plan
- /egc-tdd to implement with tests first
```

### `/egc-jira comment <TICKET-KEY>`

1. Summarize current session progress (what was built, tested, committed)
2. Format as a structured comment
3. Post to the Jira ticket

### `/egc-jira transition <TICKET-KEY>`

1. Fetch available transitions for the ticket
2. Show options to user
3. Execute the selected transition

### `/egc-jira search <JQL>`

1. Execute the JQL query against Jira
2. Return a summary table of matching issues

## Prerequisites

This command requires Jira credentials. Choose one:

**Option A — MCP Server (recommended):**
Add `jira` to your `mcpServers` config (see `mcp-configs/mcp-servers.json` for the template).

**Option B — Environment variables:**
```bash
export JIRA_URL="https://yourorg.atlassian.net"
export JIRA_EMAIL="your.email@example.com"
export JIRA_API_TOKEN="your-api-token"
```

If credentials are missing, stop and direct the user to set them up.

## Integration with Other Commands

After analyzing a ticket:
- Use `/egc-plan` to create an implementation plan from the requirements
- Use `/egc-tdd` to implement with test-driven development
- Use `/egc-code-review` after implementation
- Use `/egc-jira comment` to post progress back to the ticket
- Use `/egc-jira transition` to move the ticket when work is complete

## Related

- **Skill:** `skills/jira-integration/`
- **MCP config:** `mcp-configs/mcp-servers.json` → `jira`
