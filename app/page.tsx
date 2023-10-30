"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

import Greeting from "@/components/shared/Greeting";
import PlanInterface from "@/lib/types/plan.type";
import { ExtendedUserType } from "./api/auth/[...nextauth]/route";
import LineChart from "@/components/dashboard/LineChart";
import PageHeader from "@/components/shared/PageHeader";
import TimeRangeChart from "@/components/dashboard/TimeRangeChart";

export default function Home() {
  const { data: session } = useSession();
  const [workoutList, setWorkoutList] = useState<Array<PlanInterface>>([]);

  useEffect(() => {
    if (session?.user) {
      (async () => {
        const response = await fetch(
          `/api/user/${(session.user as ExtendedUserType).id}/workouts`
        );
        const data = await response.json();

        setWorkoutList(data);
      })();
    }
  }, []);

  if (!session?.user) return <Greeting />;

  return (
    <section className="page-container">
      <PageHeader label="Stats" />
      <div className="grid grid-cols-12 auto-rows-[minmax(0, 400px)] gap-4">
        <div className="col-span-8 max-sm:col-span-12 z-20">
          <LineChart data={workoutList} />
        </div>
        <div className="col-span-4 max-sm:col-span-12">
          <TimeRangeChart data={workoutList} />
        </div>
      </div>
    </section>
  );
}
