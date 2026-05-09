import { pgTable, text, real, json, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const audits = pgTable("audits", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  formData: json("form_data").notNull(),
  results: json("results").notNull(),
  totalSavings: real("total_savings").notNull(),
  summary: text("summary"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: text("id").primaryKey(),
  auditId: text("audit_id")
    .notNull()
    .unique()
    .references(() => audits.id),
  email: text("email").notNull(),
  company: text("company"),
  role: text("role"),
  teamSize: text("team_size"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
// This tells Drizzle: one audit has one lead (one-to-one relationship).
export const auditsRelations = relations(audits, ({ one }) => ({
  lead: one(leads, {
    fields: [audits.id],
    references: [leads.auditId],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  audit: one(audits, {
    fields: [leads.auditId],
    references: [audits.id],
  }),
}));
