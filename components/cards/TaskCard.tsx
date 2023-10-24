"use client";
import React, { useState } from "react";
import {
  PencilSquareIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { calculateTaskProgress } from "@/lib/utils";

interface Props {
  id: string;
  label: string;
  actual: boolean;
  sets: Array<{ reps: number; weight: number; _id: string }>;
  handleSubmit: () => void;
  taskList: Array<{
    _id: string;
    todo: { name: string };
    actual: boolean;
    sets: Array<{ reps: number; weight: number; _id: string }>;
  }>;
  setTaskList: (
    tasks: Array<{
      _id: string;
      todo: { name: string };
      actual: boolean;
      sets: Array<{ reps: number; weight: number; _id: string }>;
    }>
  ) => void;
}

const TaskCard = ({
  id,
  label,
  actual,
  sets,
  handleSubmit,
  taskList,
  setTaskList,
}: Props) => {
  const [isEditable, setIsEditable] = useState(false);
  const [tempSets, setTempSets] = useState([...sets]);
  const progress = calculateTaskProgress(sets);

  const handleSubmitChanges = () => {
    const updatedTask = taskList.find(task => task._id === id);
    if(updatedTask) {
      updatedTask.sets = tempSets
      const tasksToReplace = taskList.map((task) => {
        if(task._id === updatedTask._id) {
          return updatedTask;
        } else {
          return task
        }
      })
      setTaskList(tasksToReplace);
    }

    handleSubmit();
    setIsEditable(false);
  };

  const handleWeightChange = (setId: string, weight: number) => {
    const updatedSet = tempSets.find((set) => set._id === setId);
    if (updatedSet) {
      updatedSet.weight = weight;
      const setsToReplace = tempSets.map((set) => {
        if(set._id === updatedSet._id) {
          return updatedSet
        } else {
          return set;
        }
      });
      setTempSets(setsToReplace);
    }
  };

  const handleRepsChange = (setId: string, reps: number) => {
    const updatedSet = tempSets.find((set) => set._id === setId);
    if (updatedSet) {
      updatedSet.reps = reps;
      const setsToReplace = tempSets.map((set) => {
        if(set._id === updatedSet._id) {
          return updatedSet
        } else {
          return set;
        }
      });
      setTempSets(setsToReplace);
    }
  };

  const handleCancel = () => {
    const defaultSets = JSON.parse(JSON.stringify(sets))
    setTempSets(defaultSets);
    setIsEditable(false);
  };

  return (
    <div
      className={`card flex flex-col items-start w-full ${
        actual ? "card_completed" : "card_incompleted"
      }`}
    >
      <div className="flex-between w-full gap-2">
        <p className="basis-4/5 line-clamp-1 text-gray-900 font-semibold">
          {label}
        </p>
        <div className="flex-between gap-2">
          <p className="text-sm blue_gradient font-semibold">{progress}</p>
        {isEditable ? (
          <div className="flex-between gap-2">
            <button onClick={handleSubmitChanges}>
              <CheckIcon className="w-5 h-5 text-green-700" />
            </button>
            <button onClick={handleCancel}>
              <XMarkIcon className="w-5 h-5 text-primary-orange" />
            </button>
          </div>
        ) : (
          <button onClick={() => setIsEditable(true)}>
            <PencilSquareIcon className="w-5 h-5 text-primary-orange" />
          </button>
        )}
        </div>
      </div>

      <hr className="w-full my-1 bg-gray-700" />

      <div className="grid grid-cols-7 gap-2 w-full text-sm">
        <div className="flex flex-col col-span-2 font-semibold justify-center gap-1">
          <p className="leading-7">Weight:</p>
          <p className="leading-7">Reps:</p>
        </div>
        {tempSets.map((set) => (
          <div key={set._id} className="flex flex-col gap-1 justify-center">
            {isEditable ? (
              <>
                <input
                  value={set.weight === 0 ? "" : set.weight}
                  type="text"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const isNumber = /^[0-9]*$/.test(inputValue); // Check if it's a number

                    if (
                      inputValue === "" ||
                      (isNumber &&
                        Number(inputValue) >= 0 &&
                        Number(inputValue) <= 200)
                    ) {
                      const numberValue =
                        inputValue === "" ? 0 : parseInt(inputValue, 10);
                      handleWeightChange(set._id, numberValue);
                    }
                  }}
                  placeholder="0"
                  className="w-full rounded text-sm text-gray-500 border-2 border-gray-300 focus:border-blue-500 focus:border-2 px-2 outline-0"
                />
                <input
                  value={set.reps === 0 ? "" : set.reps}
                  type="text"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const isNumber = /^[0-9]*$/.test(inputValue); // Check if it's a number

                    if (
                      inputValue === "" ||
                      (isNumber &&
                        Number(inputValue) >= 0 &&
                        Number(inputValue) <= 200)
                    ) {
                      const numberValue =
                        inputValue === "" ? 0 : parseInt(inputValue, 10);
                      handleRepsChange(set._id, numberValue);
                    }
                  }}
                  placeholder="0"
                  className="w-full rounded text-sm text-gray-500 border-2 border-gray-300 focus:border-blue-500 focus:border-2 px-2 outline-0"
                />
              </>
            ) : (
              <>
                <p className="leading-7">{set.weight}</p>
                <p className="leading-7">{set.reps}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCard;
