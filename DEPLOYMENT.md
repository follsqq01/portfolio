# Vercel

Public URL: https://ruslan-melkumyan.vercel.app

Vercel project: `ruslan-melkumyan` in `ruslanmelkumyan54-7965`.

Publish an update from this directory:

```sh
npm run build:vercel
npx vercel@62.0.0 deploy --prebuilt --prod --yes
```

The build script prerenders the portfolio with Vinext, then packages public HTML and browser assets in `.vercel/output`. It does not publish Cloudflare server bindings, environment files, source originals, or the hidden archive API. All navigation uses ordinary document links without transition animations or a server runtime.
