# Admin Setup Instructions

## Files Created

✅ **Prisma Schema** - Added Admin model to `lib/prisma/schema.prisma`
✅ **Seed File** - Created `lib/prisma/seed.ts` with admin credentials
✅ **Login Page** - Created `app/admin/login/page.tsx`
✅ **Login API** - Created `app/api/admin/login/route.ts`
✅ **Dashboard API** - Created `app/api/admin/dashboard/route.ts`
✅ **Dashboard Page** - Created `app/admin/dashboard/page.tsx`

## Admin Credentials

```
Email: admin@ted.com
Password: TEDxUC2026adminpass
```

## Setup Steps

### 1. Install Dependencies (if needed)

```bash
npm install @prisma/client
```

### 2. Generate Prisma Client

```bash
npx prisma generate --schema=./lib/prisma/schema.prisma
```

### 3. Run Database Migration

```bash
npx prisma migrate dev --name add_admin_model --schema=./lib/prisma/schema.prisma
```

### 4. Seed the Database

Run the seed file to create the admin user:

```bash
npx tsx lib/prisma/seed.ts
```

Or add to your `package.json`:

```json
{
  "prisma": {
    "seed": "tsx lib/prisma/seed.ts"
  }
}
```

Then run:

```bash
npx prisma db seed
```

### 5. Start the Development Server

```bash
npm run dev
```

## Access Points

- **Login Page**: http://localhost:3000/admin/login
- **Dashboard**: http://localhost:3000/admin/dashboard (requires login)

## Features

### Login Page
- Clean black background design
- Email and password authentication
- Error handling
- Redirects to dashboard on success

### Dashboard
- **Statistics Overview**: Total events, registrations, payments, and revenue
- **Events Tab**: View all events with details (name, type, date, quota, price, status)
- **Registrations Tab**: View all registrations with participant details and status
- **Payments Tab**: View all payment transactions with amounts and status
- **Admins Tab**: View all admin users
- Black theme with red accents (TEDx branding)
- Responsive design
- Logout functionality

## Security Notes

⚠️ **Important**: This is a basic implementation. For production:

1. Use proper JWT tokens with expiration
2. Add bcrypt for password hashing instead of SHA-256
3. Add middleware to protect API routes
4. Add HTTPS in production
5. Implement rate limiting
6. Add session management
7. Add role-based access control if needed

## Troubleshooting

### "Cannot find module '@prisma/client'"
Run: `npx prisma generate --schema=./lib/prisma/schema.prisma`

### "Admin already exists" during seeding
This is normal - the admin was already created. You can still login with the credentials.

### Cannot connect to database
Check your `DATABASE_URL` in `.env` file

## Next Steps

1. Test the login functionality
2. Verify all data is displaying correctly in the dashboard
3. Add additional features as needed (export data, search, filters, etc.)
4. Enhance security for production deployment
