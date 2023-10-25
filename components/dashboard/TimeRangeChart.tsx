"use client";
import React, { useMemo } from "react";
import { CalendarDatum, ResponsiveTimeRange } from "@nivo/calendar";

import PlanInterface from "@/lib/types/plan.type";
import {
  calculateCompletionStatus,
  formatDateInput,
  getPastMonthDates,
} from "@/lib/utils";
import ChartHeader from "../shared/ChartHeader";

interface Props {
  data: Array<PlanInterface>;
}

const initialDates = getPastMonthDates(2);

const TimeRangeChart = ({ data }: Props) => {
  const [formattedData] = useMemo(() => {
    if (!data) return [];

    const formattedData: Array<CalendarDatum> = [];

    data
      .sort((a, b) => (a.date < b.date ? -1 : 1))
      .map(({ tasks, date }) => {
        const formattedDate = formatDateInput(date);
        const progress = calculateCompletionStatus(tasks);
        let value = 0;
        if (progress === "Completed") {
          value = 100;
        } else if (progress === "Not completed") {
          value = 0;
        } else {
          value = progress;
        }
        formattedData.push({ value, day: formattedDate });
      });

    console.log(data);
    return [formattedData];
  }, [data]); //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="w-full glassmorphism h-[440px] -z-10">
      <ChartHeader label="Activity" color="primary-orange" />

      <div className="w-full h-[350px]">
        <ResponsiveTimeRange
          data={formattedData || []}
          from={initialDates.startDate}
          to={initialDates.endDate}
          emptyColor="#eeeeee"
          colors={["#FF5722", "#eab308", "#FEF08A", "#4ade80"]}
          margin={{ top: 40, right: 40, bottom: 100, left: 40 }}
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          firstWeekday="monday"
          legends={[]}
        />
      </div>
    </div>
  );
};

export default TimeRangeChart;
