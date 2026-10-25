# Presbyterian Church of Ghana (PCG) Web Application

A full-stack, production-ready web application for the **Presbyterian Church of Ghana (PCG)** built with Next.js 15, TypeScript, Tailwind CSS, Firebase Realtime Database, Firebase Authentication, Cloud Storage, and Firebase Security Rules.

---

## 1. System Architecture & Features

### Public Church Portal
- **Home**: Official 2026 Theme (*"Set Free to Live as Christ's Ambassadors"* - 2 Cor 5:20), Moderator's welcome, latest sermons, upcoming assemblies, and quick congregation finder.
- **About PCG**: Comprehensive historical timeline from the 1828 Basel Mission arrival at Christianborg Castle, Osu; Andreas Riis at Akropong; 1843 Jamaican Moravian settlers; Reformed Presbyterian doctrine, Church government, and Council of Elders.
- **Sermons & Media**: Full audio player with speed controls (1x, 1.25x, 1.5x), seek bar, volume toggle, video modal, category and presbytery search, and audio download options.
- **Church Events**: Synods, General Assembly sessions, Youth rallies, and harvests with online attendance registration.
- **News & Communiques**: Official General Assembly pastoral letters, press statements, and health/education updates with read-time and tag filtering.
- **Ministries**: Generational fellowships including Young People's Guild (YPG), Women's Fellowship, Men's Fellowship, Church Choir & Singing Band, Junior Youth (JY), and Bible Study & Prayer Group (BSPG).
- **Church Branches & Presbyteries**: Directory covering Ga, Asante, Akuapem, Akyem Abuakwa, Northern, Volta, and Overseas presbyteries with service schedules, addresses, and ministers.
- **Photo Gallery**: High-resolution albums with interactive zoom lightbox.
- **Giving & Stewardship**: Automated payment reference generator for MTN MoMo (`*170#`), Telecel Cash (`*110#`), and verified GCB Bank & Ecobank accounts.
- **Contact & Prayer Requests**: Validated form with anti-spam check connected directly to the real-time pastoral messages inbox.
- **Privacy & Legal**: Compliance with Ghana Data Protection Act 2012 (Act 843) and child protection policies.

### Administrative Management Dashboard
- **Role-Based Access Control (RBAC)**:
  - `SUPER_ADMIN`: Full content control, role permissions, settings modification, and audit log inspection.
  - `ADMIN`: Create, edit, publish, and delete authorized content, manage events, sermons, announcements, and media.
  - `EDITOR`: Create and edit content drafts; cannot alter security parameters or delete published records.
- **Real-Time Database Sync**: New sermons, announcements, or event changes broadcast instantly across users and visitors without manual refresh.
- **Media Upload**: File size & MIME validation with progress monitoring.
- **Audit Trail**: Real-time logging of administrative actions with actor emails and timestamps.

---

## 2. Step-by-Step Setup and Deployment Guide

### Step 1: Install Node.js and npm
Ensure you have **Node.js 20+** installed:
```bash
node -v
npm -v
```

### Step 2: Create a Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and name it `pcg-ghana` (or your preferred name).
3. Enable Google Analytics if desired and click **Create Project**.

### Step 3: Register a Web Application
1. Inside your Firebase project overview, click the **Web icon (`</>`)** to add an app.
2. Enter the app nickname (e.g., `PCG Web Portal`).
3. Check **Also set up Firebase Hosting**.
4. Click **Register app** and copy your Firebase configuration keys.

### Step 4: Enable Firebase Authentication
1. In the Firebase Console left navigation, click **Build > Authentication**.
2. Click **Get Started** and select **Email/Password** as the sign-in provider.
3. Enable **Email/Password** and click **Save**.

### Step 5: Create Firebase Realtime Database
1. Go to **Build > Realtime Database**.
2. Click **Create Database**.
3. Choose your database location (e.g., `europe-west1` or `us-central1`).
4. Select **Start in locked mode**.

### Step 6: Configure Cloud Storage for Firebase
1. Go to **Build > Storage** and click **Get Started**.
2. Select **Start in production mode**.
3. Choose your cloud storage bucket location and click **Done**.

### Step 7: Cloud Functions & Billing
1. Firebase Cloud Functions require the **Blaze (Pay as you go)** plan.
2. Upgrade your project in the Firebase Console if you plan to deploy Cloud Functions.
3. Note: The application includes Next.js server-side fallback endpoints and simulation so you can run and test everything even prior to upgrading to Blaze.

### Step 8: Configure Environment Variables
Copy `.env.example` to `.env.local` and fill in your Firebase public configuration:
```bash
cp .env.example .env.local
```
Add your credentials:
```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="pcg-ghana.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_DATABASE_URL="https://pcg-ghana-default-rtdb.firebaseio.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="pcg-ghana"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="pcg-ghana.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789012"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
```

### Step 9: Install Project Dependencies
```bash
npm install
```

### Step 10: Start Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

### Step 11: Run Unit Tests and Emulators
Run unit tests for PCG business logic:
```bash
npx --yes tsx --test lib/pcg-logic.test.ts
```

To run Firebase Local Emulators:
```bash
firebase emulators:start
```
Emulator UI will be available at `http://localhost:4000`.

### Step 12: Establish First Super Administrator
1. In Firebase Authentication console, create a user with email `admin@pcgonline.org`.
2. Assign the custom claim using the Firebase Admin script or run the initialization function:
```ts
import * as admin from 'firebase-admin';
admin.initializeApp();
async function grantSuperAdmin(email: string) {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { role: 'SUPER_ADMIN' });
  await admin.database().ref(`users/${user.uid}`).set({
    role: 'SUPER_ADMIN',
    email,
    updatedAt: new Date().toISOString(),
  });
  console.log(`Granted SUPER_ADMIN to ${email}`);
}
grantSuperAdmin('admin@pcgonline.org');
```

### Step 13: Deploy Security Rules
Deploy the Realtime Database and Cloud Storage security rules:
```bash
firebase deploy --only database
firebase deploy --only storage
```

### Step 14: Deploy Cloud Functions
```bash
cd functions && npm install && npm run build && cd ..
firebase deploy --only functions
```

### Step 15: Deploy Website to Firebase Hosting
Build the static export or Next.js production build:
```bash
npm run build
firebase deploy --only hosting
```

Your Presbyterian Church of Ghana full-stack application is now live and secured!
