"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
export function getStartOfTodayTimestamp() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to 00:00:00.000
  return today.getTime(); // Returns milliseconds since epoch
}

export const Logs = () => {
  const logs = useQuery(api.logs.get, {
    timestamp: getStartOfTodayTimestamp(),
  });
  return (
    <div>
      {logs?.map((log) => {
        return <div key={log._id}>{JSON.stringify(log, null, 2)}</div>;
      })}
    </div>
  );
};
