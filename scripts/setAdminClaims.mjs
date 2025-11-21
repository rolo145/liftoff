/* eslint-disable no-console */
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import admin from "firebase-admin";

dotenv.config();

const [, , serviceAccountPathArg] = process.argv;

if (!serviceAccountPathArg) {
  console.error(
    "Usage: npm run set-admin -- path/to/serviceAccountKey.json (downloaded from Firebase console).",
  );
  process.exit(1);
}

const serviceAccountPath = path.resolve(process.cwd(), serviceAccountPathArg);

async function bootstrap() {
  try {
    const serviceAccountRaw = await fs.readFile(serviceAccountPath, "utf-8");
    const serviceAccount = JSON.parse(serviceAccountRaw);

    if (!serviceAccount.project_id) {
      throw new Error("Service account JSON missing project_id.");
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    const adminUids = (process.env.VITE_ADMIN_UIDS ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!adminUids.length) {
      throw new Error("No admin UIDs detected in VITE_ADMIN_UIDS.");
    }

    await Promise.all(
      adminUids.map(async (uid) => {
        await admin.auth().setCustomUserClaims(uid, { admin: true });
        console.log(`✅ Admin claim set for ${uid}`);
      }),
    );

    console.log("Done. Users must sign out/in for the claim to take effect.");
  } catch (error) {
    console.error("Failed to set admin claims:", error);
    process.exit(1);
  }
}

bootstrap();
