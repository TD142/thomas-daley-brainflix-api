const express = require("express");
const router = express.Router();
const fs = require("fs");

const readVideos = () => {
  const videosData = fs.readFileSync("./data/videos.json");
  const parsedData = JSON.parse(videosData);
  return parsedData;
};

router.get("/", (req, res) => {
  res.send("welcome! please use path /videos to get started");
});

router.get("/videos", (req, res) => {
  const videos = readVideos();

  videosGroup = videos.map((videos) => {
    const {
      views,
      likes,
      duration,
      timestamp,
      comments,
      video,
      description,
      ...restOfTheData
    } = videos;

    return restOfTheData;
  });

  res.json(videosGroup);
});

router.get("/videos/:videoId", (req, res) => {
  console.log("URL Param:", req.params);

  const videos = readVideos();
  const selectedVideo = videos.find((video) => video.id === req.params.videoId);

  if (!selectedVideo) {
    res.status(404).send({
      message: "No video with that id exists",
    });
  }

  res.status(200).json(selectedVideo);
});

router.post("/videos/:id/comments", (req, res) => {
  const selectedVideo = videos.find((video) => video.id === req.params.videoId);
});

module.exports = router;
