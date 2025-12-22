"use client";

import { useState } from "react";

export function SalesChart() {
  const [view, setView] = useState<"7days" | "30days">("7days");

  // Data for "Last 7 Days"
  const weeklyData = [
    { label: "Mon", value: 45 },
    { label: "Tue", value: 78 },
    { label: "Wed", value: 52 },
    { label: "Thu", value: 34 },
    { label: "Fri", value: 67 },
    { label: "Sat", value: 89 },
    { label: "Sun", value: 56 },
  ];

  // Data for "Last 30 Days" (Intervals of 5 days)
  const monthlyData = [
    { label: "1-5", value: 65 },
    { label: "6-10", value: 45 },
    { label: "11-15", value: 90 }, // Peak
    { label: "16-20", value: 55 },
    { label: "21-25", value: 70 },
    { label: "26-30", value: 60 },
  ];

  const data = view === "7days" ? weeklyData : monthlyData;

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-gray-900">Sales Performance</h3>
        <select 
          value={view}
          onChange={(e) => setView(e.target.value as "7days" | "30days")}
          className="text-sm border-none bg-gray-50 rounded-md px-2 py-1 text-gray-500 focus:ring-0 cursor-pointer hover:bg-gray-100 outline-none"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      <div className="h-64 flex items-end justify-between gap-3 sm:gap-4 mt-8">
        {data.map((item, i) => {
          // Find the max value to scale the bars properly relative to container
          const maxVal = Math.max(...data.map(d => d.value));
          const heightPercentage = (item.value / maxVal) * 100;
          
          const isPeak = item.value === maxVal;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group cursor-default">
              <div className="relative w-full flex items-end justify-center h-full">
                {/* Tooltip */}
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1.5 px-3 whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:translate-y-0 duration-200">
                  ${item.value * 120} Sales
                  <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
                </div>

                {/* BAR */}
                <div
                  className={`w-full max-w-[44px] rounded-t-lg transition-all duration-500 ease-out ${
                    isPeak
                      ? "bg-sky-500 shadow-md shadow-sky-200"
                      : "bg-sky-200 hover:bg-sky-300"
                  }`}
                  style={{ height: `${heightPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-400 font-medium whitespace-nowrap">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}