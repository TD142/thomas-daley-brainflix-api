const express = require("express");
const app = express();
const videoRoutes = require("./routes/videos.js");
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/", videoRoutes);

app.listen(8080, () => {
  console.log("The server is live on 8080!");
});
