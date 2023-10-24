import { calculateCompletionStatus, formatDateString } from "@/lib/utils";
import React from "react";
import { PencilSquareIcon, PlayPauseIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

interface Props {
  type: "today" | "history";
  id: string;
  date: string;
  bodyweight: number;
  ownerId: string;
  tasks: Array<{
    _id?: string;
    todo: { category: string; name: string; _id: string };
    actual: boolean;
    sets: Array<{ reps: number; weight: number }>;
  }>;
}

const WorkoutCard = ({ type, id, date, bodyweight, ownerId, tasks }: Props) => {
  const formattedDate = formatDateString(date);
  const progress = calculateCompletionStatus(tasks);
  return (
    <div
      className={`card flex flex-col items-start w-full ${
        progress === "Completed"
          ? "card_completed"
          : progress === "Not completed"
          ? "card_incompleted"
          : null
      }`}
    >
      <div className="flex-between w-full -gap-2">
        <p className="text-base text-gray-900 font-semibold">{formattedDate}</p>
        {bodyweight > 0 && <p className="text-sm blue_gradient">{bodyweight}kg</p>}
        <p className="text-sm text-gray-500">
          <span
            className={
              progress === "Completed" || progress === "Not completed"
                ? "hidden"
                : ""
            }
          >
            Progress:
          </span>{" "}
          {progress}
        </p>
        {type === "history" ? (
          <Link href={`/workout/${id}`} title="Edit">
            <PencilSquareIcon className="text-primary-orange w-5 h-5" />
          </Link>
        ) : (
          <Link
            href={`/workout/${id}`}
            title="Continue"
            className="text-sm flex justify-between items-center gap-2 max-sm:flex-col max-sm:text-xs text-primary-orange"
          >
            <PlayPauseIcon className="text-primary-orange w-5 h-5" />{" "}
            <span className="max-xs:hidden">Continue</span>
          </Link>
        )}
      </div>

      <hr className="w-full my-1 bg-gray-700" />

      <div className="flex flex-col items-start w-full">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`flex flex-col items-start w-full gap-1 mt-1  ${
              task.actual ? "green_gradient" : "orange_gradient"
            }`}
          >
            <p className={`line-clamp-1 font-semibold`}>{task.todo.name}</p>
            <div className="grid grid-cols-7 gap-2 w-full text-sm">
              <div className="flex flex-col col-span-2 font-semibold">
                <p>Weight:</p>
                <p>Reps:</p>
              </div>
              {task.sets.map((set, index) => (
                <div key={`${task._id}-${index}`} className="flex flex-col">
                  <p>{set.weight}</p>
                  <p>{set.reps}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutCard;
