"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";

type Task = {
  _id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  owner: string;
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/admin/tasks");
      const json = await res.json();
      setTasks(json.tasks ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <section className="space-y-4">
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <p className="text-sm text-slate-400">
          Work remaining, reminders and timeline.
        </p>
      </div>
      <div className="rounded-lg border border-slate-700 bg-slate-900 p-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ) : (
          <ul className="space-y-2">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="rounded-lg border border-slate-700 bg-slate-800 p-4 hover:bg-slate-700/80 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-slate-100">{task.title}</h3>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      task.completed
                        ? "bg-emerald-500/20 text-emerald-300"
                        : "bg-amber-500/20 text-amber-300"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
                <div className="mt-2 text-xs text-slate-400">
                  Due{" "}
                  <span className="text-slate-300">
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>{" "}
                  • Owner <span className="text-slate-300">{task.owner}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
