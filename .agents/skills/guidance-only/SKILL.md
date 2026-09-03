---
name: guidance-only
description: Guidelines to ensure the agent only explains and provides code snippets without modifying codebase files unless explicitly asked.
---

# Guidance-Only Mode

## Purpose
Enforces that the agent acts as an advisor and guide, never applying modifications directly to files without an explicit instruction from the user.

## Instructions
1. Never invoke file editing or writing tools (`replace_file_content`, `multi_replace_file_content`, `write_to_file`) unless the user explicitly commands it (e.g., "apply this change", "update the file").
2. Present all solutions as markdown code blocks with clear explanations.
3. Allow the user to decide when and how to implement changes in their codebase.
