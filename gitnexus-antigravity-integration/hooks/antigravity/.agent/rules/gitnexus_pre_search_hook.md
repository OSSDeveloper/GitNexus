# Rule: GitNexus Intelligent Search Augmentation

**Condition:** WHEN you are about to use `grep_search`, `find_by_name`, or `codebase_search` to understand code architecture or dependencies.

**Action:**
BEFORE executing the generic search tool:

1. Verify if GitNexus is indexing this repository by checking for the `gitnexus://repo/...` resources or calling `list_repos`.
2. INSTEAD of generic search, ALWAYS prioritize calling the GitNexus MCP `query` or `context` tools first if the goal is architectural understanding.
3. If you still must use `grep_search`, immediately follow up the findings with a GitNexus `impact()` or `context()` tool call on the discovered symbols to enrich the results with Relational Intelligence (call chains, process flows) before continuing your task.
