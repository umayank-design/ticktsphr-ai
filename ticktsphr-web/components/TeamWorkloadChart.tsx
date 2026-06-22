"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface TeamData {
  team: string;
  count: number;
}

export default function TeamWorkloadChart({
  data,
}: {
  data: TeamData[];
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="team"
          tick={{ fill: "#ffffff" }}
        />

        <YAxis
          tick={{ fill: "#ffffff" }}
        />

        <Tooltip />

        <Bar
          dataKey="count"
          fill="#06b6d4"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}