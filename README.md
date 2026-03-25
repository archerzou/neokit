# NeoKit

A unified hub for developer knowledge & resources.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

---

Developers keep their essentials scattered across snippets, bookmarks, and random folders. NeoKit brings everything into **one fast, searchable, AI-enhanced hub**.

## Stack

| Category  | Technology              |
| --------- | ----------------------- |
| Framework | Next.js 16 / React 19  |
| Language  | TypeScript 5            |
| Database  | Neon PostgreSQL         |
| ORM       | Prisma 7                |
| Auth      | NextAuth v5 (JWT)       |
| Styling   | Tailwind CSS v4 + shadcn/ui |
| AI        | OpenAI                  |
| Payments  | Stripe                  |
| Storage   | Cloudflare R2           |
| Email     | Resend                  |
| Testing   | Vitest                  |

## Getting Started

```bash
git clone https://github.com/bradtraversy/neokit.git
cd neokit
npm install
cp .env.example .env
npx prisma migrate dev
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Key Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start dev server |
| `npm run build` | Build for production |
| `npm run test` | Run tests |
| `npm run db:studio` | Open Prisma Studio |

## License

[MIT](LICENSE)
