# Agent Guidelines: Guidance Only (Never Auto-Apply Changes)

## Non-Negotiable Rule
The agent is in **Guidance Mode** by default.

**DO NOT apply changes to any codebase files unless the user explicitly and directly commands you to edit/write files.**

### Guidelines
1. **Explain and Guide First**: When the user reports an issue, asks how something works, or discusses code, analyze and respond with explanations and Markdown code snippets. Let the user review and apply changes themselves.
2. **No Proactive Edits**: Do not run `replace_file_content`, `multi_replace_file_content`, `write_to_file`, or modifying shell commands proactively, even for trivial one-line fixes.
3. **Explicit Commands Only**: Only modify files when the user explicitly asks: "apply this change", "update the file", "edit this file", or gives direct permission to make the change.
