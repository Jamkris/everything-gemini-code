#!/usr/bin/env node
/**
 * Validate hooks.json schema
 */

const path = require('path');
const { validateJsonFile } = require('../lib/validator');

const VALID_EVENTS = [
  'BeforeTool', 'AfterTool', 'BeforeAgent', 'AfterAgent',
  'BeforeModel', 'AfterModel', 'SessionStart', 'SessionEnd', 'PreCompress'
];

function validateHookEntry(hook, prefix) {
  const errors = [];
  if (!hook.type || typeof hook.type !== 'string') {
    errors.push(`${prefix} missing or invalid 'type' field`);
  }
  if (!hook.command || (typeof hook.command !== 'string' && !Array.isArray(hook.command))) {
    errors.push(`${prefix} missing or invalid 'command' field`);
  }
  return errors;
}

function validateMatchers(matchers, eventType) {
  const errors = [];
  for (let i = 0; i < matchers.length; i++) {
    const matcher = matchers[i];
    if (typeof matcher !== 'object' || matcher === null) {
      errors.push(`${eventType}[${i}] is not an object`);
      continue;
    }
    if (!matcher.matcher) {
      errors.push(`${eventType}[${i}] missing 'matcher' field`);
    }
    if (!matcher.hooks || !Array.isArray(matcher.hooks)) {
      errors.push(`${eventType}[${i}] missing 'hooks' array`);
    } else {
      for (let j = 0; j < matcher.hooks.length; j++) {
        errors.push(...validateHookEntry(matcher.hooks[j], `${eventType}[${i}].hooks[${j}]`));
      }
    }
  }
  return errors;
}

validateJsonFile({
  file: path.join(__dirname, '../../hooks/hooks.json'),
  label: 'hook matchers',
  validate(data) {
    const hooks = data.hooks || data;
    const errors = [];
    let count = 0;

    if (typeof hooks === 'object' && !Array.isArray(hooks)) {
      for (const [eventType, matchers] of Object.entries(hooks)) {
        if (!VALID_EVENTS.includes(eventType)) {
          errors.push(`Invalid event type: ${eventType}`);
          continue;
        }
        if (!Array.isArray(matchers)) {
          errors.push(`${eventType} must be an array`);
          continue;
        }
        errors.push(...validateMatchers(matchers, eventType));
        count += matchers.length;
      }
    } else if (Array.isArray(hooks)) {
      for (let i = 0; i < hooks.length; i++) {
        const hook = hooks[i];
        if (!hook.matcher) {
          errors.push(`Hook ${i} missing 'matcher' field`);
        }
        if (!hook.hooks || !Array.isArray(hook.hooks)) {
          errors.push(`Hook ${i} missing 'hooks' array`);
        } else {
          for (let j = 0; j < hook.hooks.length; j++) {
            errors.push(...validateHookEntry(hook.hooks[j], `Hook ${i}.hooks[${j}]`));
          }
        }
        count++;
      }
    } else {
      errors.push('hooks.json must be an object or array');
    }

    return { errors, count };
  }
});
