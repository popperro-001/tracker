"use client";
import { formatDateInput } from "@/lib/utils";
import Link from "next/link";
import React from "react";

interface Props {
  workout: { date: string; bodyweight: number };
  setWorkout: (workout: { date: string; bodyweight: number }) => void;
  submitting: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleDelete: () => void;
}

const WorkoutForm = ({
  workout,
  setWorkout,
  submitting,
  handleSubmit,
  handleDelete,
}: Props) => {
  return (
    <div className="max-sm:basis-2/3 basis-1/2 max-sm:flex-1  z-20">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl flex flex-col gap-7 glassmorphism max-sm:mt-2"
      >
        <label>
          <span className="font-semibold text-base text-gray-700">Date</span>
          <input
            value={formatDateInput(workout.date)}
            onChange={(e) => setWorkout({ ...workout, date: e.target.value })}
            type="date"
            required
            className="form_input"
          />
        </label>

        <label>
          <span className="font-semibold text-base text-gray-700">
            Body weight
          </span>
          <input
            value={workout.bodyweight === 0 ? "" : workout.bodyweight}
            type="text"
            onChange={(e) => {
              const inputValue = e.target.value;
              const isNumber = /^[0-9]*$/.test(inputValue); // Check if it's a number

              if (
                inputValue === "" ||
                (isNumber && Number(inputValue) >= 0 && Number(inputValue) <= 1000)
              ) {
                const numberValue =
                  inputValue === "" ? 0 : parseInt(inputValue, 10);
                setWorkout({ ...workout, bodyweight: numberValue });
              }
            }}
            placeholder="0"
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
            href={"/workout"}
            className="px-5 py-1 text-sm bg-white rounded-full text-gray-900 hover:bg-gray-900 hover:text-white"
          >
            Back
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-1 text-sm bg-primary-orange rounded-full text-white hover:bg-white hover:text-primary-orange"
          >
            {submitting ? `Saving...` : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutForm;
