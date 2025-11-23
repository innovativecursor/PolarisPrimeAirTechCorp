import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const RegionalChart = () => {
  const regionalData = {
    labels: [
      "Metro Manila",
      "Calabarzon",
      "Central Luzon",
      "Western Visayas",
      "Central Visayas",
      "Northern Mindanao",
      "Others",
    ],
    datasets: [
      {
        label: "Customer Orders by Region",
        data: [35, 18, 12, 10, 8, 7, 10], // Percentages
        backgroundColor: [
          "rgba(59, 130, 246, 0.9)", // Blue with transparency
          "rgba(16, 185, 129, 0.9)", // Green
          "rgba(245, 158, 11, 0.9)", // Amber
          "rgba(239, 68, 68, 0.9)", // Red
          "rgba(139, 92, 246, 0.9)", // Purple
          "rgba(6, 182, 212, 0.9)", // Cyan
          "rgba(107, 114, 128, 0.9)", // Gray
        ],
        borderColor: "#ffffff",
        borderWidth: 3,
        hoverOffset: 8,
        hoverBorderWidth: 4,
        hoverBorderColor: "#ffffff",
        hoverBackgroundColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(245, 158, 11, 1)",
          "rgba(239, 68, 68, 1)",
          "rgba(139, 92, 246, 1)",
          "rgba(6, 182, 212, 1)",
          "rgba(107, 114, 128, 1)",
        ],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          font: {
            size: 12,
            weight: "500",
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 12,
          boxHeight: 12,
          color: "#374151",
        },
      },
      title: {
        display: true,
        text: "🇵🇭 Customer Distribution by Region",
        font: {
          size: 18,
          weight: "bold",
        },
        color: "#1F2937",
        padding: {
          bottom: 25,
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "#ffffff",
        bodyColor: "#ffffff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          title: function (context) {
            return context[0].label;
          },
          label: function (context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return [`${value}% of total orders`, `📍 ${context.label} region`];
          },
        },
      },
    },
    layout: {
      padding: {
        left: 15,
        right: 15,
        top: 15,
        bottom: 15,
      },
    },
    cutout: "60%",
    radius: "90%",
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 1500,
      easing: "easeInOutQuart",
    },
    interaction: {
      intersect: false,
      mode: "nearest",
    },
  };

  return (
    <div className="chart-container">
      <Doughnut data={regionalData} options={options} />
    </div>
  );
};

export default RegionalChart;
