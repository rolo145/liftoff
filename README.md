<div align="center">

# 🎄 LiftOff

A festive CrossFit competition hub built with **Vue 3 + TypeScript + Vite + Pinia + Tailwind CSS + Firebase**.

[![Vite](https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite&logoColor=fff)]()
[![Vue](https://img.shields.io/badge/Vue-3.5-42B883?logo=vuedotjs&logoColor=fff)]()
[![Firebase](https://img.shields.io/badge/Firebase-12-FFCA28?logo=firebase&logoColor=000)]()

</div>

## ✨ Overview

LiftOff powers a local holiday throwdown with real-time standings, team management, workout details, and schedule orchestration. Viewers enjoy a red-and-white frosted experience, while authenticated admins can manage every detail inside Firebase.

### Features

- 🎯 Live leaderboard with CrossFit-specific scoring (snatch, clean & jerk, WOD)
- 👥 Team directory grouped by category (men + men, women + women)
- 🗓️ Heat schedule with per-event call times
- 🛠️ Admin console gated behind Google Auth and Firebase role control
- ✍️ CRUD interfaces for teams, results, schedule, and workout
- ❄️ Snow-kissed UI with TailwindCSS and responsive Composition API pages

## 🧱 Tech Stack

- **Frontend:** Vue 3, Composition API, TypeScript, Vite, Pinia, Vue Router
- **Styles:** TailwindCSS, custom festive theming
- **Backend:** Firebase Auth (Google only) + Firestore (teams, results, workout, schedule)
- **Hosting:** Firebase Hosting ready (see `firebase.json`)

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Create a `.env` file (see `.env.example`) containing your Firebase project credentials and comma-separated admin UID list:

```ini
VITE_FIREBASE_API_KEY=...
VITE_ADMIN_UIDS=uid1,uid2
```

## 🔥 Firebase Collections

| Collection | Fields |
| ---------- | ------ |
| `teams` | `name`, `category`, `athlete1`, `athlete2` |
| `results` | `teamId`, `snatchAthlete1/2`, `cleanAthlete1/2`, `wodTime`, `totalPoints` |
| `workout` (doc `current`) | `description`, `standards`, `timeCap` |
| `schedule` | `teamId`, `snatchTime`, `cleanJerkTime`, `wodTime` |

### Responsive Views

- **Leaderboard**: mobile-friendly cards with snatch/clean breakdown; desktop table with chips.
- **Teams & Schedule**: search bar filters by team or athlete name, division sections collapse gracefully.
- **Admin editors**: search/filter per screen, stacked cards on mobile, 3-column layout on desktop.

Deploy with Firebase:

```bash
npm run build
firebase deploy --only hosting
```

## 🧭 Scripts

| Command | Description |
| ------- | ----------- |
| `npm run dev` | Start local dev server |
| `npm run build` | Type-check + bundle |
| `npm run preview` | Preview production build |
| `npm run set-admin -- path/to/serviceAccount.json` | Apply `admin` claim to every UID in `VITE_ADMIN_UIDS` |

### Granting Admin Access

1. Download a Firebase service-account key (`Project Settings → Service accounts → Generate new private key`).
2. Ensure `.env` contains every UID that should be elevated, e.g. `VITE_ADMIN_UIDS=L89ZwNVE3IfNpQCjPNvZ76PIUFp2`.
3. Run `npm run set-admin -- path/to/serviceAccount.json` to set the `admin` claim for each UID.
4. Have the user sign out/in so their token refreshes and Firestore rules recognize the claim.

### Deploying to Firebase Hosting

1. Authenticate CLI: `firebase login`.
2. Create/verify a Hosting site (e.g. `liftoff-b53d8`) and add `"site": "liftoff-b53d8"` to `firebase.json`.
3. Build the SPA: `npm run build`.
4. Deploy static assets: `firebase deploy --only hosting`.
   - `dist/` is uploaded, SPA rewrites are handled by `firebase.json`.
5. If you need to temporarily take the site offline: `firebase hosting:disable`.
6. Re-enable simply by running the deploy command again.

> `VITE_*` variables are baked into the build; they are not secrets but identifiers. Real access control is enforced via Firestore rules and the `{ admin: true }` custom claim.

---

Made with ❤️‍🔥 + ❄️ for the North Pole gym community.
