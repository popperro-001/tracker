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

    return [formattedData];
  }, [data]); //eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className="w-full glassmorphism">
      <div className="w-full h-full text-yellow-500">
        <ChartHeader label="Activity" color="primary-orange" />

        <ResponsiveTimeRange
          data={formattedData || []}
          from={initialDates.startDate}
          to={initialDates.endDate}
          emptyColor="#eeeeee"
          colors={["#FF5722", "#eab308", "#FEF08A", "#4ade80"]}
          margin={{ top: 40, right: 40, bottom: 100, left: 40 }}
          dayBorderWidth={2}
          dayBorderColor="#ffffff"
          legends={[
            {
              anchor: "bottom-left",
              direction: "row",
              justify: false,
              itemCount: 4,
              itemWidth: 42,
              itemHeight: 36,
              itemsSpacing: 14,
              itemDirection: "right-to-left",
              translateX: -60,
              translateY: -60,
              symbolSize: 20,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default TimeRangeChart;