/* eslint-disable react/prop-types */
import { flatten, get, maxBy } from "lodash";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function CommitsDistribution({ hotspots }) {
  if (!hotspots) return null;
  const allFiles = flatten(Object.values(hotspots).map(({ files }) => files));
  const maxCommitsPerFile = get(maxBy(allFiles, "commits"), "commits");
  const commitsToFilesCount = {};
  allFiles.forEach(({ commits }) => {
    if (!commitsToFilesCount[commits]) {
      commitsToFilesCount[commits] = 0;
    }
    commitsToFilesCount[commits] += 1;
  });
  const labels = Array(maxCommitsPerFile)
    .fill(0)
    .map((_, i) => i + 1);
  const data = {
    labels,
    datasets: [
      {
        data: labels.map((commits) => commitsToFilesCount[commits]),
        backgroundColor: "#0d6efd",
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "# of Commits",
        },
      },
      y: {
        title: {
          display: true,
          text: "# of Files",
        },
      },
    },
  };
  return (
    <div>
      <h2>Distribution of commits per file</h2>
      <div style={{ height: "500px", maxWidth: "1000px" }}>
        <Bar options={options} data={data} />
      </div>
    </div>
  );
}
