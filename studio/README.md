# Loi SRU 25 content editor

This folder contains the Sanity Studio used to edit the English and French text on the Loi SRU 25 website.

The Studio connects to Sanity project `c5o3dddy` and the `production` dataset. It lists seven fixed documents. The editor can change text and links, but the website code controls page structure, item order, images, charts, maps, styles, and interactions.

The hosted editor is available at <https://loi-sru-25.sanity.studio/>. Sign in with a Sanity account that belongs to the project.

## Local setup

Use Node 22.13 or newer. From the repository root, run:

```sh
npm install
npm --prefix studio install
npm run studio:dev
```

Open the local address printed by Sanity and sign in with an account that belongs to the project.

## Checks

Build the editor with:

```sh
npm run studio:build
```

The Cloudflare Pages production site reads published content from Sanity. Publishing one of the seven documents triggers a production rebuild through the configured webhook.
