## Nama App

Prototype aplikasi web bernama Visit Flow untuk membantu tim lapangan
mencatat dan memantau kunjungan ke berbagai entitas.

- Data Seed berada di `POST /server/prisma/seed.ts`
- Penggunaan AI sekitar 70% untuk membuat kerangka app
- UI layout menggunakan UI pribadi saya

## Tech Stack

- React, TypeScript, Vite, Tailwind CSS
- Express, TypeScript, Prisma, PostgreSQL

## Demo Account

```bash
    account: admin@gmail.com (Memiliki Role Admin)
```

```bash
    account: sales@gmail.com (Memiliki Role Sales)
```

## Install Module

```bash
npm install
```

## Menjalankan server

```bash
npx prisma generate
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

## Menjalankan client

```bash
npm run dev
```

## Endpoint awal

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/entities`
- `POST /api/entities`
- `GET /api/activities`
- `POST /api/activities`
- `PATCH /api/activities/:id`

Semua endpoint selain login memerlukan header `Authorization: Bearer <token>`.
