"use client";
import { Logs } from "@/app/logs";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";

export default function Days() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // or a placeholder
  }
  return (
    <div className="flex flex-col items-center justify-center">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-lg border"
      />
      <Logs date={date} key={date?.getTime()} />
    </div>
  );
}
