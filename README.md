# 🛡️ ESMOS Monitor

## ℹ️ Overview

**ESMOS Monitor** is a specialized monitoring application designed to ensure the reliability and user experience of the **Everyday Sustainable Meals Ordering System (ESMOS)** platform.

While G8T1's current monitoring strategy relies on **[Better Stack Uptime](https://betterstack.com/uptime)** for availability checks and **[Azure Alerts](https://azure.microsoft.com/en-us/products/monitor/alerts)** for infrastructure health, this application fills a critical gap by providing **End-to-End (E2E) UI verification**. It actively simulates user interactions to ensure that key user journeys—from landing page navigation to functional elements—are performing as expected in the production environment.

## ✨ Features

- **E2E UI Verification**: Uses [Playwright](https://playwright.dev/) to test the actual user interface, ensuring elements like navigation, buttons, and forms are visible and functional.
- **Error Tracking**: Uses the [Sentry SDK](https://sentry.io/) to capture and report test failures to [Better Stack Errors](https://betterstack.com/errors) and uploads screenshots to [Supabase Storage](https://supabase.com/storage).
- **Structured Logging**: Uses [Pino](https://getpino.io/) for high-performance, structured logging, integrated with [Better Stack Logs](https://betterstack.com/logs).

## 🛠️ Tech Stack

- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Testing**: [Playwright](https://playwright.dev/)
- **Error Tracking**: [Sentry](https://sentry.io/)
- **Logging**: [Pino](https://getpino.io/)
- **Tracking**: [Better Stack](https://betterstack.com/)
- **Validation**: [Zod](https://zod.dev/) and [T3 Env](https://env.t3.gg/)
- **Storage**: [Supabase](https://supabase.com/)

## ✅ Prerequisites

- **Node.js (>= 22.14.0)**: Playwright uses Node.js as its runtime by default.
- **pnpm (>= 10.20.0)**: The project uses `pnpm` for dependency management.

## 📦 Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install --frozen-lockfile
    ```

## ⚙️ Configuration

The application requires environment variables to be set. Run the following command to create a `.env` file in the root directory and populate the variables.

```bash
cp .env.example .env
```

## 🚀 Usage

### Development (Local)

To run tests locally:

```bash
pnpm run test:dev
```

### Production

To build image for production and/or run tests in a container:

```bash
pnpm run build:docker
docker run --env-file .env esmos-monitor
```

## 🧪 Testing Strategy

The E2E tests are located in `server/tests/e2e` and provide comprehensive coverage of the user journey, ensuring critical functionalities are operational.

### 🏠 Homepage (`homepage.test.ts`)

- **Navigation & Header**: Verifies logo, main menu links, "Sign in" button, search modal, and cart icon.
- **Hero Section**: Checks for correct headlines, subtext, and call-to-action buttons.
- **Feature Blocks**: Validates visibility of "Your Meal, Your Way" section and statistical numbers.
- **Footer**: Ensures integrity of "Useful Links", "About us", contact details, social media links, and copyright notices.

### 🔐 Authentication (`login.test.ts`)

- **Login Flow**: Verifies navigation to the login page and form existence.
- **Multi-Role Support**: Validates successful login for key roles: System Configurator, Product Manager, Data Manager, Security Manager, and Support Manager.
- **Redirection**: Ensures users are correctly redirected to the Odoo backend upon successful login.

### 🛍️ Shop (`shop.test.ts`)

- **Product Grid**: Verifies the display of the product grid, ensuring exactly 10 items are shown.
- **Product Details**: Iterates through all products (e.g., "Low Carb Meal Plan", "Superfood Boost") to verify that clicking them opens the correct detail page with accurate names and prices.
- **Search & Sort**: Checks for the existence of the search bar and sorting options.

### 📞 Contact Us (`contact.test.ts`)

- **Form Validation**: Tests both successful submission and error handling for empty/invalid inputs.
- **Information Accuracy**: Verifies sidebar contact details (Phone, Email, Company).
- **Navigation**: Ensures smooth navigation from the homepage to the contact section.

### 🛠️ Services (`services.test.ts`)

- **Content Verification**: Validates service highlights like "Fresh Ingredients" and "Seasonal Specials".
- **Interactive Elements**: Checks the functionality of the quotes carousel.
- **Social Proof**: Verifies the presence of the "Happy Customers" section.

## 🛡️ Monitoring Strategy

If any test fails, it will automatically capture a screenshot and report the error to the configured monitoring services.

- **Better Stack Errors**: Reports the error to Better Stack Errors.
- **Better Stack Logs**: Logs the error to Better Stack Logs.
- **Supabase Storage**: Uploads the screenshot to Supabase Storage.

## 🏗️ Execution Architecture

The monitor runs as an **Azure Container App Job** every 10 minutes.

- **VM Status Check**: Before running tests, the job executes a "pre-flight" check (`server/services/check-vm.ts`) to verify if the target Azure VM is running.
  - If the VM is **Running**: Tests proceed.
  - If the VM is **Stopped/Deallocated**: The job exits successfully (skipping tests) to conserve resources and avoid false alerts.

## 🚀 CI/CD

A GitHub Actions workflow (`.github/workflows/deploy.yml`) handles deployment:

1.  **Trigger**: Pushes to `main`.
2.  **Build**: Builds the Docker image.
3.  **Push**: Pushes the image to Azure Container Registry (ACR).
4.  **Deploy**: Updates the Azure Container App Job with the new image.
5.  **Authentication**: Uses **OpenID Connect (OIDC)** with Azure Managed Identity for secure, keyless access.
