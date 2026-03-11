"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "convex/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { api } from "@/convex/_generated/api";

const workoutTypes = [
  { value: "squat", label: "Squat" },
  { value: "bench-press", label: "Bench Press" },
  { value: "deadlift", label: "Deadlift" },
  { value: "shoulder-press", label: "Shoulder Press" },
  { value: "dip", label: "Dip" },
] as const;

const TYPE_STORAGE_KEY = "weily:lastWorkoutType";
const WEIGHT_STORAGE_KEY = "weily:lastWeight";
const REPS_STORAGE_KEY = "weily:lastReps";

const formSchema = z.object({
  type: z.string().min(1, "Please choose a workout type"),
  weight: z.coerce
    .number({
      required_error: "Weight is required",
      invalid_type_error: "Weight must be a number",
    })
    .min(0, "Weight cannot be negative"),

  reps: z.coerce
    .number({
      required_error: "Reps is required",
      invalid_type_error: "Reps must be a number",
    })
    .int("Reps must be a whole number")
    .min(1, "At least 1 rep required"),
});

export const LogForm = () => {
  const addLog = useMutation(api.logs.add);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      weight: 70,
      reps: 1,
    },
  });

  const selectedType = form.watch("type");
  const selectedWeight = form.watch("weight");
  const selectedReps = form.watch("reps");

  useEffect(() => {
    const savedType = localStorage.getItem(TYPE_STORAGE_KEY);
    const savedWeight = localStorage.getItem(WEIGHT_STORAGE_KEY);
    const savedReps = localStorage.getItem(REPS_STORAGE_KEY);

    if (
      savedType &&
      workoutTypes.some((wk) => wk.value === savedType) &&
      !form.getValues("type")
    ) {
      form.setValue("type", savedType, { shouldValidate: true });
    }

    if (savedWeight && !Number.isNaN(Number(savedWeight))) {
      form.setValue("weight", Number(savedWeight), { shouldValidate: true });
    }

    if (savedReps && !Number.isNaN(Number(savedReps))) {
      form.setValue("reps", Number(savedReps), { shouldValidate: true });
    }
  }, [form]);

  useEffect(() => {
    if (selectedType) {
      localStorage.setItem(TYPE_STORAGE_KEY, selectedType);
    }
  }, [selectedType]);

  useEffect(() => {
    if (typeof selectedWeight === "number" && !Number.isNaN(selectedWeight)) {
      localStorage.setItem(WEIGHT_STORAGE_KEY, String(selectedWeight));
    }
  }, [selectedWeight]);

  useEffect(() => {
    if (typeof selectedReps === "number" && !Number.isNaN(selectedReps)) {
      localStorage.setItem(REPS_STORAGE_KEY, String(selectedReps));
    }
  }, [selectedReps]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addLog(values);
    form.reset(values);
  }

  return (
    <div className="w-full rounded-lg border p-3 mb-3">
      <h2 className="text-base font-semibold mb-0.5">Add new log</h2>
      <p className="text-xs text-muted-foreground mb-2">Log your workout</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Workout</FormLabel>
                <FormControl>
                  <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-5">
                    {workoutTypes.map((wk) => (
                      <Button
                        key={wk.value}
                        type="button"
                        variant={field.value === wk.value ? "default" : "outline"}
                        onClick={() => field.onChange(wk.value)}
                        className="w-full h-8 text-xs px-2"
                      >
                        {wk.label}
                      </Button>
                    ))}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Weight</FormLabel>
                  <FormControl>
                    <Input placeholder="80" {...field} className="h-9" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="reps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reps</FormLabel>
                  <FormControl>
                    <Input placeholder="8" {...field} className="h-9" />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full h-9">
            Add log
          </Button>
        </form>
      </Form>
    </div>
  );
};
