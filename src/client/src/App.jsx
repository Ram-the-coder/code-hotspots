/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import { GIT_REPO, WEB_SERVER_ENDPOINT } from "./constants";
import CommitsDistribution from "./components/CommitsDistribution";
import CommitsTable from "./components/CommitsTable";

function App() {
  const [hotspots, setHotspots] = useState({});

  useEffect(() => {
    axios
      .get(WEB_SERVER_ENDPOINT, { params: { dir: GIT_REPO } })
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
