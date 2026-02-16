# Railway Form Demo — Full-Stack Monorepo

Full-stack registration form where **one schema** drives types, validation, and error handling on both client and server.

Built with [`@railway-ts/pipelines`](https://github.com/sakobu/railway-ts-pipelines) + [`@railway-ts/use-form`](https://github.com/sakobu/railway-ts-use-form).

## Structure

```
├── shared/              # Schema — single source of truth
│   └── schema.ts
├── server/              # Express API (tsx)
│   └── src/index.ts
├── client/              # Vite + React + TypeScript
│   └── src/
│       ├── components/  # Reusable UI primitives
│       │   ├── Button.tsx
│       │   ├── CheckboxGroup.tsx
│       │   ├── ErrorMessage.tsx
│       │   ├── Input.tsx
│       │   ├── Label.tsx
│       │   └── index.ts
│       ├── App.tsx
│       ├── GuidePanel.tsx
│       ├── main.tsx
│       ├── RegistrationForm.tsx
│       └── styles.css
└── package.json         # npm workspaces root
```

## Run locally

```bash
npm install
npm run dev          # starts server (:3001) + client (:5173) concurrently
```
