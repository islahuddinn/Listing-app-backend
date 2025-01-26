const Listing = require("../models/listingModel");
const { extractMVL, enrichMetadata,  } = require("../utills/metaData");
const { saveVideoFrames, transcribeAudio } = require("../utills/videoProcessing");
const { uploadFile } = require("../utills/s3Uploader");
const { AppError } = require("../utills/appError");



module.exports = {

  async createListing(req, res) {
    try {
      const videoFile = req.file;
      if (!videoFile) {
      return next(new AppError("Video file is required", 400));

      }

      const { title, price, condition, description, location } = req.body;
       const videoS3Url = await uploadFile({
         name: videoFile.name,
         data: videoFile.data,
       });
      const transcription = await transcribeAudio(videoS3Url);

      const { isValidMVL, missingFields } = extractMVL({
        transcription,
        price,
        condition,
        description,
      });

      if (!isValidMVL) {
        return res.status(400).json({
          error: "MVL validation failed",
          missingFields,
        });
      }

      const enrichedMetadata = await enrichMetadata({
        transcription,
        videoPath: videoS3Url,
      });

      const listing = new Listing({
        title: title || enrichedMetadata.generatedTitle,
        description,
        price,
        condition,
        location,
        media: [
          {
            type: "video",
            url: videoS3Url,
            thumbnail: enrichedMetadata.thumbnail,
          },
        ],
        metadata: enrichedMetadata,
        created_by: req.user._id,
      });

      await listing.save();
      return res
        .status(201)
        .json({ message: "Listing created successfully", listing });
    } catch (error) {
      console.error("Error creating listing:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  },

  async getListings(req, res) {
    try {
      const listings = await Listing.find();
      res.status(200).send(listings);
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async updateListing(req, res) {
    try {
      const listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      if (!listing)
        return res.status(404).send({ message: "Listing not found" });
      res.status(200).send(listing);
    } catch (error) {
      res.status(400).send(error);
    }
  },

  async deleteListing(req, res) {
    try {
      const listing = await Listing.findByIdAndDelete(req.params.id);
      if (!listing)
        return res.status(404).send({ message: "Listing not found" });
      res.status(200).send({ message: "Listing deleted" });
    } catch (error) {
      res.status(500).send(error);
    }
  },
};
