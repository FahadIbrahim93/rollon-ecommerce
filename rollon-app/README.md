<div align="center">
  <h1>RollON E-Commerce Platform</h1>
  <p><strong>A state-of-the-art, high-performance e-commerce frontend built for 2026.</strong></p>

  [![React 19](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=black)](#)
  [![Vite 7](https://img.shields.io/badge/Vite-7.3.1-646CFF?logo=vite&logoColor=white)](#)
  [![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.2.1-38B2AC?logo=tailwind-css&logoColor=white)](#)
  [![Zustand 5](https://img.shields.io/badge/Zustand-5.0.11-8C5A3E)](#)
  [![TypeScript](https://img.shields.io/badge/TypeScript-%7E5.9.3-3178C6?logo=typescript&logoColor=white)](#)
</div>

<br/>

## 🌟 At a Glance
RollON is a state-of-the-art e-commerce storefront designed to showcase modern web capabilities. It delivers a hyper-responsive, interactive shopping experience with seamless state management, robust form validation, and accessible UI components.

Designed as a premier portfolio piece, RollON demonstrates clean architecture, test-driven development, and cutting-edge React ecosystem patterns.

### ✨ Key Features
- **Ultra-Fast Performance:** Powered by React 19 and Vite 7 for blazing-fast page loads and optimized rendering.
- **Premium Aesthetics:** Styled with the newly released Tailwind CSS v4, featuring glassmorphism, fluid layouts, and dark mode support.
- **Fluid Animations:** Complex scroll-driven animations, micro-interactions, and layout transitions via Framer Motion 12.
- **Bulletproof State:** Client-side cart and user state managed elegantly by Zustand 5, with persistent local storage caching.
- **Robust Forms:** Checkout and user forms handled by React Hook Form v7 and strictly validated using Zod v4 schemas.
- **Accessible Primitives:** Fully keyboard navigable and screen-reader compliant UI components built on top of Radix UI.
- **Data Caching:** Advanced asynchronous data fetching perfectly synced using TanStack React Query v5.
- **Battle-Tested:** Comprehensive unit and integration testing suite using Vitest 4, React Testing Library, and Playwright.

---

## 🛠️ Tech Stack Architecture

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Core UI** | React 19.2 | Component rendering and concurrency |
| **Routing** | React Router 7 | Client-side navigation |
| **Styling** | Tailwind CSS 4 | Utility-first styling & design tokens |
| **Components** | Radix UI | Unstyled, accessible component primitives |
| **State** | Zustand 5 | Global client-side state (Cart, User Auth) |
| **Data Fetching** | React Query 5 | Async state management & caching |
| **Forms** | React Hook Form + Zod | Form state and strict schema validation |
| **Animations** | Framer Motion 12 | Route transitions and micro-interactions |
| **Tooling** | Vite 7, TypeScript 5.9 | Blazing fast HMR and type safety |
| **Testing** | Vitest 4, Playwright | Unit, DOM, and End-to-End coverage |

---

## 🚀 Getting Started

Follow these steps to run the RollON storefront locally.

### Prerequisites
- Node.js (v20+ recommended)
- npm or pnpm

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/rollon-app.git
cd rollon-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Copy the example environment file and update it if necessary:
```bash
cp .env.example .env
```
*(The defaults are sufficient for local development mocking)*

### 4. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

---

## 🧪 Testing

RollON includes an exhaustive testing suite ensuring stability across the shopping experience.

```bash
# Run unit & component tests using Vitest
npm run test

# Run tests with UI dashboard
npm run test -- --ui

# Check code coverage
npm run test:coverage

# Run End-to-End browser tests
npx playwright test
```

---

## 📁 Project Structure Highlights

```text
rollon-app/
├── src/
│   ├── components/       # Reusable composed UI blocks
│   │   └── ui/           # Base Radix primitives (buttons, dialogs)
│   ├── pages/            # React Router page views
│   ├── store/            # Zustand global stores (cartStore, authStore)
│   ├── context/          # React context providers
│   ├── lib/              # Core utilities (cn, formatting)
│   ├── data/             # Mock data / API handlers
│   └── types.ts          # Central type definitions
├── __tests__/            # Test suite separated by feature
├── .env                  # Environment config
├── eslint.config.js      # Strict linting rules
└── tailwind.config.ts    # Tailwind 4 configuration
```

---

<div align="center">
  <p>Built as a portfolio showcase project.</p>
</div>
