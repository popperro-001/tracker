"use client";
import { Serie, ResponsiveLine } from "@nivo/line";
import React, { useState, useMemo, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CalendarDaysIcon } from "@heroicons/react/24/solid";

import PlanInterface from "@/lib/types/plan.type";
import { formatDateString, getPastMonthDates } from "@/lib/utils";
import ChartHeader from "../shared/ChartHeader";

interface Props {
  data: Array<PlanInterface>;
}
type ButtonProps = React.HTMLProps<HTMLButtonElement>;

const initialDates = getPastMonthDates(1);

const LineChart = ({ data }: Props) => {
  const [startDate, setStartDate] = useState(new Date(initialDates.startDate));
  const [endDate, setEndDate] = useState(new Date(initialDates.endDate));

  const CustomInput = forwardRef<HTMLButtonElement, ButtonProps>(
    function CustomInput({ value, onClick }, ref) {
      return (
        <button
          className="border-2 py-2 px-5 rounded border-gray-300 text-sm bg-white flex gap-2"
          onClick={onClick}
          ref={ref}
        >
          <CalendarDaysIcon className="w-5 h-5" />
          {value}
        </button>
      );
    }
  );

  const [formattedData] = useMemo(() => {
    if (!data) return [];

    const formattedData: Serie = {
      id: "bodyWeight",
      color: "#FF5722",
      data: [],
    };

    data
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map(({ bodyweight, date }) => {
        const dateFormatted = new Date(date);
        if (dateFormatted >= startDate && dateFormatted <= endDate) {
          const formattedDate = formatDateString(date).slice(0, 6);
          formattedData.data = [
            ...formattedData.data,
            { x: formattedDate, y: bodyweight },
          ];
        }
      });

    return [formattedData];
  }, [data, startDate, endDate]); //eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="w-full glassmorphism">
      <div className="w-full h-full">
        <ChartHeader label="Body Weight" color="primary-orange" />

        <div className="flex-end gap-2">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date!)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            customInput={<CustomInput />}
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date!)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            customInput={<CustomInput />}
          />
        </div>

        {formattedData && (
          <ResponsiveLine
            data={[formattedData]}
            colors={{ datum: "color" }}
            margin={{ top: 50, right: 40, bottom: 40, left: 60 }}
            xScale={{ type: "point" }}
            yScale={{
              type: "linear",
              min: "auto",
              max: "auto",
              stacked: false,
              reverse: false,
            }}
            yFormat=""
            curve="catmullRom"
            axisTop={null}
            axisRight={null}
            axisBottom={{}}
            axisLeft={{}}
            enableGridX={true}
            enableGridY={true}
            pointSize={10}
            pointColor={{ theme: "background" }}
            pointBorderWidth={2}
            pointBorderColor={{ from: "serieColor" }}
            pointLabelYOffset={-12}
            useMesh={true}
            legends={[]}
            enablePointLabel={true}
          />
        )}
      </div>
    </div>
  );
};

export default LineChart;
