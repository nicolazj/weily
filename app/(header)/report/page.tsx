"use client";
import { Badge } from "@/components/ui/badge";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { Activity, Calendar, Target, Trophy, TrendingUp } from "lucide-react";

export default function Report() {
  const stats = useQuery(api.logs.getReportStats);

  if (!stats) {
    return (
      <div className="m-4 items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
        <div className="animate-pulse">Loading report...</div>
      </div>
    );
  }

  return (
    <div className="m-4 space-y-6 font-[family-name:var(--font-geist-sans)]">
      <div className="flex items-center gap-2 mb-6">
        <Trophy className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Workout Report</h1>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
              <p className="text-sm text-gray-600">Training Days</p>
              <p className="text-2xl font-bold">{stats.uniqueDays}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-500" />
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
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">
          Recent Activity (Last 7 Days)
        </h3>
        {stats.recentActivity.length > 0 ? (
          <div className="space-y-2">
            {stats.recentActivity.map((activity) => (
              <div
                key={activity.day}
                className="flex justify-between items-center"
              >
                <span className="text-sm text-gray-600">
                  {new Date(activity.day).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (activity.volume /
                            Math.max(
                              ...stats.recentActivity.map((a) => a.volume)
                            )) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {activity.volume} KG
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No recent activity</p>
        )}
      </div>
    </div>
  );
}
