import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const DAY_MS = 1000 * 3600 * 24;
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

export const getReportStats = query({
  args: {},
  handler: async (ctx) => {
    const allLogs = await ctx.db.query("logs").collect();

    if (allLogs.length === 0) {
      return {
        totalSessions: 0,
        totalVolume: 0,
        avgVolume: 0,
        uniqueDays: 0,
        totalReps: 0,
        avgReps: 0,
        topExercises: [],
        recentActivity: [],
      };
    }

    const totalVolume = allLogs.reduce(
      (sum, log) => sum + log.weight * log.reps,
      0
    );
    const totalReps = allLogs.reduce((sum, log) => sum + log.reps, 0);

    // Get unique days
    const uniqueDays = new Set(
      allLogs.map((log) => new Date(log._creationTime).toDateString())
    ).size;

    // Get exercise frequency
    const exerciseCount = allLogs.reduce((acc, log) => {
      acc[log.type] = (acc[log.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topExercises = Object.entries(exerciseCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([exercise, count]) => ({ exercise, count }));

    // Get recent activity (last 7 days)
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const recentLogs = allLogs.filter(
      (log) => log._creationTime > sevenDaysAgo
    );
    const recentActivity = recentLogs.reduce((acc, log) => {
      const day = new Date(log._creationTime).toDateString();
      acc[day] = (acc[day] || 0) + log.weight * log.reps;
      return acc;
    }, {} as Record<string, number>);

    return {
      firstOne: allLogs[0],
      lastOne: allLogs[allLogs.length - 1],
      totalSessions: allLogs.length,
      totalVolume,
      avgVolume: uniqueDays > 0 ? Math.round(totalVolume / uniqueDays) : 0,
      uniqueDays,
      totalReps,
      avgReps: Math.round(totalReps / allLogs.length),
      topExercises,
      recentActivity: Object.entries(recentActivity).map(([day, volume]) => ({
        day,
        volume,
      })),
    };
  },
});
