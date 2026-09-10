# CRM

A modern, scalable Customer Relationship Management system built with React, TypeScript, Express, and Node.js.

## Project Foundation

This is the initial foundation setup for the CRM project. The structure is designed to be modular, scalable, and ready for incremental development.

## Project Structure

```
CRM/
├── frontend/              # React + TypeScript + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/   # Reusable React components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API and business logic services
│   │   ├── hooks/        # Custom React hooks
│   │   ├── stores/       # State management (Zustand, Redux, etc.)
│   │   ├── types/        # TypeScript type definitions
│   │   ├── lib/          # Utility libraries and helpers
│   │   ├── main.tsx      # Application entry point
│   │   ├── App.tsx       # Root component
│   │   └── index.css     # Global styles with Tailwind CSS
│   ├── index.html        # HTML template
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── .eslintrc.cjs
├── backend/               # Express + TypeScript
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Express middleware
│   │   ├── models/       # Data models
│   │   ├── routes/       # API routes
│   │   ├── services/     # Business logic
│   │   ├── utils/        # Utility functions
│   │   ├── types/        # TypeScript types
│   │   └── server.ts     # Server entry point
│   ├── package.json
│   └── tsconfig.json
├── database/              # Database migrations and schema (TBD)
├── docs/                  # Documentation
├── .gitignore
├── .env.example          # Environment variables template
└── README.md
```

## Technology Stack

### Frontend
- **React** 18.3+ - UI library
- **TypeScript** 5.4+ - Type-safe JavaScript
- **Vite** 5.2+ - Fast build tool and dev server
- **Tailwind CSS** 3.4+ - Utility-first CSS framework
- **ESLint** 9.0+ - Code linting

### Backend
- **Node.js** 18+ - JavaScript runtime
- **Express** 4.19+ - Web framework
- **TypeScript** 5.4+ - Type-safe backend code

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

### Development

**Terminal 1 - Start Frontend Dev Server**
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`

**Terminal 2 - Start Backend Dev Server**
```bash
cd backend
npm run dev
```
The backend will be available at `http://localhost:3000`

### Building for Production

**Frontend**
```bash
cd frontend
npm run build
npm run preview  # Preview the build locally
```

**Backend**
```bash
cd backend
npm run build
npm run start
```

## API Endpoints

### Health Check
- `GET /api/health` - Verify that the CRM API is running

### Response Example
```json
{
  "status": "ok",
  "message": "CRM API is running",
  "timestamp": "2026-09-09T11:12:00.000Z"
}
```

## Type Checking

**Frontend**
```bash
cd frontend
npm run type-check
```

**Backend**
```bash
cd backend
npm run type-check
```

## Linting

**Frontend**
```bash
cd frontend
npm run lint
```

## Environment Variables

Copy `.env.example` to `.env` and update values as needed:
```bash
cp .env.example .env
```

## Next Steps

- [ ] Implement authentication system
- [ ] Design and implement database schema
- [ ] Create API routes and controllers
- [ ] Build core CRM features (contacts, companies, deals, etc.)
- [ ] Implement UI components and pages
- [ ] Add state management (Zustand/Redux)
- [ ] Set up testing framework
- [ ] Configure CI/CD pipeline
- [ ] Deploy to production

## Contributing

This is a foundation project. Follow the modular structure and TypeScript best practices when adding new features.

## License

MIT
