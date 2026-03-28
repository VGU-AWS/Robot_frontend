# Robot Frontend

A minimal Next.js 15 application configured with Tailwind CSS.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` - Start the development server.
- `npm run build` - Create a production build.
- `npm run start` - Run the production server.
- `npm run lint` - Run lint checks.

## Tailwind Setup

Tailwind is wired through:

- `tailwind.config.ts`
- `postcss.config.mjs`
- `src/app/globals.css`

If dependencies are missing in your environment, run:

```bash
npm install -D tailwindcss postcss autoprefixer
```
