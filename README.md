# Crack BATU

Access thousands of BATU previous years question papers. Free and premium PYQs for all departments and semesters.

## Features
- User authentication (login/signup)
- Admin dashboard
- Free and premium question papers
- PDF viewing and watermarking
- Responsive UI with modern design
- Theme support (light/dark)

## Tech Stack
- **Next.js** (v14)
- **React** (v18)
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (for authentication and backend)
- **Radix UI** (for accessible UI components)
- **react-pdf** (for PDF viewing)
- **pdf-lib** (for PDF watermarking)

## Major Dependencies
```
@hookform/resolvers, @radix-ui/react-*, @supabase/supabase-js, autoprefixer, class-variance-authority, clsx, cmdk, date-fns, embla-carousel-react, input-otp, lucide-react, next, next-themes, pdf-lib, react, react-day-picker, react-dom, react-hook-form, react-pdf, react-resizable-panels, recharts, sonner, tailwind-merge, tailwindcss, tailwindcss-animate, typescript, vaul, zod
```

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Ritikmandal13/Crack-batu.git
cd Crack-batu
```

### 2. Install dependencies
Using **pnpm** (recommended):
```bash
pnpm install
```
Or with **npm**:
```bash
npm install
```
Or with **yarn**:
```bash
yarn install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Run the development server
```bash
pnpm dev
# or
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure
- `app/` - Next.js app directory (pages, layouts, routes)
- `components/` - Reusable UI and logic components
- `hooks/` - Custom React hooks
- `lib/` - Utility libraries (Supabase, PDF, etc.)
- `public/` - Static assets
- `scripts/` - SQL scripts for Supabase setup
- `styles/` - Global styles

## Scripts
- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Lint code

## License
MIT

---

> Made with ❤️ for BATU students. 