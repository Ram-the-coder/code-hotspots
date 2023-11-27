const { getHotspots } = require("./hotspots");
const bodyParser = require("body-parser");
const express = require("express");
var cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const port = 8080;

app.get("/", async (req, res) => {
  const directory = req.query.dir;
  try {
    const hotspots = await getHotspots(directory);
    console.log({ hotspots });
    res.json({ hotspots });
  } catch (e) {
    console.error(e);
    res.status(500).send();
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
