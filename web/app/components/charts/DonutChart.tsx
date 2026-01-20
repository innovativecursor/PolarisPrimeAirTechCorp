import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

type CustomersByCity = {
  city: string;
  count: number;
};

type DonutChartProps = {
  data: CustomersByCity[];
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
      callbacks: {
        label: function (context: any) {
          const label = context.label || "";
          const value = context.parsed || 0;
          return `${label}: ${value}`;
        },
      },
    },
  },
};

export default function DonutChart({ data }: DonutChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-sm text-slate-400">
        No customer data available
      </div>
    );
  }

  const chartData = {
    labels: data.map((item) => item.city),
    datasets: [
      {
        data: data.map((item) => item.count),
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

  return <Doughnut data={chartData} options={options} />;
}
