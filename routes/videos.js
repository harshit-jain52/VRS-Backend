const express = require("express");
const router = express.Router();
const {
  createVideo,
  getVideos,
  getVideo,
  deleteVideo,
  updateVideo,
} = require("../controllers/videoController");

// POST a new video
router.post("/", createVideo);

// GET all videos
router.get("/", getVideos);

// GET a video
router.get("/:id", getVideo);

// DELETE a video
router.delete("/:id", deleteVideo);

// UPDATE a video
router.patch("/:id", updateVideo);

module.exports = router;