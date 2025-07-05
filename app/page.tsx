import { LogForm } from "./log-form";
import { Logs } from "./logs";
function getStartOfTodayTimestamp() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to 00:00:00.000
  return today.getTime(); // Returns milliseconds since epoch
}

export default function Home() {
  return (
    <div className="items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <LogForm />

      <Logs />
    </div>
  );
}
