const express = require("express");
const router = express.Router();
const {
  createVideo,
  getVideos,
  getVideosByGenre,
  getVideo,
} = require("../controllers/videoController");

// POST a new video
router.post("/", createVideo);

// GET all videos
router.get("/", getVideos);

// GET videos by genre
router.get("/genre/:genre", getVideosByGenre);

// GET a video
router.get("/:id", getVideo);

module.exports = router;
