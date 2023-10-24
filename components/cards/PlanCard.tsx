import Link from "next/link";
import React from "react";
import {
  PencilSquareIcon,
  RocketLaunchIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

interface Props {
  type: "plan" | "workout";
  id: string;
  title: string;
  weekdays: Array<string>;
  ownerId: string;
  tasks: Array<{
    todo: { category: string; name: string; _id: string };
    sets: Array<{ reps: number; weight: number }>;
  }>;
}

const PlanCard = ({ type, id, title, weekdays, tasks, ownerId }: Props) => {
  const router = useRouter();

  const handleStartWorkout = async () => {
    const response = await fetch(
      `/api/user/${ownerId}/workouts`,
      {
        method: "POST",
        body: JSON.stringify({
          type: 'plan',
          planId: id,          
        }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      router.push(`/workout/${data._id}`);
    }
  }

  return (
    <div className="card flex flex-col items-start w-full">
      <div className="flex-between w-full gap-2">
        <div className="flex justify-between items-baseline basis-3/4 gap-2">
          <p className="line-clamp-1 text-base text-gray-900 font-semibold">
            {title}
          </p>
          {weekdays.length > 0 && (
            <p className="line-clamp-1 text-sm blue_gradient">
              {weekdays.map((day) => day.slice(0, 3)).join(", ")}
            </p>
          )}
        </div>
        {type === "plan" ? (
          <Link href={`/plan/${id}`} title="Edit">
            <PencilSquareIcon className="text-primary-orange w-5 h-5" />
          </Link>
        ) : (
          <button
            onClick={handleStartWorkout}
            title="Get started!"
            className="text-sm flex justify-between items-center gap-2 max-sm:flex-col max-sm:text-xs text-primary-orange"
          >
            <RocketLaunchIcon className="text-primary-orange w-4 h-4 max-sm:w-5 max-sm:h-5" />{" "}
            <span className="max-xs:hidden">Get started!</span>
          </button>
        )}
      </div>
      <hr className="w-full my-1" />
      <div className="flex flex-col items-start w-full">
        {tasks.map((task) => (
          <div
            key={task.todo._id}
            className="flex-between w-full gap-2 text-sm text-gray-500 mt-1"
          >
            <div className="flex-start basis-5/6 gap-2">
              <p className="basis-1/3 line-clamp-1">{task.todo.category}</p>
              <p className="basis-2/3 line-clamp-1">{task.todo.name}</p>
            </div>
            <p>
              <span className="max-xs:hidden">sets: </span>
              {task.sets.length}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlanCard;
