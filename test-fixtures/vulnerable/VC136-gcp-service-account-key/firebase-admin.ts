// Firebase Admin bootstrap that inlines a GCP service account JSON key
// instead of loading it from a secrets manager.
// This should trigger VC136 (Hardcoded GCP Service Account Key).

import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = {
  "type": "service_account",
  "project_id": "fake-demo-project-0000",
  "private_key_id": "0000000000000000000000000000000000000000",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCEXAMPLEFAKEKEY000000000000000000\n00000000000000000000000000000000000000000000000000000000EXAMPLE0\n-----END PRIVATE KEY-----\n",
  "client_email": "fake-admin@fake-demo-project-0000.iam.gserviceaccount.com",
  "client_id": "000000000000000000000",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
};

export const app = getApps().length
  ? getApps()[0]
  : initializeApp({ credential: cert(serviceAccount as never) });

export const db = getFirestore(app);
