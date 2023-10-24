import Link from "next/link";
import React from "react";
import Select from "react-select";

const weekdaysOptions = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];

interface Props {
  type: string;
  plan: { id?: string; title: string; weekdays: Array<string> };
  setPlan: (plan: { title: string; weekdays: Array<string> }) => void;
  submitting: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDelete?: () => void;
}

const PlanForm = ({
  type,
  submitting,
  handleSubmit,
  plan,
  setPlan,
  handleDelete,
}: Props) => {
  return (
    <div className="max-sm:basis-2/3 basis-1/2 max-sm:flex-1  z-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl flex flex-col gap-7 glassmorphism max-sm:mt-2"
      >
        <label>
          <span className="font-semibold text-base text-gray-700">Repeat</span>{" "}
          {`(pick weekdays or don't)`}
          <Select
            options={weekdaysOptions}
            isClearable
            isMulti
            onChange={(options) =>
              setPlan({
                ...plan,
                weekdays: options ? options.map((item) => item.value) : [],
              })
            }
            value={plan.weekdays.map((day) => ({
              value: day,
              label: day,
            }))}
            className="mt-2"
          />
        </label>

        <label>
          <span className="font-semibold text-base text-gray-700">Title</span>
          <input
            value={plan.title}
            onChange={(e) => setPlan({ ...plan, title: e.target.value })}
            placeholder="Title"
            required
            className="form_input"
          />
        </label>
        <div className="flex-end mx-3 mb-2 gap-4">
          {handleDelete && (
            <button
              type="button"
              onClick={handleDelete}
              disabled={submitting}
              className="px-5 py-1 text-sm bg-red-600 rounded-full text-white hover:bg-white hover:text-red-600"
            >
              Delete
            </button>
          )}

          <Link
            href={"/plan"}
            className="px-5 py-1 text-sm bg-white rounded-full text-gray-900 hover:bg-gray-900 hover:text-white"
          >
            Back
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1 text-sm bg-primary-orange rounded-full text-white hover:bg-white hover:text-primary-orange"
          >
            {submitting ? `${type}...` : type}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PlanForm;
