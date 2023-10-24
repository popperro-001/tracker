import React from "react";
import { formatDateString, getWeekdayFromDate } from "@/lib/utils";

interface Props {
  label: string;
  type?: "orange" | "blue" | "green";
}
const PageHeader = ({ label, type = "blue" }: Props) => {
  const currentDate = new Date();
  const formattedDate = formatDateString(currentDate.toISOString());
  const formattedWeekDay = getWeekdayFromDate(currentDate.toISOString());

  return (
    <div className="w-full mb-10 flex-start max-sm:mb-2 flex-col">
      <h1
        className={`${
          type === "orange"
            ? "orange_gradient"
            : type === "blue"
            ? "blue_gradient"
            : "green_gradient"
        } uppercase text-4xl font-extrabold leading-[1.15]sm:text-6xl`}
      >
        {label}
      </h1>
      <div>
        <p className="text-sm text-gray-500 italic">
          {formattedDate} - {formattedWeekDay}
        </p>
      </div>
    </div>
  );
};

export default PageHeader;
