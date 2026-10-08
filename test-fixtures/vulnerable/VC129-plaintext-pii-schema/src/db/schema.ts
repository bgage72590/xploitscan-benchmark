import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// KYC details collected during payout onboarding
export const kycProfiles = pgTable("kyc_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  legalName: text("legal_name").notNull(),
  ssn: varchar("ssn", { length: 11 }).notNull(),
  driversLicense: text("drivers_license"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
