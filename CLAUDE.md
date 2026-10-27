# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

A Playwright Test (`@playwright/test`, TypeScript) project. There is no application code: tests in `tests/` drive external sites directly (currently `https://playwright.dev/`). No `baseURL` or `webServer` is configured, so tests use absolute URLs in `page.goto()`.

`package.json` has no npm scripts; run everything through `npx playwright`.

## Commands

```bash
npx playwright test                                   # all tests, all 3 browsers (chromium, firefox, webkit)
npx playwright test --project=chromium                # one browser
npx playwright test tests/example.spec.ts             # one file
npx playwright test tests/example.spec.ts:3           # test at a specific line
npx playwright test -g "has title"                    # by test title
npx playwright test --ui                              # interactive UI mode
npx playwright test --debug                           # step through with the inspector
npx playwright show-report                            # open the HTML report from the last run
npx playwright codegen https://playwright.dev/        # record a new test
npx playwright install                                # install browser binaries
```

There is no lint or typecheck step configured; Playwright transpiles TypeScript itself (no `tsconfig.json`).

## Configuration notes (`playwright.config.ts`)

- `headless: false` is set globally, so browser windows open on every run.
- The existing tests end with `await page.pause()`, which halts execution waiting for the Playwright Inspector. Running them non-interactively (e.g. from Claude Code) will hang until timeout — remove the `pause()` calls or run with `--headed`/`--debug` interactively when you need them.
- Behavior changes when `CI` is set: `forbidOnly` is enforced, retries go to 2, and workers drop to 1. Locally: no retries, default parallel workers, `fullyParallel: true`.
- Reporter is `html` (output in `playwright-report/`); traces are captured only `on-first-retry`, so locally (0 retries) no traces are recorded unless you pass `--trace on`.
- Artifacts go to `test-results/` and `playwright-report/` (both gitignored).
