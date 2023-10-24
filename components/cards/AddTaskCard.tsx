"use client";
import React, { useState } from "react";

import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface Props {
  id: string;
  category: string;
  title: string;
  selectedTodos: Array<{ todoId: string; sets: number }>;
  setSelectedTodos: (
    selectedTodos: Array<{ todoId: string; sets: number }>
  ) => void;
  isAdded: boolean;
}

const AddTaskCard = ({
  category,
  title,
  id,
  selectedTodos,
  setSelectedTodos,
  isAdded,
}: Props) => {
  const [sets, setSets] = useState(0);

  const handleAdd = () => {
    setSelectedTodos([...selectedTodos, { todoId: id, sets }]);
  };

  const handleRemove = () => {
    const updatedList = selectedTodos.filter((item) => item.todoId !== id);
    setSelectedTodos(updatedList);
    setSets(0);
  };

  return (
    <div className="card flex-between">
      <div className="basis-4/6">
        <p className="line-clamp-1">{category}</p>
        <p className="line-clamp-1 text-sm text-gray-500 mt-2">{title}</p>
      </div>

      {isAdded ? (
        <p>{selectedTodos.find((item) => item.todoId === id)?.sets || 0}</p>
      ) : (
        <div className="basis-1/6">
          <label>
            <span className="text-sm">Sets</span>
            <input
              value={sets === 0 ? "" : sets}
              type="text"
              onChange={(e) => {
                const inputValue = e.target.value;
                const isNumber = /^[0-9]*$/.test(inputValue); // Check if it's a number

                if (
                  inputValue === "" ||
                  (isNumber &&
                    Number(inputValue) >= 0 &&
                    Number(inputValue) <= 5)
                ) {
                  const numberValue =
                    inputValue === "" ? 0 : parseInt(inputValue, 10);
                  setSets(Number(e.target.value));
                }
              }}
              placeholder="0"
              className="w-full rounded text-sm text-gray-500 border-2 border-gray-300 focus:border-blue-500 focus:border-2 px-2 outline-0"
            />
          </label>
        </div>
      )}

      {isAdded ? (
        <button type="button" onClick={handleRemove} className="rounded-full">
          <XMarkIcon className="w-6 h-6 text-primary-orange" />
        </button>
      ) : (
        <button type="button" onClick={handleAdd} className="rounded-full">
          <PlusCircleIcon className="w-6 h-6 text-green-500" />
        </button>
      )}
    </div>
  );
};

export default AddTaskCard;
