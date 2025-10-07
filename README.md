# Booking App Technical Test

## Tech Stack Summary

| Area     | Technologies                                 |
| -------- | -------------------------------------------- |
| Frontend | Next.js, TailwindCSS, SWR, Axios, Auth0      |
| Backend  | Nest.js, Prisma, Passport, Google API, Auth0 |
| Auth     | Auth0 (Access Tokens, Sessions)              |
| Database | Prisma ORM, PostgreSQL                       |
| Proxy    | Next.js Route Handlers                       |

## Repository Folder Architecture

This repository contains both **Frontend** and **Backend** to avoid creating two different repositories for one technical test.

---

## Frontend

The front end is built with **Next.js**, and is using **Auth0** for handling authentication, **Tailwind** for styling, and **SWR with Axios** to make the HTTP requests.

### Setup

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file and add these variables:

```
AUTH0_SECRET=
APP_BASE_URL=
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=
AUTH0_SCOPE='openid profile email https://www.googleapis.com/auth/calendar.readonly'
API_BASE_URL=
```

### UI Components

- button
- card
- input
- label
- skeleton
- sonner (toast)

### Components

- BookingCard
- BookingForm
- BookingList

### Proxy Server

Since most of the components had to be created as **client components**, they had no access to the `auth0.getSession` or `getAccessToken` functions.

Therefore, a **proxy server** was created to get the bearer token from the session and pass it to the Nest.js API as a Bearer token.

This proxy server can be found under:

- `/src/api/[slug]/route.ts`
- `/src/api/[slug]/[id]/route.ts`

---

## Backend

The backend is built with **Nest.js**, **Auth0**, **Passport**, **Prisma**, and the **Google API library**.

### Setup

Install dependencies:

```bash
pnpm install
```

Start postgreSQL database:

```bash
docker-compose up -d --build
```

### Environment Variables

Create a `.env` file and add these variables:

```
DATABASE_URL=
AUTH0_DOMAIN=
AUTH0_AUDIENCE=
PORT=
AUTH0_DOMAIN=
AUTH0_MGMT_CLIENT_ID=
AUTH0_MGMT_CLIENT_SECRET=
```

---

## Endpoints

### `/bookings`

- **GET** – Get list of user bookings.  
  Header requires Bearer token.
- **POST** – Create a new booking.  
  Header requires Bearer token.  
  Body: `(name: string, startDate: string, endDate: string)`

### `/bookings/:id`

- **DELETE** – Delete booking.  
  Header requires Bearer token.

### `/profile`

- **GET** – Get user profile data.  
  Header requires Bearer token.

---
