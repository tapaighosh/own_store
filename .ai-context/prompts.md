# Quick Prompts Reference

> Copy-paste these into the agent chat for fast access to common tasks.

---

## 🔍 Research / Explain

```
Explain how the theme system works in this project. 
Reference .ai-context/architecture.md for context.
```

```
What is the registration lock mechanism and where is it implemented?
```

```
Summarize the current state of Phase [X] based on the project files.
```

---

## 🛠️ Build Prompts (reference README.md for full module prompts)

See `README.md` → "Module Build Prompts" section for the complete, sequential prompts for each phase and module.

---

## 🔄 Workflow Triggers

**Code Review:**
```
Follow .agents/workflows/code-review.md to review: [path/to/file.tsx]
```

**Generate Tests:**
```
Follow .agents/workflows/generate-tests.md to write tests for: [path/to/file.ts]
```

---

## 🐛 Debug Prompts

```
I'm getting this error: [paste error]. 
The file is at [path]. 
Reference .ai-context/architecture.md for the expected behavior.
```

```
The [feature] is not working as expected. 
Expected: [describe expected behavior]
Actual: [describe what's happening]
Check [path/to/file] first.
```

---

## 🧹 Maintenance Prompts

```
Audit all admin API routes for missing authentication guards. 
Follow .agents/rules/production-standards.md security rules.
```

```
Check all Mongoose models for missing indexes per .ai-context/architecture.md.
```

```
Find all useEffect calls that should be useLayoutEffect for GSAP animations.
```
