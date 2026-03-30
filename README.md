# RollON - Premium E-Commerce Platform

A production-ready e-commerce storefront with admin dashboard built with React 19, TypeScript, Vite, and Tailwind CSS.

![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?style=flat&logo=vite)
![Tailwind](https://img.shields.io/badge/Tailwind-4.2-38B2AC?style=flat&logo=tailwind-css)

## Live Demo

**Storefront:** [rollon-premium-smoking.vercel.app](https://rollon-premium-smoking.vercel.app)

**Admin Dashboard:** `/admin`  
Email: `admin@rollon.com`  
Password: `admin123`

## Features

- Full shopping cart with Zustand state management
- Admin dashboard with product, order, and customer management
- Analytics and reporting
- JWT authentication (simulated)
- Form validation with Zod
- Premium dark theme UI
- WCAG 2.1 AA Accessible
- Responsive design
- Payment gateway integration (SSLCommerz, bKash)

## Tech Stack

| Category | Technology |
|----------|------------|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand |
| Forms | React Hook Form + Zod |
| Routing | React Router v7 |
| Testing | Vitest + React Testing Library |
| Database | Upstash Redis (serverless API) |

## Project Structure

```
rollon-showcase/
├── rollon-app/          # Frontend (React e-commerce)
├── api/                 # Serverless API (products, orders, customers)
├── docs/                # Documentation
└── vercel.json          # Deployment configuration
```

## Quick Start

```bash
# Frontend
cd rollon-app
npm install
npm run dev

# Or build for production
npm run build
```

## Quality Gates

```bash
npm run lint      # ESLint + TypeScript
npm test -- --run # Run tests
npm run build     # Production build
```

## License

Proprietary - All rights reserved
