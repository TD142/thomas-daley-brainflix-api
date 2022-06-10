const express = require("express");
const router = express.Router();
const fs = require("fs");
// const image = require("../public/Images/Upload-video-preview.jpg");
const uniqid = require("uniqid");

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
  const videos = readVideos();
  const selectedVideo = videos.find((video) => video.id === req.params.videoId);

  // const filter = videos.filter((video) => {
  //   return video.id === req.params.videoId;
  // });
  // console.log(filter[0].comments);
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
    channel: "bikefast",
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
        name: "Micheal Lyons",
        comment:
          "They BLEW the ROOF off at their last event, once everyone started figuring out they were going. This is still simply the greatest opening of an event I have EVER witnessed.",
        likes: 0,
        timestamp: 1628522461000,
      },
      {
        id: uniqid(),
        name: "Gary Wong",
        comment:
          "Every time I see him shred I feel so motivated to get off my couch and hop on my board. He’s so talented! I wish I can ride like him one day so I can really enjoy myself!",
        likes: 0,
        timestamp: 1626359541000,
      },
      {
        id: uniqid(),
        name: "Theodore Duncan",
        comment:
          "How can someone be so good!!! You can tell he lives for this and loves to do it every day. Every time I see him I feel instantly happy! He’s definitely my favorite ever!",
        likes: 0,
        timestamp: 1626011132000,
      },
    ],

    id: uniqid(),
  };

  const videos = readVideos();

  videos.push(newVideo);

  fs.writeFileSync("./data/videos.json", JSON.stringify(videos));

  res.json(newVideo);
});

router.post("/videos/:id/comments", (req, res) => {
  const newComment = {
    name: req.body.name,
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
  console.log(filteredVideo);
  comment.push(newComment);

  fs.writeFileSync("./data/videos.json", JSON.stringify(videos));

  res.json(comment);
});

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

  // newComments = comments.filter((comment) => {
  //   return comment.id !== req.params.commentId;
  // });

  // console.log(newComments);

  fs.writeFileSync("./data/videos.json", JSON.stringify(videos));

  res.json(comments);
});

module.exports = router;
