"use client";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

import PageHeader from "@/components/shared/PageHeader";
import PlanInterface from "@/lib/types/plan.type";
import { ExtendedUserType } from "../api/auth/[...nextauth]/route";
import { formatDateString } from "@/lib/utils";
import Loader from "@/components/shared/Loader";
import WorkoutCard from "@/components/cards/WorkoutCard";
import Greeting from "@/components/shared/Greeting";

const Workout = () => {
  const { data: session } = useSession();
  const currentDate = new Date();
  const formattedDate = formatDateString(currentDate.toISOString());
  const [workoutList, setWorkoutList] = useState<Array<PlanInterface>>([]);
  const [todayWorkout, setTodayWorkout] = useState<Array<PlanInterface>>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user) {
      (async () => {
        setIsLoading(true);
        const response = await fetch(
          `/api/user/${(session?.user as ExtendedUserType).id}/workouts`
        );
        const data = await response.json();

        const todayList = data.filter(
          (item: any) => formatDateString(item.date) === formattedDate
        );
        if (todayList.length > 0) setTodayWorkout(todayList);

        const historyList = data.filter(
          (item: any) => formatDateString(item.date) !== formattedDate
        );
        if (historyList.length > 0) setWorkoutList(historyList);

        setIsLoading(false);
      })();
    }
  }, []);

  if (!session?.user) return <Greeting />;

  return (
    <section className="page-container">
      <PageHeader label="Workout" />

      <div className="mb-8 max-w-2xl flex flex-col gap-4">
        {todayWorkout.length > 0 &&
          todayWorkout.map((workout) => (
            <WorkoutCard
              key={workout._id}
              type="today"
              id={workout._id || ""}
              date={workout.date}
              bodyweight={workout.bodyweight}
              ownerId={(session?.user as ExtendedUserType).id}
              tasks={workout.tasks}
            />
          ))}
      </div>

      <Link
        href="/workout/new"
        className="px-5 py-2 text-sm bg-primary-orange rounded-full text-white hover:bg-white hover:text-primary-orange"
      >
        Start New
      </Link>

      {isLoading && <Loader type="circles" />}

      <div className="columns-3 max-[1440px]:columns-2 max-sm:columns-1 gap-4 space-y-4 mt-8">
        {workoutList.length > 0 &&
          workoutList.map((workout) => (
            <WorkoutCard
              key={workout._id}
              type="history"
              id={workout._id || ""}
              date={workout.date}
              bodyweight={workout.bodyweight}
              ownerId={(session?.user as ExtendedUserType).id}
              tasks={workout.tasks}
            />
          ))}
      </div>
    </section>
  );
};

export default Workout;
