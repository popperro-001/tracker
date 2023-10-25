import React from "react";
import CreatableSelect from 'react-select/creatable';

interface Props {
  type: string;
  todo: {
    type: string;
    category: string;
    name: string;
  };
  setTodo: (todo: { type: string; category: string; name: string }) => void;
  picklist: Array<{value: string, label: string}>;
  submitting: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

const TodoForm = ({type, todo, setTodo, submitting, handleSubmit, picklist}: Props) => {
  return <div className="max-sm:basis-2/3 basis-1/2 max-sm:flex-1 z-20">
    <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl flex flex-col gap-7 glassmorphism max-sm:mt-2"
      >
        <label>
          <span className="font-semibold text-base text-gray-700">
            Category
          </span>
          {" "} (pick existing or create new)
          <CreatableSelect
            options={picklist}
            isClearable
            onChange={(value) => setTodo({...todo, category: value?.value || ''})}
            value={todo.category ? {value: todo.category, label: todo.category} : null}
            placeholder='Category'
            className="mt-2"
          />
        </label>

        <label>
          <span className="font-semibold text-base text-gray-700">
            Title
          </span>
          <input
            value={todo.name}
            onChange={(e) => setTodo({ ...todo, name: e.target.value })}
            placeholder="Title"
            required
            className="form_input"
          />
        </label>
        <div className="flex-end mx-3 mb-2 gap-4">

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1 text-sm bg-primary-orange rounded-full text-white hover:bg-white hover:text-primary-orange"
          >
            {submitting ? `${type}...` : type}
          </button>
        </div>
      </form>
  </div>;
};

export default TodoForm;
