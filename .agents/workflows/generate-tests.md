# Workflow: Generate Tests

> **Trigger:** When a developer says "generate tests for [file]" or "write unit tests".

## Instructions for the Agent

You are writing tests for the **Own Store** project. Read the target file, understand its purpose, and generate comprehensive tests.

---

## Step 1 — Read Context
- Read `.agents/rules/production-standards.md`
- Read `.ai-context/test_cases.md` for existing scenarios to avoid duplication
- Read the target file fully before writing any tests

## Step 2 — Test Stack
- **Unit tests:** Jest + `@testing-library/react` for components
- **API route tests:** Jest + `node-mocks-http` or `msw`
- **Mongoose model tests:** Jest + `mongodb-memory-server`
- Test files go in `/tests/` mirroring the `src/` structure

## Step 3 — Required Coverage

### For API Routes
- [ ] Happy path (200 response)
- [ ] Missing required fields (400)
- [ ] Unauthorized access (401/403)
- [ ] Database error handling (500)
- [ ] Invalid data types (Zod validation rejection)

### For Components
- [ ] Renders without crashing
- [ ] Shows correct content from props
- [ ] Handles loading state
- [ ] Handles error state
- [ ] Interactive elements fire correct callbacks

### For Utility Functions (`lib/`)
- [ ] All branches covered
- [ ] Edge cases (empty string, null, undefined)
- [ ] Error cases

## Step 4 — Test File Template

```ts
// tests/[path]/[ComponentName].test.ts
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("[ComponentName]", () => {
  describe("Rendering", () => {
    it("renders without crashing", () => {});
    it("displays correct content", () => {});
  });

  describe("Interactions", () => {
    it("handles user action correctly", () => {});
  });

  describe("Error states", () => {
    it("shows error message on failure", () => {});
  });
});
```

## Step 5 — After Generating Tests
1. Append new test scenarios to `.ai-context/test_cases.md`
2. Log the action in `.ai-context/prompt_history.md`
