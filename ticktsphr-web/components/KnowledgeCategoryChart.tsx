"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function KnowledgeCategoryChart({
  data,
}: {
  data: any[];
}) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-6 text-white">
        Knowledge by Category
      </h2>

      <div style={{ width: "100%", height: 350 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={120}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={[
                    "#06b6d4",
                    "#8b5cf6",
                    "#10b981",
                    "#f59e0b",
                    "#ef4444",
                  ][index % 5]}
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}