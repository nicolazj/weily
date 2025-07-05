import { LogForm } from "./log-form";
import { Logs } from "./logs";
export default function Home() {
  return (
    <div className="items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <LogForm />

      <Logs />
    </div>
  );
}
