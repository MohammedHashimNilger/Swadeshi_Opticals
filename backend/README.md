# Swadeshi Opticals

Full-stack optical e-commerce site. React (Vite) + Tailwind frontend, Express backend deployed as Vercel serverless functions, MongoDB Atlas, Cloudinary, Nodemailer (Gmail SMTP).

## Project Structure

This project is organized for **separate Vercel deployments** of frontend and backend:

```
.
├── backend/                  # Vercel backend deployment
│   ├── api/                  # Vercel serverless entry (api/index.js)
│   ├── server/               # Express app, routes, controllers, models
│   ├── scripts/              # Database seed and admin creation scripts
│   ├── tests/                # Backend unit/integration tests
│   ├── package.json          # Backend dependencies and scripts
│   └── vercel-backend.env    # Environment variables for Vercel backend
├── frontend/                 # Vercel frontend deployment
│   ├── src/                  # React app source
│   ├── public/               # Static assets
│   ├── package.json          # Frontend dependencies
│   ├── vite.config.js        # Vite config with API proxy
│   └── vercel.json           # Frontend Vercel config
├── vercel.json               # Root Vercel config (backend routing)
├── .gitignore
└── .vercelignore             # Excludes frontend from backend deploy
```

## Local Setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values (MONGODB_URI, JWT_SECRET, etc.)
npm run seed
npm run create-admin -- admin YourStrongPassword123
npm run dev              # Starts backend on http://localhost:5000
```

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with VITE_API_URL=http://localhost:5000
npm run dev              # Starts frontend on http://localhost:5173
```

## Creating the Admin Account

There is no public signup for admins, by design. Use the script:

```bash
cd backend
npm run create-admin -- admin YourStrongPassword123
```

Running it again with the same username updates that admin's password instead of creating a duplicate (and resets 2FA, in case you also lost access to your authenticator app).

Log in at `http://localhost:5173/admin/login`. First login shows a QR code — scan it with Google Authenticator (or any TOTP app) to finish setup; every login after that just asks for the 6-digit code.

## Shop Contact Info

Default values (seeded via `npm run seed`, editable anytime in Admin → Settings):

- Phone / WhatsApp: `+91 94134 60346`
- Email: `id.swadeshi.opticals051@gmail.com` (also where new-order and contact-form emails are sent)
- Address: 51, Rana Sanga Market, Rana Sanga Bazar, Sector 1, Gandhi Nagar, Chittorgarh, Rajasthan 312001
- Map coordinates default to the Chittorgarh (312001) area center — approximate. Fine-tune the exact pin in Admin → Settings once you have precise coordinates for the shop itself.

## Email Setup (Gmail SMTP via Nodemailer)

The app sends order and contact notifications using Nodemailer + Gmail SMTP.

- **`EMAIL_FROM`** — the sender name/address shown to customers. You can use your Gmail address here.
- **`SMTP_USER`** — your Gmail address.
- **`SMTP_PASS`** — a Gmail App Password (not your regular password). Generate it after enabling 2-Step Verification in your Google account.
- **`ADMIN_EMAIL`** — where admin notifications are received. Defaults to `id.swadeshi.opticals051@gmail.com`.

Example Gmail setup:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_USER=id.swadeshi.opticals051@gmail.com`
- `SMTP_PASS=your 16-digit app password`

## Tests

```bash
cd backend
npm test
```

Runs unit tests (JWT, TOTP, WhatsApp link builder, seed-data integrity) and API smoke tests (health check, 404 handling, auth guards, injection handling). These do not require a live database.

## Deployment on Vercel

### Backend Deployment

1. Push this repo to GitHub.
2. In Vercel, create a **new project** and import the repo.
3. Set the **Root Directory** to `backend`.
4. Add environment variables from `backend/vercel-backend.env` in Vercel's Environment Variables settings.
5. Deploy.

Your backend will be available at `https://<project-name>.vercel.app`

### Frontend Deployment

1. In Vercel, create **another new project** and import the same repo.
2. Set the **Root Directory** to `frontend`.
3. Add environment variable `VITE_API_URL` pointing to your backend URL (e.g., `https://<backend-project-name>.vercel.app`).
4. Deploy.

Your frontend will be available at `https://<frontend-project-name>.vercel.app`

### Post-Deployment

After deploying the backend:

1. Run `npm run seed` against production (set `MONGODB_URI` to production DB).
2. Run `npm run create-admin` against production.

## Production Checklist

Before going live:

- [ ] Set all env vars in Vercel
- [ ] Use a strong `JWT_SECRET`
- [ ] Verify `CLIENT_URL` in backend matches the production frontend URL
- [ ] Confirm `MONGODB_URI` points to MongoDB Atlas
- [ ] Confirm Cloudinary credentials are production keys
- [ ] Verify Gmail SMTP/App Password and `EMAIL_FROM`
- [ ] Run `npm run seed` and `npm run create-admin` against production DB
- [ ] Test `/api/health` and a full checkout flow on the live URL

## Seed Scripts

The `backend/scripts/` seed files (`seedCategories`, `seedProducts`, `seedSettings`, `createAdmin`) are for **initial setup only**. Run them once against your production database to populate categories, products, settings, and the first admin account. They are **not needed at runtime** after that.

## Notes

- Stock is managed manually by admin — orders do not auto-decrement stock.
- Login is required before adding anything to the cart; browsing is open to everyone.
- Prescriptions are optional at checkout and reviewed by admin afterward.
- Delivery charge and store contact details are editable in Admin → Settings, not hardcoded.
- The cart is cleared automatically on logout, so the next person on a shared device doesn't see a previous customer's cart.
