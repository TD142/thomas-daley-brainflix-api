const express = require("express");
const router = express.Router();
const fs = require("fs");

const uniqid = require("uniqid");

const readVideos = () => {
  const videosData = fs.readFileSync("./data/videos.json");
  const parsedData = JSON.parse(videosData);
  return parsedData;
};

router.get("/", (req, res) => {
  res.send("welcome! please use path /videos to get started");
});

//**  Get request uses map and destructuring to store only the data needed in ...restOfTheData

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

  res.status(200).json(videosGroup);
});

//**  Paramater end point compares id's from the request and file storing the result in selectedVideo. 404 page if no match is made.

router.get("/videos/:id", (req, res) => {
  const videos = readVideos();
  const selectedVideo = videos.find((video) => video.id === req.params.id);

  if (!selectedVideo) {
    res.status(404).send({
      message: "No video with that id exists",
    });
  }

  res.status(200).json(selectedVideo);
});

router.post("/videos", (req, res) => {
  const newVideo = {
    title: req.body.title,
    channel: "Bike Fast",
    image:
      "http://localhost:8080/public-images/images/upload-video-preview.jpg",
    description: req.body.description,
    views: "2,002,043",
    likes: "320,984",
    duration: "5:06",
    video: "https://project-2-api.herokuapp.com/stream",
    timestamp: Date.now(),
    comments: [
      {
        id: uniqid(),
        name: "BikingForever",
        comment:
          "After watching this video i can now pull a wheelie for 10 miles!",
        likes: 0,
        timestamp: 1628522461000,
      },
      {
        id: uniqid(),
        name: "BikeAllDay",
        comment:
          "This video taught me how to ride a bike, when taking a break from coding!",
        likes: 0,
        timestamp: 1626359541000,
      },
    ],

    id: uniqid(),
  };

  const videos = readVideos();

  videos.push(newVideo);

  fs.writeFileSync("./data/videos.json", JSON.stringify(videos));

  res.status(201).json(newVideo);
});

//** Post endpoint for the comments. Compares req paramater id with file id, the pushes the new comment to that array.

router.post("/videos/:id/comments", (req, res) => {
  const newComment = {
    name: "User",
    comment: req.body.comment,
    likes: 0,
    timestamp: Date.now(),
    id: uniqid(),
  };

  const videos = readVideos();

  const filteredVideo = videos.filter((video) => {
    return video.id === req.params.id;
  });

  const comment = filteredVideo[0].comments;

  comment.push(newComment);

  fs.writeFileSync("./data/videos.json", JSON.stringify(videos));

  res.status(201).json(comment);
});

//** Delete endpoint for the comments. Once filtered comment is returned, comments are iterated over with with id being compared to paramter id. The match is then removed from the array using splice. Mutation is needed here instead of filter.

router.delete("/videos/:videoId/comments/:commentId", (req, res) => {
  const videos = readVideos();

  const filteredVideo = videos.filter((video) => {
    return video.id === req.params.videoId;
  });

  const comments = filteredVideo[0].comments;

  for (let i = 0; i < comments.length; i++) {
    if (comments[i].id === req.params.commentId) {
      comments.splice(i, 1);
    }
  }

  fs.writeFileSync("./data/videos.json", JSON.stringify(videos));

  res.status(200).json(comments);
});

module.exports = router;
