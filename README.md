# barkode landing page

This repository is the public front-facing site for barkode.

It should contain only marketing, product explanation, download links, static assets, and deployment configuration for the public website.

## Private app boundary

The app prototype, rule engine, barcode flow, nutrition checks, product data, and any implementation details that should remain private belong in a separate private repository.

Do not link to the private repository from this public site. When the app is ready to distribute, link to release artifacts, app store pages, TestFlight, an APK, or another public download route instead.

## Local preview

This is a static site. Open `index.html` directly in a browser, or serve the folder locally:

```bash
python3 -m http.server 8000
```

## Deployment

This public repository owns the GitHub Pages deployment for `barkode.eu`.

The custom domain is configured through `CNAME`. App source code and private logic must stay in the private app repository; only public-safe landing-page assets should be deployed from here.
