import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// KYC details collected during payout onboarding. The SSN is encrypted with
// lib/kms.ts before insert; the identity document is held by the KYC vendor.
export const kycProfiles = pgTable("kyc_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  legalName: text("legal_name").notNull(),
  ssnEncrypted: text("ssn_encrypted").notNull(),
  ssnLast4: varchar("ssn_last4", { length: 4 }).notNull(),
  kycVendorReference: text("kyc_vendor_reference"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
