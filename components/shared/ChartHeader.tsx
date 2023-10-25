import React from "react";

interface Props {
  label: string;
  color: string;
}

const ChartHeader = ({ label, color }: Props) => {
  return (
    <div>
      <h3 className={`text-${color} uppercase font-semibold`}>{label}</h3>
    </div>
  );
};

export default ChartHeader;
