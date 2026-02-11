# Gemini CLI Extension Verification Guide

This guide explains how to verify that the `everything-gemini-code` extension is installed correctly and working as expected.

## 1. Installation Verification

After running `gemini extensions install https://github.com/Jamkris/everything-gemini-code`, verify the following:

### Step 1: Check Extension Directory

Ensure the extension files are present:

```bash
ls ~/.gemini/extensions/everything-gemini-code
# Should list agents, skills, scripts, commands, etc.
```

### Step 2: Trigger Session Start (Important)

The extension automatically configures command aliases (shims) when a session starts.
If you just installed the extension, **you must start a session once** for this to happen.

Run any command to start a session:

```bash
gemini run "echo 'Initializing session...'"
```

You should see output similar to:

```
[SessionStart] Generating/Updating command shims for short aliases...
[SessionStart] Created/Updated shim: tdd.toml
...
```

### Step 3: Verify Command Shims

Check if the short commands (e.g., `/tdd`) are created and point to the extension:

```bash
cat ~/.gemini/commands/tdd.toml | grep "@everything-gemini-code"
```

**Expected Output:**

```
@everything-gemini-code.tdd-guide
```

If you see this, the shim is correctly configured.

## 2. Functionality Verification

### Test the `/tdd` Command

1. Start a Gemini session: `gemini`
2. Type `/tdd` and press Enter.
3. The prompt should load the **TDD Guide** agent from the extension.
4. Verify the agent name in the chat (it might show as "tdd-guide" or "everything-gemini-code.tdd-guide").

### Test Hooks

1. Create a dummy `.ts` file: `touch test.ts`
2. Gemini should trigger the `suggest-compact` or other hooks (visible in logs if enabled).
3. Check `~/.gemini/scripts/hooks/` - these should now attempt to load the extension's hooks.

## Troubleshooting

If `/tdd` command is missing or not working:

1. **Force Shim Regeneration:**
   Delete the existing shim and restart session:
   ```bash
   rm ~/.gemini/commands/tdd.toml
   gemini run "echo 'Regenerating...'"
   ```
2. **Check Logs:**
   Look for `[SessionStart]` errors in the output.

3. **Manual Install (Fallback):**
   If automatic setup fails, you can run the install script manually:
   ```bash
   cd ~/.gemini/extensions/everything-gemini-code
   ./install.sh --cli
   ```
