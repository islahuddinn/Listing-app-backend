const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  condition: { type: String, required: true },
  location: {
    type: { type: String, enum: ["Point"], required: true }, 
    coordinates: { type: [Number], required: true }, 
  },
  media: [
    {
      type: { type: String, enum: ["image", "video"], required: true },
      url: { type: String, required: true },
      tags: { type: [String] },
      thumbnail: { type: String },
    },
  ],
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  metadata: {
    speechToText: { type: String },
    audioTags: { type: [String] },
    videoTags: { type: [String] },
    imageTags: { type: [String] },
    enrichedDescription: { type: String },
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Listing", listingSchema);
