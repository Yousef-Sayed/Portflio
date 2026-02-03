# Portfolio Website

A professional, modern, and bilingual (English/Arabic) portfolio website built with Next.js 14, TailwindCSS, Shadcn/UI, and Convex.

## Features

- **Stunning UI**: Modern design with glassmorphism, gradients, and premium animations.
- **Bilingual**: Full support for English and Arabic (RTL).
- **Dark Mode**: Fully functional theme toggle.
- **Responsive**: Perfect on all devices.
- **Convex Backend**: Contact form submissions are stored in a real-time database.

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Setup Convex (Backend)

To enable the contact form, you need to initialize Convex.

```bash
npx convex dev
```
Follow the prompts to log in and create a new project. This will generate your `.env.local` file with `NEXT_PUBLIC_CONVEX_URL` and generate the necessary backend types.

**Note**: If you skip this step, the website will still run, but the contact form will use a simulation mode (local fallback).

### 3. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Customization

- **Content**: Edit `data/portfolio-data.ts` to update your information, projects, and skills.
- **Images**: Place your images in `public/` and update the references in the data file.
- **Colors**: Theme colors are defined in `app/globals.css`.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Convex](https://www.convex.dev/)
- [Lucide React](https://lucide.dev/)
