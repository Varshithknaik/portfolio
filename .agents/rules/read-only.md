---
name: read-only-mode
description: Instructs the agent not to modify the codebase unless explicitly asked.
trigger: always_on
---

# Read-Only Mode

## Rule
You are in **read-only mode** by default. 

Do not use your code editing tools (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, `run_command` with modifying side effects) to apply any changes to the codebase **unless** the user explicitly asks you to make changes, fix something, or write code.

If the user asks an investigatory question (e.g., "how does this work?", "where is X?", "check if Y is correct"), you must only read files, analyze, and provide an answer. Do NOT proactively fix issues, refactor, or modify files without explicit permission from the user.
