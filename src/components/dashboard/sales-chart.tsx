"use client";

import { useState } from "react";

export function SalesChart() {
  const [view, setView] = useState<"7days" | "30days">("7days");

  const weeklyData = [
    { label: "Mon", value: 45 },
    { label: "Tue", value: 78 },
    { label: "Wed", value: 52 },
    { label: "Thu", value: 34 },
    { label: "Fri", value: 67 },
    { label: "Sat", value: 89 },
    { label: "Sun", value: 56 },
  ];

  const monthlyData = [
    { label: "1-5", value: 65 },
    { label: "6-10", value: 45 },
    { label: "11-15", value: 90 },
    { label: "16-20", value: 55 },
    { label: "21-25", value: 70 },
    { label: "26-30", value: 60 },
  ];

  const data = view === "7days" ? weeklyData : monthlyData;

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white">Sales Performance</h3>
        <select 
          value={view}
          onChange={(e) => setView(e.target.value as "7days" | "30days")}
          className="text-sm border border-slate-700 bg-slate-950 rounded-md px-2 py-1 text-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer hover:border-slate-600"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>
      </div>

      <div className="h-64 flex items-end justify-between gap-3 sm:gap-4 mt-8">
        {data.map((item, i) => {
          const maxVal = Math.max(...data.map(d => d.value));
          const heightPercentage = (item.value / maxVal) * 100;
          const isPeak = item.value === maxVal;

          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group cursor-default">
              <div className="relative w-full flex items-end justify-center h-full">
                <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-emerald-950 text-emerald-100 border border-emerald-800 text-xs rounded py-1.5 px-3 whitespace-nowrap z-10 pointer-events-none transform translate-y-2 group-hover:translate-y-0 duration-200">
                  ${item.value * 120} Sales
                </div>

                <div
                  className={`w-full max-w-[44px] rounded-t-lg transition-all duration-500 ease-out ${
                    isPeak
                      ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" 
                      : "bg-slate-700 hover:bg-emerald-600/80"              
                  }`}
                  style={{ height: `${heightPercentage}%` }}
                ></div>
              </div>
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}