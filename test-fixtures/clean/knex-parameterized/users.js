// Users repository using Knex with parameterized query syntax. User input
// is bound via Knex's placeholders, not interpolated into the SQL string.
// VC006 must not fire.

import knex from "./db.js";

export async function findUserByEmail(email) {
  // Knex's `.where({ email })` form generates a parameterized query under
  // the hood — safe from SQL injection even though `email` comes from
  // user input.
  return knex("users").where({ email }).first();
}

export async function searchUsers(searchTerm) {
  // Even for a LIKE search, we use the bindings form. The `?` becomes a
  // bound parameter — Knex, not the caller, quotes it for the driver.
  return knex("users")
    .whereRaw("LOWER(name) LIKE ?", [`%${searchTerm.toLowerCase()}%`])
    .orderBy("created_at", "desc")
    .limit(50);
}
