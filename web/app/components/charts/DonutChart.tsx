"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const data = {
  labels: [
    "Metro Manila",
    "Cebu",
    "Central Luzon",
    "Western Visayas",
    "Northern Mindanao",
    "Others",
  ],
  datasets: [
    {
      data: [28, 18, 16, 12, 10, 16],
      backgroundColor: [
        "#2563eb",
        "#f97316",
        "#22c55e",
        "#eab308",
        "#8b5cf6",
        "#64748b",
      ],
      borderWidth: 0,
      hoverOffset: 4,
    },
  ],
};

const options = {
  responsive: true,
  maintainAspectRatio: false as const,
  cutout: "65%",
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "#111827",
      titleColor: "#f9fafb",
      bodyColor: "#e5e7eb",
      cornerRadius: 6,
    },
  },
};

export default function DonutChart() {
  return <Doughnut data={data} options={options} />;
}
