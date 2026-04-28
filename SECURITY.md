# Security Policy

## Supported Versions

Only the latest minor release line receives security fixes. Older lines are not patched —
upgrade to the current `1.3.x` release.

| Version | Supported          |
| ------- | ------------------ |
| 1.3.x   | :white_check_mark: |
| < 1.3   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Everything Gemini Code, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Preferred channel: open a [GitHub private security advisory](https://github.com/Jamkris/everything-gemini-code/security/advisories/new).

Alternatively, email **<contact@jamkris.com>** with:

- A description of the vulnerability
- Steps to reproduce
- The affected version(s)
- Any potential impact assessment

You can expect:

- **Acknowledgment** within 48 hours
- **Status update** within 7 days
- **Fix or mitigation** within 30 days for critical issues

If the vulnerability is accepted, we will:

- Credit you in the release notes (unless you prefer anonymity)
- Fix the issue in a timely manner
- Coordinate disclosure timing with you

If the vulnerability is declined, we will explain why and provide guidance on whether it should be reported elsewhere.

## Scope

This policy covers:

- The EGC extension and all scripts in this repository
- Hook scripts that execute on your machine
- Install/uninstall lifecycle scripts
- MCP configurations shipped with EGC
- Command, skill, and agent definitions

## Security Resources

- **OWASP MCP Top 10**: [owasp.org/www-project-mcp-top-10](https://owasp.org/www-project-mcp-top-10/)
- **OWASP Agentic Applications Top 10**: [genai.owasp.org](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
