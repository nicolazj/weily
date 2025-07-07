import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
  args: {
    timestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    if (args.timestamp) {
      return await ctx.db
        .query("logs")
        .filter((q) => q.gte(q.field("_creationTime"), args.timestamp!))
        .collect();
    }
    return await ctx.db.query("logs").collect();
  },
});

export const add = mutation({
  args: { weight: v.number(), reps: v.number(), type: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db.insert("logs", args);
  },
});
export const remove = mutation({
  args: { id: v.id("logs") },
  handler: async (ctx, args) => {
    return await ctx.db.delete(args.id);
  },
});
