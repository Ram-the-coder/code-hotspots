/* eslint-disable react/prop-types */
import { flatten, orderBy, sumBy } from "lodash";
import { useState } from "react";
import Masonry from "react-responsive-masonry";

export default function CommitsTable({ hotspots }) {
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
