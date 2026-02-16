# Tripify Backend

Express + MongoDB REST API for the Tripify frontend.

## Run

```bash
npm install
cp .env.example .env
npm run dev
```

Base URL: `http://localhost:5000`

## Required Env

- `PORT` (default: `5000`)
- `FRONTEND_ORIGIN` (default: `http://localhost:3000`)
- `JWT_SECRET`
- `MONGODB_URI` (example: `mongodb://127.0.0.1:27017/tripify`)

## Demo Accounts (seeded once)

- Admin: `admin@travel.com` / `admin123`
- Customer: `john@travel.com` / `password123`

## Endpoints

- `GET /api/health`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me` (auth)
- `PUT /api/users/me` (auth)
- `GET /api/cities`
- `GET /api/cities/:cityId`
- `POST /api/cities` (admin)
- `PUT /api/cities/:cityId` (admin)
- `DELETE /api/cities/:cityId` (admin)
- `GET /api/trips?cityId=...`
- `GET /api/trips/:tripId`
- `POST /api/trips` (admin)
- `PUT /api/trips/:tripId` (admin)
- `DELETE /api/trips/:tripId` (admin)
- `GET /api/packages?tripId=...`
- `GET /api/packages/:packageId`
- `POST /api/packages` (admin)
- `PUT /api/packages/:packageId` (admin)
- `DELETE /api/packages/:packageId` (admin)
- `GET /api/bookings` (admin gets all, customer gets own)
- `POST /api/bookings` (auth)
- `PATCH /api/bookings/:bookingId/status` (admin)
- `GET /api/admin/dashboard` (admin)
