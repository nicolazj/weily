import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  logs: defineTable({
    type: v.string(),
    weight: v.number(),
    reps: v.number(),
  }),
});
