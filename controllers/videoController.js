const Video = require("../models/videoModel");
const mongoose = require("mongoose");

// POST a new video
const createVideo = async (req, res) => {
  try {
    const video = await Video.create({ ...req.body });
    res.status(200).json(video);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// GET all videos
const getVideos = async (req, res) => {
  const videos = await Video.find({});

  res.status(200).json(videos);
};

// GET videos by genre
const getVideosByGenre = async (req, res) => {
  const { genre } = req.params;
  const videos = await Video.find({ genre: { $in: [genre] } });

  res.status(200).json(videos);
};

// GET a video
const getVideo = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such video found" });
  }

  const video = await Video.findById(id);
  if (!video) {
    return res.status(400).json({ error: "No such video found" });
  }

  res.status(200).json(video);
};

module.exports = {
  createVideo,
  getVideos,
  getVideosByGenre,
  getVideo,
};
