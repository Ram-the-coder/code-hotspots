/* eslint-disable react/prop-types */
import { flatten, get, maxBy, orderBy, sumBy } from "lodash";
import { Fragment, useEffect, useState } from "react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import axios, { all } from "axios";
import "./App.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CommitsDistribution({ hotspots }) {
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

function CommitsTable({ hotspots }) {
  const [byExtension, setByExtension] = useState(false);
  let filesByExtension = {};
  if (!byExtension) {
    filesByExtension[".*"] = {
      files: orderBy(
        flatten(Object.values(hotspots).map(({ files }) => files)),
        "commits",
        "desc"
      ),
      totalCommits: sumBy(Object.values(hotspots), "totalCommits"),
    };
  } else {
    filesByExtension = hotspots;
  }
  if (!filesByExtension) return null;
  return (
    <div>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          justifyContent: "space-between",
        }}
      >
        <h2>Commits by file</h2>
        <h3 className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            role="switch"
            id="flexSwitchCheckChecked"
            checked={byExtension}
            style={{ cursor: "pointer" }}
            onChange={() => setByExtension((v) => !v)}
          />
          <label className="form-check-label" htmlFor="flexSwitchCheckChecked">
            Group by extension
          </label>
        </h3>
      </div>

      <Masonry columnsCount={2} gutter="4rem">
        {orderBy(
          Object.entries(filesByExtension),
          ([, { totalCommits }]) => totalCommits,
          "desc"
        ).map(([extension, { files, totalCommits }]) => {
          return (
            <div key={extension}>
              <h4>
                {extension} ({totalCommits})
              </h4>
              <table className="table" style={{ width: "fit-content" }}>
                <thead>
                  <tr>
                    <th>Commits</th>
                    <th>Filename</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.name}>
                      <td style={{ textAlign: "right" }}>{file.commits}</td>
                      <td>{file.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </Masonry>
    </div>
  );
}

function App() {
  const [hotspots, setHotspots] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:8080/", {
        params: {
          dir: "C:/Coding/Web Development/chess-engine-v2",
        },
      })
      .then((res) => setHotspots(res.data.hotspots));
  }, []);

  return (
    <div style={{ padding: "5rem" }}>
      <h1>Code Hotspots</h1>
      <section>
        <CommitsDistribution hotspots={hotspots} />
      </section>
      <section>
        <CommitsTable hotspots={hotspots} />
      </section>
    </div>
  );
}

export default App;
