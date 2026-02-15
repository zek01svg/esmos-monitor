# 🖥️ ESMOS Monitor

## ℹ️ Overview

**ESMOS Monitor** is a specialized monitoring application designed to ensure the reliability and user experience of the **Everyday Sustainable Meals Ordering System (ESMOS)** platform.

While our current monitoring strategy relies on **Better Stack Uptime** for availability checks and **Azure Alerts** for infrastructure health, this application fills a critical gap by providing **End-to-End (E2E) UI verification**. It actively simulates user interactions to ensure that key user journeys—from landing page navigation to functional elements—are performing as expected in the production environment.

## ✨ Features

- **E2E UI Verification**: Uses [Playwright](https://playwright.dev/) to test the actual user interface, ensuring elements like navigation, buttons, and forms are visible and functional.
- **Error Tracking**: Uses the [Sentry SDK](https://sentry.io/) to capture and report test failures to Better Stack Errors and uploads screenshots to [Supabase Storage](https://supabase.com/storage).
- **Structured Logging**: Uses [Pino](https://github.com/pinojs/pino) for high-performance, structured logging, integrated with Better Stack Logs.
- **Modern Stack**: Built with [Bun](https://bun.sh/) and [Hono](https://hono.dev/) for speed and efficiency.

## 🛠️ Tech Stack

- **Runtime**: [Bun](https://bun.sh/)
- **Framework**: [Hono](https://hono.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Testing**: [Playwright](https://playwright.dev/)
- **Error Tracking**: [Sentry](https://sentry.io/)
- **Logging**: [Pino](https://getpino.io/)
- **Tracking**: [Better Stack](https://betterstack.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Storage**: [Supabase](https://supabase.com/)

## ✅ Prerequisites

- **Bun (>= 1.3.0)**: This project uses Bun as the runtime and script runner.
- **pnpm (>= 10.20.0)**: The project uses `pnpm` for dependency management.

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```
    _Note: While `bun` is used for scripts, `pnpm` is the package manager defined in `package.json`._

## ⚙️ Configuration

The application requires environment variables to be set. Create a `.env` file in the root directory based on the following schema (see `server/env.ts` for details):

```env
# Server Configuration
NODE_ENV=development # or production
PORT=3000
APP_URL=http://localhost:3000

# Better Stack Integration
BETTER_STACK_ERROR_DSN=your_dsn_here
BETTER_STACK_ERROR_TOKEN=your_token_here
BETTER_STACK_LOGS_DSN=your_logs_dsn_here
BETTER_STACK_LOGS_TOKEN=your_logs_token_here

# Supabase Integration
SUPABASE_URL=your_supabase_url
SUPABASE_SECRET_KEY=your_supabase_key

# Target Application URL (for Playwright)
# Defined in playwright.config.ts or overridden via env if supported
```

## 🚀 Usage

### Development

To start the Hono server in development mode with hot reloading:

```bash
bun run dev
```

### Production Build

To build the application for production:

```bash
bun run build
```

To start the production server:

```bash
bun run start
```

### Running E2E Tests

To execute the Playwright End-to-End tests against the configured target:

```bash
bun run load-env -- bun x playwright test
```

## 🧪 Testing Strategy

The E2E tests are located in `server/tests/e2e` and focus on validating the critical paths of the ESMOS application:

- **Homepage**: Verifies title, URL, and hero section content.
- **Navigation**: Checks for the existence and functionality of the top menu, including "Sign in" and "Cart".
- **Content Sections**: Validates the visibility of "Your Meal, Your Way", statistics, and other visual blocks.
- **Footer**: Ensures all footer links, contact information, and social media icons are present.

Failed tests automatically capture screenshots and report errors to the configured monitoring services.
