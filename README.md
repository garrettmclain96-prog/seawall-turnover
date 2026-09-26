# seawall-turnover

Website for Seawall Turnover Co., short-term rental turnover cleaning on Galveston Island. A McLain Systems company.

Next.js app. The booking form posts to `/api/request`, which emails each request through Resend.

## Environment variables (set in Vercel, never in code)

- `RESEND_API_KEY`: Resend API key
- `BOOKING_TO_EMAIL`: inbox that receives booking requests
- `BOOKING_FROM_EMAIL` (optional): sender, once a domain is verified in Resend

## Run locally

```
npm install
npm run dev
```
