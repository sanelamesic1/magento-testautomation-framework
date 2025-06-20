# Luma Test Automation Framework

## Overview
This repository contains a **Playwright-based test automation framework** for testing Luma e-commerce applications. It supports UI testing, login validation, wishlist operations, and overall checkout workflows. Designed for **scalability, maintainability, and efficient debugging**, the framework ensures comprehensive test coverage.

## Features
✅ **Playwright for UI Automation**  
✅ **Modular Page Object Model (POM) structure**  
✅ **Parameterized test execution with dynamic data**  
✅ **Error handling & retry mechanisms**  
✅ **CI/CD integration via GitHub Actions**  
✅ **Reusable utility functions**  

## Installation
1. Clone the repository:
```
   git clone https://github.com/sanelamesic1/magento-testautomation-framework.git
   cd magento-testautomation-framework
```
2. Install dependencies and playwright:
```
  npm install
  npx playwright install --with-deps
```

## Configuration
### Environment Variables (.env)
This project requires sensitive credentials to be set via .env or GitHub Secrets. Example .env file:

```
USERNAME=your_test_user
PASSWORD=your_test_password
```
Important: .env is git ignored to avoid exposing sensitive data. For local run create .env file in root project folder.

## Running Tests
Run all tests
```
npx playwright test
```

Run tests by tag (e.g., smoke)
```
npx playwright test --grep @smoke
```

Headless Execution
```
npx playwright test --headless
```

Generate Playwright Report
```
npx playwright show-report
```
Run one specific test file (e.g.)
```
npx playwright test tests/shoppingCart.test.ts
```

## Test Structure
```/tests/ ``` → Contains Playwright test cases

```/pages/``` → Page Object Model (POM) structure for element handling.

```/utils/``` → Shared utilities (data setup, logging, API calls).

```/playwright.config.ts``` → Configuration for test execution.

### Test types
Test cases are split into smoke and regression suite with added tags in every test case.

### Test-plan
Under the folder ```test-plan``` there is a file with detail test cases for smoke and regression suite. 

## CI/CD Setup (GitHub Actions)
This framework integrates GitHub Actions for automated test execution on push/pull requests. 

If needed, under the [path](https://github.com/sanelamesic1/magento-testautomation-framework/actions/workflows/playwright.yml) user can manually execute pipeline too. 

### Workflow (.github/workflows/playwright.yml)

Under ```playwright.yml``` file is set up workflow for:
- Install dependencies & Playwright browsers
- Inject environment variables securely via GitHub Secrets
- Run Playwright tests on Ubuntu-latest
- Store Playwright reports for debugging as an output of workflow run. There is an artifact playwright-report that can be downloaded and results can be checked.

