"use client";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { Activity, Calendar, Target, Trophy, TrendingUp } from "lucide-react";

const getStats = (
  allLogs: {
    _id: Id<"logs">;
    _creationTime: number;
    weight: number;
    reps: number;
    type: string;
  }[]
) => {
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

  const filteredLogs = allLogs.filter((log) => log.reps > 1);

  const totalReps = filteredLogs.reduce((sum, log) => sum + log.reps, 0);

  // Get unique days
  const uniqueDays = new Set(
    filteredLogs.map((log) => new Date(log._creationTime).toDateString())
  ).size;

  // Get exercise frequency
  const exerciseCount = allLogs.reduce((acc, log) => {
    if (!(log.type in acc)) {
      acc[log.type] = [0, 0, 0];
    }
    if (log.reps > 1) {
      acc[log.type][0] = (acc[log.type][0] || 0) + 1;
      if (log.weight > acc[log.type][1]) {
        acc[log.type][1] = log.weight;
      }
    }
    if (log.weight > acc[log.type][2]) {
      acc[log.type][2] = log.weight;
    }
    return acc;
  }, {} as Record<string, [number, number, number]>);

  const topExercises = Object.entries(exerciseCount)
    .sort(([, [a]], [, [b]]) => b - a)
    .map(([exercise, [count, weight, max]]) => ({
      exercise,
      count,
      weight,
      max,
    }));

  return {
    firstOne: allLogs[0],
    lastOne: allLogs[allLogs.length - 1],
    totalSessions: filteredLogs.length,
    totalVolume,
    avgVolume: uniqueDays > 0 ? Math.round(totalVolume / uniqueDays) : 0,
    uniqueDays,
    totalReps,
    avgReps: Math.round(totalReps / filteredLogs.length),
    topExercises,
  };
};
export default function Report() {
  const allLogs = useQuery(api.logs.get, {});

  if (!allLogs) {
    return (
      <div className="m-4 items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
        <div className="animate-pulse">Loading report...</div>
      </div>
    );
  }
  const stats = getStats(allLogs);

  return (
    <div className="m-4 space-y-6 font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6" />
        <h1 className="text-2xl font-bold">
          Workout Report{" "}
          {new Date(stats.firstOne?._creationTime ?? 0).toLocaleDateString()}-
          {new Date(stats.lastOne?._creationTime ?? 0).toLocaleDateString()}
        </h1>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Training Days</p>
              <p className="text-2xl font-bold">{stats.uniqueDays}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total sets</p>
              <p className="text-2xl font-bold">{stats.totalSessions}</p>
            </div>
            <Target className="h-8 w-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Volume</p>
              <p className="text-2xl font-bold">
                {stats.totalVolume.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">KG</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Daily Volume</p>
              <p className="text-2xl font-bold">
                {stats.avgVolume.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">KG</p>
            </div>
            <Activity className="h-8 w-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-2">Performance Metrics</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Reps:</span>
              <span className="font-medium">
                {stats.totalReps.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Average Reps per Set:</span>
              <span className="font-medium">{stats.avgReps}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sets per Day:</span>
              <span className="font-medium">
                {stats.uniqueDays > 0
                  ? (stats.totalSessions / stats.uniqueDays).toFixed(1)
                  : 0}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Exercises</h3>
          <div className="space-y-2">
            {stats.topExercises.length > 0 ? (
              stats.topExercises.map((exercise, index) => (
                <div
                  key={exercise.exercise}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <Badge variant="outline">{exercise.exercise}</Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {exercise.count} sets
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No exercises logged yet</p>
            )}
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Top Exercises #2</h3>
          <div className="space-y-2">
            {stats.topExercises.length > 0 ? (
              stats.topExercises.map((exercise, index) => (
                <div
                  key={exercise.exercise}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{index + 1}
                    </span>
                    <Badge variant="outline">{exercise.exercise}</Badge>
                  </div>
                  <span className="text-sm text-gray-600">
                    {exercise.weight}KG/{exercise.max} KG @
                    {((exercise.weight / exercise.max) * 100).toFixed(1)}%
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No exercises logged yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
