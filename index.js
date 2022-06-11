const express = require("express");
const app = express();
const videoRoutes = require("./routes/videos.js");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.use("/", videoRoutes);
app.use("/public-images", express.static("./public"));

app.listen(port, () => {
  console.log("The server is live on 8080!");
});
