# Freeze Sim: phone freeze prank simulator

A static, zero-dependency web app. It shows a fake "phone frozen" overlay (dimmed screen, spinner, "app isn't responding" dialog, fake progress bar) inside the browser tab only.

What it does NOT do: it does not lock, freeze, or control any device. It does not block exiting, back, refresh, or closing the tab. No beforeunload traps, no fullscreen lock, no payment or ransom, no data collection.

Exit routes that always work:
- press ESC
- X button appears in the corner after 3 seconds
- tap the screen 3 times fast
- the overlay auto-reveals an "exit prank" button after 12 seconds
- closing or switching the tab always works

## Files

- index.html: landing page, disclaimer, how-to-exit note, fake overlay markup
- styles.css: dark glass UI, overlay, animations (respects reduced motion)
- app.js: start, exit, progress, triple-tap and ESC logic
- vercel.json: static config for Vercel

## Run locally

Open index.html in a browser, or from this folder run:

    npx serve .

(any static server works, for example python3 -m http.server)

## Deploy to GitHub

1. Create a new empty repo on github.com (for example freeze-sim).
2. In this folder:

    git init
    git add .
    git commit -m "freeze sim v1"
    git branch -M main
    git remote add origin https://github.com/YOUR_USER/freeze-sim.git
    git push -u origin main

## Deploy to Vercel

1. Go to vercel.com, sign in with GitHub.
2. Click Add New, then Project, then import the freeze-sim repo.
3. Framework preset: Other. Build command: leave empty. Output directory: leave empty (root).
4. Click Deploy. You get a live URL like freeze-sim.vercel.app.

Or with the CLI: npm i -g vercel, then run vercel from this folder and accept the defaults. Use vercel --prod for production.

## Portfolio tips

Add a short screen recording of the start, the fake dialog, and the exit, and link the live URL. Keep the disclaimer visible in the recording.
