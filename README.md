# Swadeshi Opticals

Full-stack optical e-commerce site. React (Vite) + Tailwind frontend, Express backend deployed as Vercel serverless functions, MongoDB Atlas, Cloudinary, Nodemailer (Gmail SMTP).

## Local setup

1. `npm install` (root — installs backend deps)
2. `cd client && npm install && cd ..`
3. Copy `.env.example` to `.env` and fill in real values.
4. Copy `client/.env.example` to `client/.env` and fill in `VITE_GOOGLE_CLIENT_ID`.
5. `npm run seed` — populates categories, ~16 sample products (with placeholder photos), and the shop's real contact info/address into Settings. Safe to re-run any time. (Or run `npm run seed:categories` / `seed:products` / `seed:settings` individually.)
6. `npm run create-admin -- <username> <password>` — creates your admin login (see below).
7. `npm run dev` — starts the backend on port 5000.
8. In a second terminal: `cd client && npm run dev` — starts the frontend on port 5173.

## Creating the admin account

There is no public signup for admins, by design. Use the script:

```bash
npm run create-admin -- admin YourStrongPassword123
```

Running it again with the same username updates that admin's password instead of creating a duplicate (and resets 2FA, in case you also lost access to your authenticator app).

Log in at `http://localhost:5173/admin/login`. First login shows a QR code — scan it with Google Authenticator (or any TOTP app) to finish setup; every login after that just asks for the 6-digit code.

## Shop contact info

Default values (seeded via `npm run seed:settings`, editable anytime in Admin → Settings):

- Phone / WhatsApp: `+91 94134 60346`
- Email: `id.swadeshi.opticals051@gmail.com` (also where new-order and contact-form emails are sent)
- Address: 51, Rana Sanga Market, Rana Sanga Bazar, Sector 1, Gandhi Nagar, Chittorgarh, Rajasthan 312001
- Map coordinates default to the Chittorgarh (312001) area center — approximate. Fine-tune the exact pin in Admin → Settings once you have precise coordinates for the shop itself.

## Email setup (Gmail SMTP via Nodemailer)

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

`npm test` — runs unit tests (JWT, TOTP, WhatsApp link builder, seed-data integrity) and API smoke tests (health check, 404 handling, auth guards, injection handling). These do not require a live database.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Set all variables from `.env.example` and `client/.env.example` in Vercel's Environment Variables settings.
4. Vercel uses `vercel.json` to build `client/` as the static site and deploy `api/index.js` as the serverless function for all `/api/*` routes.
5. After first deploy, run `npm run seed` and `npm run create-admin` locally, pointed at the production `MONGODB_URI`.

## Production Checklist

Before going live:

- [ ] Set all env vars in Vercel (`.env.example` lists required keys)
- [ ] Use a strong `JWT_SECRET`
- [ ] Verify `CLIENT_URL` matches the production frontend URL
- [ ] Confirm `MONGODB_URI` points to MongoDB Atlas
- [ ] Confirm Cloudinary credentials are production keys
- [ ] Verify Gmail SMTP/App Password and `EMAIL_FROM`
- [ ] Run `npm run seed` and `npm run create-admin` against production DB
- [ ] Test `/api/health` and a full checkout flow on the live URL

## Seed scripts

The `scripts/` seed files (`seedCategories`, `seedProducts`, `seedSettings`, `createAdmin`) are for **initial setup only**. Run them once against your production database to populate categories, products, settings, and the first admin account. They are **not needed at runtime** after that.

## Notes

- Stock is managed manually by admin — orders do not auto-decrement stock.
- Login is required before adding anything to the cart; browsing is open to everyone.
- Prescriptions are optional at checkout and reviewed by admin afterward.
- Delivery charge and store contact details are editable in Admin → Settings, not hardcoded.
- The cart is cleared automatically on logout, so the next person on a shared device doesn't see a previous customer's cart.
