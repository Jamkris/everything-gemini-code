## Summary

<!-- One or two sentences. What changed and why. -->

## Type

<!-- Check one or more -->

- [ ] feat — new agent / skill / command / hook
- [ ] fix — bug fix
- [ ] refactor — non-behavioral cleanup
- [ ] docs — documentation only
- [ ] chore — tooling, CI, dependency bumps
- [ ] breaking — changes a command name, agent tool list, or hook contract

## Test plan

<!-- How did you verify this? Check what you ran. -->

- [ ] `npm run lint` clean
- [ ] `npm test` passes
- [ ] `node scripts/ci/validate-agents.js` passes (if touching `agents/`)
- [ ] `node scripts/ci/validate-commands.js` passes (if touching `commands/`)
- [ ] Manual smoke test in Gemini CLI / Antigravity (describe below)

<!-- Describe any manual testing here. -->

## Related

<!-- Closes #N, refs #N, links to discussion. Delete if none. -->
