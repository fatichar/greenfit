# GreenFit MVP

Static-first nutrition guidance website for `greenfit.in`.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Static JSON data in `data/`
- MDX-style guide files in `content/guides/`
- No backend, auth, database, CMS, payments, barcode scanning, or AI chatbot

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```bash
npm run build
npm start
```

By default, `npm start` runs the Next.js server on port `3000`.

## Environment Variables

No environment variables are required for local development.

To enable Umami analytics in production, set both:

- `NEXT_PUBLIC_UMAMI_SCRIPT_URL` (e.g., `https://eu.umami.is/script.js`)
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID`

Analytics only load when `NODE_ENV=production` and both variables are present.

To enable Amazon Associates tagging for affiliate product links, set:

- `NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG`

Do not commit the Associates tag to source code. Because this is a `NEXT_PUBLIC_` variable, set it before running `npm run build`; Next.js inlines public environment values at build time.

### Verification Checklist
For webmaster verification in production, set these optional variables where the production build runs:

- `GOOGLE_SITE_VERIFICATION`
- `BING_SITE_VERIFICATION`

The GitHub Actions deploy workflow reads them from the `Prod` environment variables and forwards them to the VPS build. The app renders the verification meta tags only when the corresponding variables are present.

### Analytics Verification Checklist

- [ ] Ensure the script loads in production builds when variables are set.
- [ ] Confirm no analytics script is loaded in development builds.
- [ ] Ensure variables use the `NEXT_PUBLIC_` prefix to work on the client side.
- [ ] Verify Umami automatic page view tracking works.
- [ ] Ensure no personal data is collected in custom events.
- [ ] Confirm Amazon affiliate links include the configured `tag` query parameter in production.

### SEO / Webmaster Validation Checklist

- [ ] Check `https://greenfit.in/sitemap.xml`.
- [ ] Check `https://greenfit.in/robots.txt`.
- [ ] View page source for `google-site-verification` and `msvalidate.01` meta tags when verification variables are set.
- [ ] Test structured data using Google Rich Results Test or Schema Markup Validator.
- [ ] Submit `https://greenfit.in/sitemap.xml` in Google Search Console and Bing Webmaster Tools.

## Content Editing

- Products: `data/products.json`
- Supplements: `data/supplements.json`
- Diet plans: `data/dietPlans.json`
- Foods: `data/foods.json`
- Ingredients: `data/ingredients.json`
- Product catalog: `data/product-catalog.json`
- Supplement product catalog: `data/supplement-catalog.json`
- Guides: `content/guides/*.mdx`

Keep the existing data shapes stable. Add fields intentionally and update the corresponding TypeScript types in `src/lib/types.ts`.

Catalog products support `id`, `title`, `category`, `shortDescription`, `imageUrl` or `imagePath`, `amazonUrl`, `tags`, and optional `priceText` and `notes`. Use tags such as guide slugs, product slugs, supplement slugs, or broad categories to place products in relevant sections. When a catalog product links to Amazon, the reusable product section adds the Amazon Associates tag from `NEXT_PUBLIC_AMAZON_ASSOCIATES_TAG`, opens the link in a new tab, and tracks an Umami `Outbound Product Click` event with non-personal product/source metadata.

Supplement comparison products additionally record the nutrient, brand, labelled form and dose, vegan evidence, an Amazon product image, Amazon India source verification date, and optional Trustified or Unbox Health results. Use an exact Amazon product URL with an ASIN, never a search-results URL. Add a test result only when the exact product and formulation can be matched to the public source. Record expired results as expired rather than presenting them as current, and use `Not tested` in the UI when no match is available.

Every page or component that links to Amazon must include the disclosure near the links: “As an Amazon Associate, we may earn from qualifying purchases.”

## VPS / Nginx Notes

1. Pull or upload the project to the VPS.
2. Install Node.js 20+.
3. Run:

```bash
npm install
npm run build
npm start
```

For a long-running process, use a process manager such as `pm2` or a `systemd` service:

```bash
pm2 start npm --name greenfit -- start
pm2 save
```

Example Nginx reverse proxy:

```nginx
server {
  server_name greenfit.in www.greenfit.in;

  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Add TLS with Certbot or your preferred certificate workflow.

## Quality Checks

```bash
npm run lint
npm run build
```

The app statically generates the directory pages, detail pages, guides, sitemap, and robots file.
