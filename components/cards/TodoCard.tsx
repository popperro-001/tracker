import React from "react";

import { TrashIcon } from "@heroicons/react/24/outline";

interface Props {
  category: string;
  title: string;
  handleDelete: () => void;
}

const TodoCard = ({ category, title, handleDelete }: Props) => {
  return (
    <div className="card flex-between">
      <div className="basis-4/5">
        <p className="line-clamp-1">{category}</p>
        <p className="line-clamp-1 text-sm text-gray-500">{title}</p>
      </div>
      <button type="button" onClick={handleDelete} className="rounded-full">
        <TrashIcon className="w-5 h-5 text-primary-orange" />
      </button>
    </div>
  );
};

export default TodoCard;
