# LMS Frontend (Vite + React + TypeScript)

Modern client for the Learning Management System.

## Tech Stack & Versions
- Node.js: 18.x (LTS)
- Vite: 5.x
- React: 18.x + TypeScript
- State: Redux Toolkit (planned) / built-in slices in `src/store`
- UI: custom components (can integrate MUI/Tailwind later)

## Project Structure
```
lms-frontend/
├─ index.html
├─ src/
│  ├─ main.tsx            # App bootstrap
│  ├─ App.tsx             # Routes/layout
│  ├─ components/         # UI components (Client/Home, shared)
│  ├─ pages/              # Screens (client/admin)
│  ├─ services/           # api.ts, authService.ts
│  ├─ store/              # Redux slices (auth, course, ui, ...)
│  ├─ styles/             # CSS
│  └─ Layout/             # Header/Footer/Layout
└─ public/
```

## Setup
### Install
```bash
npm install
```

### Environment
Create `.env` in `lms-frontend/`:
```
VITE_API_BASE_URL=http://localhost:4000
VITE_SOCKET_URL=http://localhost:4000
```
- Only variables prefixed with `VITE_` are exposed at build time.
- For production, set `VITE_API_BASE_URL` to your API domain.

### Development
```bash
npm run dev
```
- Default URL: `http://localhost:5173`

### Build & Preview
```bash
npm run build
npm run preview
```

## API Integration
- Axios client configured in `src/services/api.ts` using `VITE_API_BASE_URL`.
- Auth helpers in `src/services/authService.ts`.
- Keep response envelope consistent with backend (`{ success, data|error }`).

## Routing & Guards
- Client/admin routes in `App.tsx` and `src/pages/*`.
- Route guard: `components/common/ProtectedRoute.tsx`.

## State Management
- Redux slices in `src/store/*` (auth, course, ui...).
- Consider adding TanStack Query for server caching.

## Coding Standards
- TypeScript strict, typed props and API responses
- Component folder by feature, reusable atoms/molecules/organisms
- Loading/empty/error states for all async views
- Responsive (mobile-first), basic accessibility

## Troubleshooting
- Browser CORS error: ensure backend `CORS_ORIGIN` includes `http://localhost:5173`.
- 404 on refresh with client routing: configure hosting to fallback to `index.html`.
- Wrong API base URL: check `.env` and `VITE_API_BASE_URL` at build time.

## Roadmap
- UI library (MUI/Tailwind), i18n, dark mode
- Error boundaries, Suspense-based code splitting
- E2E tests with Cypress / Playwright
