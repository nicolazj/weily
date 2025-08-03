"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Trash } from "lucide-react";
function getStartOfTodayTimestamp() {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to 00:00:00.000
  return today.getTime(); // Returns milliseconds since epoch
}

function getStartOfTimestamp(date: Date) {
  date.setHours(0, 0, 0, 0); // Set to 00:00:00.000
  return date.getTime(); // Returns milliseconds since epoch
}
export const Logs = ({ date }: { date?: Date }) => {
  const removeLog = useMutation(api.logs.remove);

  console.log({ date });
  const logs = useQuery(api.logs.get, {
    timestamp: date ? getStartOfTimestamp(date) : getStartOfTodayTimestamp(),
  });
  console.log(logs);
  const onDelete = (id: Id<"logs">) => {
    removeLog({ id });
  };
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Workout</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Reps</TableHead>
          <TableHead className="text-right">time</TableHead>
          <TableHead className="text-right w-[32px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs?.map((log) => {
          return (
            <TableRow key={log._id}>
              <TableCell className="font-medium">
                <Badge>{log.type}</Badge>
              </TableCell>
              <TableCell>{log.weight}</TableCell>
              <TableCell>{log.reps}</TableCell>
              <TableCell className="text-right">
                {new Date(log._creationTime).toLocaleTimeString()}
              </TableCell>
              <TableCell className="text-right w-[32px]">
                <Button
                  onClick={() => onDelete(log._id)}
                  size={"icon"}
                  variant={"ghost"}
                >
                  <Trash />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
