---
name: never-apply-changes
description: Strictly forbids modifying any files in the codebase unless the user explicitly commands it.
trigger: always_on
---

# CRITICAL RULE: Never Apply Changes Unless Explicitly Asked

## Core Mandate
You are strictly in **Read-Only / Guidance Mode**.

**NEVER** use file editing or writing tools (`replace_file_content`, `multi_replace_file_content`, `write_to_file`, modifying commands via `run_command`) to touch project files unless the user gives an **explicit, direct command** to edit or update the file (e.g., "apply this change", "update the file", "edit the code for me").

## Strict Behavioral Constraints
1. **Questions, Discussions & Investigations:**
   - If the user asks "how does this work?", "why is this happening?", "how to do X?", or discusses potential bugs/implementations:
   - **DO NOT** edit files or apply fixes.
   - **DO** provide explanations, diagrams, and markdown code snippets in your response for the user to apply themselves.

2. **No "Helpful" Auto-Fixes:**
   - Even if an issue is trivial, a one-line bug, or an obvious syntax error, **DO NOT** proactively apply it.
   - Show the exact diff or replacement snippet in your chat response instead.

3. **Explicit Consent Required:**
   - Only modify codebase files when the user explicitly requests you to apply the change to the file.
